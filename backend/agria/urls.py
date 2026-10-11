from django.contrib import admin
from django.urls import path

from accounts import api as accounts_api
from agria.health import health
from dossiers import api as dossiers_api
from preparation import api as preparation_api

handler404 = "agria.errors.not_found"
handler500 = "agria.errors.server_error"

admin.site.site_header = "AGRIA — administration"
admin.site.site_title = "AGRIA"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health", health, name="health"),
    # Comptes
    path("api/auth/me", accounts_api.me),
    path("api/auth/login", accounts_api.login_view),
    path("api/auth/register", accounts_api.register_view),
    path("api/auth/logout", accounts_api.logout_view),
    # Projets et dossiers
    path("api/projects", dossiers_api.projects),
    path("api/projects/<int:project_id>/campaigns", dossiers_api.project_campaigns),
    path("api/dossiers", dossiers_api.dossiers),
    path("api/dossiers/<int:campaign_id>", dossiers_api.dossier),
    path("api/dossiers/<int:campaign_id>/informations/<str:key>", dossiers_api.fact),
    path(
        "api/dossiers/<int:campaign_id>/informations/<str:key>/historique",
        dossiers_api.fact_history,
    ),
    # Vérifications et plan d'action
    path("api/dossiers/<int:campaign_id>/preparation", preparation_api.preparation),
    path("api/dossiers/<int:campaign_id>/actions", preparation_api.actions),
    path("api/dossiers/<int:campaign_id>/actions/<int:action_id>", preparation_api.action_detail),
    path(
        "api/dossiers/<int:campaign_id>/actions/<int:action_id>/historique",
        preparation_api.action_history,
    ),
]
