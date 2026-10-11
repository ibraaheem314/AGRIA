"""Format d'erreur unique de l'API.

Toute erreur renvoyée par /api/ a la forme :

    {"error": {"code": "...", "message": "...", "fields": {...}}}

`fields` n'est présent que pour les erreurs de validation. Les messages sont en
français et ne contiennent ni trace d'exécution ni détail interne.
"""

import logging

from django.db import DatabaseError
from django.http import JsonResponse
from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import exception_handler, set_rollback

logger = logging.getLogger("agria.errors")

UNAVAILABLE_MESSAGE = (
    "Le service est momentanément indisponible. Vos données n'ont pas été modifiées."
)


class Conflict(exceptions.APIException):
    """Écriture refusée car l'objet a changé depuis sa lecture (409)."""

    status_code = status.HTTP_409_CONFLICT
    default_detail = "Cet élément a été modifié entre-temps. Rechargez-le avant de réessayer."
    default_code = "conflit"


class BusinessRuleViolation(exceptions.APIException):
    """Opération refusée par une règle métier explicite (409)."""

    status_code = status.HTTP_409_CONFLICT
    default_detail = "Opération impossible dans l'état actuel."
    default_code = "regle_metier"


def error_body(code: str, message: str, fields: dict | None = None) -> dict:
    body: dict = {"code": code, "message": message}
    if fields:
        body["fields"] = fields
    return {"error": body}


CODES = {
    exceptions.NotAuthenticated: ("non_connecte", "Connexion requise."),
    exceptions.AuthenticationFailed: ("non_connecte", "Connexion requise."),
    exceptions.PermissionDenied: ("acces_refuse", "Accès refusé."),
    exceptions.NotFound: ("introuvable", "Élément introuvable."),
    exceptions.MethodNotAllowed: ("methode_refusee", "Méthode non autorisée."),
    exceptions.Throttled: ("trop_de_requetes", "Trop de tentatives. Réessayez dans un moment."),
    exceptions.ParseError: ("requete_invalide", "Requête illisible."),
    exceptions.UnsupportedMediaType: ("requete_invalide", "Format de requête non pris en charge."),
}


def _flatten(detail) -> object:
    if isinstance(detail, dict):
        return {key: _flatten(value) for key, value in detail.items()}
    if isinstance(detail, list):
        return [_flatten(item) if isinstance(item, (dict, list)) else str(item) for item in detail]
    return str(detail)


def api_exception_handler(exc, context):
    if isinstance(exc, DatabaseError):
        logger.exception("Erreur de base de données")
        set_rollback()
        return Response(
            error_body("service_indisponible", UNAVAILABLE_MESSAGE),
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    response = exception_handler(exc, context)
    if response is None:
        return None  # erreur inattendue : Django renvoie handler500 (JSON pour /api/)

    if isinstance(exc, exceptions.ValidationError):
        detail = exc.detail
        if isinstance(detail, dict):
            non_field = detail.get("non_field_errors")
            fields = {k: v for k, v in _flatten(detail).items() if k != "non_field_errors"}
            message = str(non_field[0]) if non_field else "Certaines informations sont invalides."
        else:
            fields = None
            items = _flatten(detail)
            message = items[0] if isinstance(items, list) and items else str(items)
        response.data = error_body("validation", message, fields or None)
        return response

    for exc_class, (code, message) in CODES.items():
        if isinstance(exc, exc_class):
            if isinstance(exc, exceptions.Throttled) and exc.wait:
                message = f"Trop de tentatives. Réessayez dans {int(exc.wait) + 1} secondes."
            response.data = error_body(code, message)
            return response

    codes = exc.get_codes()
    code = codes if isinstance(codes, str) else getattr(exc, "default_code", "erreur")
    response.data = error_body(code, str(exc.detail))
    return response


def _wants_json(request) -> bool:
    return request.path.startswith("/api/")


def not_found(request, exception=None):
    if _wants_json(request):
        return JsonResponse(error_body("introuvable", "Adresse inconnue."), status=404)
    from django.views.defaults import page_not_found

    return page_not_found(request, exception)


def server_error(request):
    if _wants_json(request):
        return JsonResponse(
            error_body("erreur_interne", "Erreur interne. Vos données n'ont pas été modifiées."),
            status=500,
        )
    from django.views.defaults import server_error as default_server_error

    return default_server_error(request)


def csrf_failure(request, reason=""):
    if _wants_json(request):
        return JsonResponse(
            error_body("csrf", "Session expirée ou requête refusée. Rechargez la page."),
            status=403,
        )
    from django.views.csrf import csrf_failure as default_csrf_failure

    return default_csrf_failure(request, reason)


class DatabaseUnavailableMiddleware:
    """Base injoignable (y compris à l'ouverture de la transaction de requête) : 503 explicite."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        if isinstance(exception, DatabaseError) and _wants_json(request):
            logger.exception("Base de données indisponible")
            return JsonResponse(
                error_body("service_indisponible", UNAVAILABLE_MESSAGE),
                status=503,
            )
        return None
