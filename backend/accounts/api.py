from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.middleware.csrf import get_token
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle

User = get_user_model()


class AuthThrottle(SimpleRateThrottle):
    """Limite les tentatives de connexion et d'inscription par adresse IP."""

    scope = "auth"

    def get_cache_key(self, request, view):
        return self.cache_format % {"scope": self.scope, "ident": self.get_ident(request)}


def user_payload(user) -> dict:
    return {
        "id": user.pk,
        "email": user.email,
        "display_name": user.display_name,
        "is_advisor": user.is_advisor,
    }


@api_view(["GET"])
@permission_classes([AllowAny])
def me(request):
    """Utilisateur courant (ou null). Pose aussi le cookie CSRF utilisé par l'interface."""
    get_token(request._request)
    user = request.user if request.user.is_authenticated else None
    return Response({"user": user_payload(user) if user else None, "signup": _signup_open()})


def _signup_open() -> bool:
    return bool(settings.AGRIA_ALLOW_SIGNUP)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(error_messages={"invalid": "Adresse email invalide."})
    password = serializers.CharField(trim_whitespace=False, max_length=200)


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AuthThrottle])
def login_view(request):
    data = LoginSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    user = authenticate(
        request._request,
        username=data.validated_data["email"].strip().lower(),
        password=data.validated_data["password"],
    )
    if user is None:
        # Message identique que le compte existe ou non.
        raise AuthenticationFailed("Email ou mot de passe incorrect.")
    login(request._request, user)
    return Response({"user": user_payload(user)})


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(error_messages={"invalid": "Adresse email invalide."})
    display_name = serializers.CharField(min_length=2, max_length=80)
    password = serializers.CharField(trim_whitespace=False, max_length=200)

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Un compte existe déjà avec cette adresse.")
        return value

    def validate(self, attrs):
        candidate = User(email=attrs["email"], display_name=attrs["display_name"])
        try:
            validate_password(attrs["password"], user=candidate)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)}) from exc
        return attrs


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AuthThrottle])
def register_view(request):
    if not _signup_open():
        raise PermissionDenied("L'inscription libre est fermée : demandez un compte à l'équipe.")
    data = RegisterSerializer(data=request.data)
    data.is_valid(raise_exception=True)
    user = User.objects.create_user(
        email=data.validated_data["email"],
        password=data.validated_data["password"],
        display_name=data.validated_data["display_name"].strip(),
    )
    login(request._request, user, backend="django.contrib.auth.backends.ModelBackend")
    return Response({"user": user_payload(user)}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request._request)
    return Response(status=status.HTTP_204_NO_CONTENT)
