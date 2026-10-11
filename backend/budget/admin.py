from django.contrib import admin

from budget.models import BudgetLine


@admin.register(BudgetLine)
class BudgetLineAdmin(admin.ModelAdmin):
    """Consultation seulement : les postes appartiennent au porteur du projet."""

    list_display = ["label", "campaign", "category", "price_status", "removed_at"]
    list_filter = ["category", "price_status"]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
