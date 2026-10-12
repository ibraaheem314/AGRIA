"""Assistance en mode accompagné : compte bloqué ou mot de passe oublié.

    manage.py assist_account --email x@exemple.sn --status
    manage.py assist_account --email x@exemple.sn --reset-password   # affiché une seule fois
    manage.py assist_account --email x@exemple.sn --reactivate

Réinitialiser le mot de passe ferme aussi les sessions ouvertes du compte (Django les invalide
quand le mot de passe change). Aucun email n'est envoyé : la personne qui accompagne transmet
le nouveau mot de passe de vive voix ou par un canal sûr.
"""

import secrets

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Assistance d'un compte : état, réinitialisation du mot de passe, réactivation."

    def add_arguments(self, parser):
        parser.add_argument("--email", required=True)
        parser.add_argument("--status", action="store_true", help="affiche l'état du compte")
        parser.add_argument("--reset-password", action="store_true")
        parser.add_argument("--reactivate", action="store_true")

    def handle(self, *args, **opts):
        user = get_user_model().objects.filter(email__iexact=opts["email"].strip()).first()
        if user is None:
            raise CommandError("Aucun compte avec cet email.")
        if not (opts["status"] or opts["reset_password"] or opts["reactivate"]):
            raise CommandError("Préciser --status, --reset-password ou --reactivate.")
        if opts["reactivate"]:
            user.is_active = True
            user.save(update_fields=["is_active"])
            self.stdout.write(self.style.SUCCESS(f"Compte réactivé : {user.email}"))
        if opts["reset_password"]:
            password = secrets.token_urlsafe(12)
            user.set_password(password)
            user.save(update_fields=["password"])
            self.stdout.write(self.style.SUCCESS(f"Mot de passe réinitialisé : {user.email}"))
            self.stdout.write(f"Nouveau mot de passe (affiché une seule fois) : {password}")
        if opts["status"]:
            role = "conseiller" if user.is_advisor else "porteur"
            active = "actif" if user.is_active else "désactivé"
            last = user.last_login.strftime("%d/%m/%Y %H:%M") if user.last_login else "jamais"
            self.stdout.write(f"{user.email} : {role}, {active}, dernière connexion : {last}")
            self.stdout.write(
                "Après trop de tentatives (10 par minute et par adresse), la connexion est "
                "simplement refusée une minute : attendre, rien à débloquer."
            )
