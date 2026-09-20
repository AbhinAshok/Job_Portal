import logging
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Application
from .serializers import (
    ApplicationListSerializer, ApplicationDetailSerializer,
    ApplicationStatusUpdateSerializer,
)
from .services import notify_status_change
from accounts.permissions import IsCandidate, IsRecruiter

logger = logging.getLogger(__name__)


class ApplicationViewSet(viewsets.ModelViewSet):
    
    http_method_names = ['get', 'post', 'head', 'options']

    def get_serializer_class(self):
        return ApplicationListSerializer if self.action == 'list' else ApplicationDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Application.objects.none()

        qs = (
            Application.objects
            .select_related('job', 'job__company', 'resume', 'candidate')
        )
        if getattr(user, 'role', None) == 'RECRUITER':
            return qs.filter(job__recruiter=user)
        if getattr(user, 'role', None) == 'CANDIDATE':
            return qs.filter(candidate=user)
        if user.is_superuser:
            return qs
        return Application.objects.none()

    def get_permissions(self):
        if self.action == 'create':
            perms = [permissions.IsAuthenticated, IsCandidate]
        elif self.action == 'update_status':
            perms = [permissions.IsAuthenticated, IsRecruiter]
        else:
            perms = [permissions.IsAuthenticated]
        return [p() for p in perms]

    @action(detail=True, methods=['patch'],
            serializer_class=ApplicationStatusUpdateSerializer)
    def update_status(self, request, pk=None):
        
        application = self.get_object()
        serializer = ApplicationStatusUpdateSerializer(
            application, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        old_status = application.status
        serializer.save()
        new_status = application.status

        if old_status != new_status:
            try:
                notify_status_change(application, new_status, request.user)
            except Exception:
                logger.exception(
                    "notify_status_change failed for application %s", application.pk
                )

        return Response(ApplicationDetailSerializer(application).data)