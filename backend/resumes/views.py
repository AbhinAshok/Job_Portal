from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from accounts.permissions import IsCandidate, IsOwnerOrReadOnly

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Resume.objects.none()
        if getattr(user, 'role', None) == 'RECRUITER' or user.is_staff:
            return Resume.objects.all()
        return Resume.objects.filter(candidate=user)

    def get_permissions(self):
        if self.action in ['create', 'set_default']:
            permission_classes = [permissions.IsAuthenticated, IsCandidate]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        resume = self.get_object()
        resume.is_default = True
        resume.save()
        return Response(self.get_serializer(resume).data, status=status.HTTP_200_OK)
