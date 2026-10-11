from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from accounts.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ["email"]
    list_display = ["email", "display_name", "is_advisor", "is_staff", "is_active"]
    list_filter = ["is_advisor", "is_staff", "is_active"]
    search_fields = ["email", "display_name"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Profil", {"fields": ["display_name", "is_advisor"]}),
        ("Droits techniques", {"fields": ["is_active", "is_staff", "is_superuser"]}),
        ("Dates", {"fields": ["last_login", "date_joined"]}),
    ]
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "display_name", "is_advisor", "password1", "password2"],
            },
        ),
    ]
    readonly_fields = ["last_login", "date_joined"]
