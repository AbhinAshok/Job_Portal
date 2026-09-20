import logging

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Interview
from .serializers import InterviewSerializer, InterviewStatusUpdateSerializer
from accounts.permissions import IsRecruiter, IsOwnerOrReadOnly
from notifications.models import Notification

logger = logging.getLogger(__name__)


class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Interview.objects.none()

        qs = Interview.objects.select_related(
            'application', 'application__job', 'application__job__company',
            'candidate', 'recruiter',
        )

        if user.is_superuser:
            return qs
        if getattr(user, 'role', None) == 'RECRUITER':
            return qs.filter(recruiter=user)
        if getattr(user, 'role', None) == 'CANDIDATE':
            return qs.filter(candidate=user)
        return Interview.objects.none()

    def get_permissions(self):
        if self.action == 'create':
            perms = [permissions.IsAuthenticated, IsRecruiter]
        elif self.action in ['update', 'partial_update', 'destroy', 'update_status']:
            perms = [permissions.IsAuthenticated, IsRecruiter, IsOwnerOrReadOnly]
        else:
            perms = [permissions.IsAuthenticated]
        return [p() for p in perms]

    def perform_create(self, serializer):
        interview = serializer.save()

        # bump application status (only if it makes sense)
        application = interview.application
        if application.status not in ('rejected', 'hired'):
            application.status = 'interview'
            application.save(update_fields=['status'])

        # notify candidate
        try:
            Notification.objects.create(
                recipient=interview.candidate,
                sender=self.request.user,
                title=f"Interview Scheduled for {application.job.title}",
                message=(
                    f"An interview has been scheduled for "
                    f"{interview.scheduled_at.strftime('%Y-%m-%d %H:%M')}."
                ),
                notification_type='interview_scheduled',
            )
        except Exception:
            logger.exception(
                "Interview notification failed for interview %s", interview.pk
            )

    @action(detail=True, methods=['patch'],
            serializer_class=InterviewStatusUpdateSerializer)
    def update_status(self, request, pk=None):
        interview = self.get_object()
        serializer = InterviewStatusUpdateSerializer(
            interview, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        old = interview.status
        serializer.save()
        new = interview.status

        if old != new and new == 'cancelled':
            try:
                Notification.objects.create(
                    recipient=interview.candidate,
                    sender=request.user,
                    title=f"Interview Cancelled for {interview.application.job.title}",
                    message="Your interview has been cancelled.",
                    notification_type='interview_cancelled',
                )
            except Exception:
                logger.exception(
                    "Cancellation notification failed for interview %s", interview.pk
                )

        return Response(InterviewSerializer(interview).data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        qs = self.get_queryset().filter(
            scheduled_at__gte=timezone.now(),
            status='scheduled',
        )
        page = self.paginate_queryset(qs)
        ser = self.get_serializer(page or qs, many=True)
        return self.get_paginated_response(ser.data) if page is not None else Response(ser.data)