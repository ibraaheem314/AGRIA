from django.db import DatabaseError, connection, transaction
from django.db.migrations.executor import MigrationExecutor
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@transaction.non_atomic_requests
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def health(request):
    """État réel du serveur : la base répond-elle et les migrations sont-elles appliquées ?"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        executor = MigrationExecutor(connection)
        pending = executor.migration_plan(executor.loader.graph.leaf_nodes())
    except DatabaseError:
        return Response(
            {"status": "indisponible", "database": "injoignable", "migrations": "inconnu"},
            status=503,
        )
    if pending:
        return Response(
            {"status": "incomplet", "database": "ok", "migrations": "en_attente"},
            status=503,
        )
    return Response({"status": "ok", "database": "ok", "migrations": "a_jour"})
