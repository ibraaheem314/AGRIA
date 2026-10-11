from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models.functions import Lower


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra):
        if not email:
            raise ValueError("L'adresse email est obligatoire.")
        user = self.model(email=self.normalize_email(email).lower(), **extra)
        user.set_password(password)  # None => mot de passe inutilisable
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra)

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        if not extra["is_staff"] or not extra["is_superuser"]:
            raise ValueError("Un super-utilisateur doit avoir is_staff et is_superuser.")
        return self._create_user(email, password, **extra)


class User(AbstractUser):
    """Compte d'accès. L'email sert d'identifiant ; aucun nom d'utilisateur séparé."""

    username = None
    first_name = None
    last_name = None
    email = models.EmailField("adresse email", unique=True)
    display_name = models.CharField("nom affiché", max_length=80)
    is_advisor = models.BooleanField(
        "conseiller",
        default=False,
        help_text="Peut recevoir l'attribution de dossiers. Ne donne accès à aucun dossier en soi.",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["display_name"]

    objects = UserManager()

    class Meta:
        verbose_name = "compte"
        verbose_name_plural = "comptes"
        constraints = [
            models.UniqueConstraint(Lower("email"), name="accounts_user_email_ci_unique"),
        ]

    def __str__(self):
        return f"{self.display_name} <{self.email}>"
