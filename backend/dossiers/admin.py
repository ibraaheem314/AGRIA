from django.contrib import admin
from django.utils import timezone

from dossiers.models import AdvisorAssignment, Campaign, Fact, Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "profile", "is_demo", "created_at"]
    list_filter = ["profile", "is_demo"]
    search_fields = ["name", "owner__email"]
    readonly_fields = ["owner", "created_at", "updated_at"]


class AssignmentInline(admin.TabularInline):
    model = AdvisorAssignment
    fields = ["advisor", "assigned_by", "started_at", "ended_at"]
    readonly_fields = ["assigned_by", "started_at"]
    extra = 0


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    """Sert surtout à attribuer un conseiller. Les données du dossier restent en lecture seule."""

    list_display = ["__str__", "context_version", "archived_at", "updated_at"]
    search_fields = ["label", "project__name", "project__owner__email"]
    readonly_fields = ["project", "context_version", "created_at", "updated_at"]
    inlines = [AssignmentInline]

    def save_formset(self, request, form, formset, change):
        for obj in formset.save(commit=False):
            if isinstance(obj, AdvisorAssignment) and obj.assigned_by_id is None:
                obj.assigned_by = request.user
            obj.save()
        for obj in formset.deleted_objects:
            # Une attribution n'est jamais effacée : elle est close (traçabilité).
            obj.ended_at = obj.ended_at or timezone.now()
            obj.save()


@admin.register(Fact)
class FactAdmin(admin.ModelAdmin):
    list_display = ["campaign", "key", "status", "updated_at"]
    list_filter = ["status", "key"]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
