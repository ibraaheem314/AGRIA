from django.contrib import admin

from reviews.models import Comment, Decision, Review, ReviewRequest


class ReadOnlyAdmin(admin.ModelAdmin):
    """Consultation seulement : avis, messages et décisions ne se modifient pas."""

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Review)
class ReviewAdmin(ReadOnlyAdmin):
    list_display = ["campaign", "advisor", "verdict", "created_at"]


@admin.register(ReviewRequest)
class ReviewRequestAdmin(ReadOnlyAdmin):
    list_display = ["campaign", "requested_by", "created_at"]


@admin.register(Comment)
class CommentAdmin(ReadOnlyAdmin):
    list_display = ["campaign", "author", "kind", "created_at"]


@admin.register(Decision)
class DecisionAdmin(ReadOnlyAdmin):
    list_display = ["campaign", "author", "choice", "created_at"]
