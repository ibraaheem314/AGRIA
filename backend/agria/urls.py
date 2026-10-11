from django.contrib import admin
from django.urls import path

from agria.health import health

handler404 = "agria.errors.not_found"
handler500 = "agria.errors.server_error"

admin.site.site_header = "AGRIA — administration"
admin.site.site_title = "AGRIA"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health", health, name="health"),
]
