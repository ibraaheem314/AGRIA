from rest_framework import exceptions
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import SAFE_METHODS


class CsrfFailed(exceptions.PermissionDenied):
    default_detail = "Session expirée ou requête refusée. Rechargez la page."
    default_code = "csrf"


class CsrfSessionAuthentication(SessionAuthentication):
    """Session Django, avec contrôle CSRF sur toute écriture.

    DRF ne vérifie le jeton CSRF que pour un utilisateur déjà connecté. Ici, la
    connexion et l'inscription (requêtes anonymes) sont aussi protégées, ce qui
    empêche un site tiers de connecter un navigateur à un compte choisi.
    """

    def authenticate(self, request):
        if request.method not in SAFE_METHODS:
            self.enforce_csrf(request)
        user = getattr(request._request, "user", None)
        if not user or not user.is_active:
            return None
        return (user, None)

    def authenticate_header(self, request):
        # Permet à DRF de répondre 401 (non connecté) plutôt que 403 (accès refusé).
        return 'Session realm="agria"'

    def enforce_csrf(self, request):
        try:
            super().enforce_csrf(request)
        except exceptions.PermissionDenied as exc:
            raise CsrfFailed() from exc
