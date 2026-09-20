from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count

from .models import Job
from .serializers import JobListSerializer, JobDetailSerializer           
from .filters import filter_jobs
from .permissions import IsJobOwnerOrReadOnly
from accounts.permissions import IsRecruiter


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobListSerializer  # default fallback (e.g. for browsable API root)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location', 'category', 'tags', 'company__name']
    ordering_fields = ['created_at', 'salary_min', 'salary_max', 'title']
    ordering = ['-created_at']

    base_queryset = (
        Job.objects
        .select_related('company', 'recruiter')
        .annotate(applicant_count=Count('applications', distinct=True))
    )

    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        return JobDetailSerializer

    def get_queryset(self):
        qs = self.base_queryset
        
        user = self.request.user
        is_staff_role = user.is_authenticated and (user.role in ('RECRUITER', 'ADMIN') or user.is_superuser)

        if self.action == 'list' and not is_staff_role:
            qs = qs.filter(is_active=True)

        return filter_jobs(qs, self.request.query_params)

    def get_permissions(self):
        if self.action == 'create':
            perms = [permissions.IsAuthenticated, IsRecruiter]
        elif self.action in ['update', 'partial_update', 'destroy']:
            perms = [permissions.IsAuthenticated, IsJobOwnerOrReadOnly]
        elif self.action in ['mine', 'my_jobs']:
            perms = [permissions.IsAuthenticated, IsRecruiter]
        else:
            perms = [permissions.AllowAny]
        return [p() for p in perms]

    @action(detail=False, methods=['get'])
    def my_jobs(self, request):
        qs = self.get_queryset().filter(recruiter=request.user)
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(
                self.get_serializer(page, many=True).data
            )
        return Response(self.get_serializer(qs, many=True).data)