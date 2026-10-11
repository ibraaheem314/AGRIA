from django.contrib import admin

from preparation.models import Action, ActionEvent, PreparationTemplate


class ReadOnlyAdmin(admin.ModelAdmin):
    """Consultation seulement : contenu versionné (fichiers) et données du porteur."""

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(PreparationTemplate)
class TemplateAdmin(ReadOnlyAdmin):
    list_display = ["code", "version", "title", "review_status", "loaded_at"]


@admin.register(Action)
class ActionAdmin(ReadOnlyAdmin):
    list_display = ["title", "campaign", "status", "updated_at"]
    list_filter = ["status"]


@admin.register(ActionEvent)
class ActionEventAdmin(ReadOnlyAdmin):
    list_display = ["action", "from_status", "to_status", "author", "created_at"]
