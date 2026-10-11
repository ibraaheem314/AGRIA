import getpass
import secrets

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Crée un compte (porteur ou conseiller). Le mot de passe est saisi ou tiré au hasard."

    def add_arguments(self, parser):
        parser.add_argument("--email", required=True)
        parser.add_argument("--name", required=True, help="nom affiché")
        parser.add_argument("--advisor", action="store_true", help="compte conseiller")
        parser.add_argument(
            "--random-password",
            action="store_true",
            help="génère un mot de passe aléatoire, affiché une seule fois",
        )

    def handle(self, *args, **opts):
        User = get_user_model()
        email = opts["email"].strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise CommandError(f"Un compte existe déjà pour {email}.")
        if opts["random_password"]:
            password = secrets.token_urlsafe(12)
        else:
            password = getpass.getpass("Mot de passe : ")
            if password != getpass.getpass("Confirmation : "):
                raise CommandError("Les deux saisies diffèrent.")
        candidate = User(email=email, display_name=opts["name"])
        try:
            validate_password(password, user=candidate)
        except ValidationError as exc:
            raise CommandError(" ".join(exc.messages)) from exc
        User.objects.create_user(
            email=email, password=password, display_name=opts["name"], is_advisor=opts["advisor"]
        )
        role = "conseiller" if opts["advisor"] else "porteur"
        self.stdout.write(self.style.SUCCESS(f"Compte {role} créé : {email}"))
        if opts["random_password"]:
            self.stdout.write(
                f"Mot de passe (à transmettre de façon sûre, non conservé) : {password}"
            )
