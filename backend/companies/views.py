from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Company
from .serializers import CompanySerializer
from accounts.permissions import IsRecruiter, IsOwnerOrReadOnly


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.select_related('recruiter').all()      # ← changed
    serializer_class = CompanySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'industry', 'location']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']                                         # ← added default

    def get_permissions(self):
        if self.action == 'create':
            perms = [permissions.IsAuthenticated, IsRecruiter]
        elif self.action in ['update', 'partial_update', 'destroy']:
            perms = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        else:
            perms = [permissions.AllowAny]
        return [p() for p in perms]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):                                            # ← new
        qs = self.get_queryset().filter(recruiter=request.user)
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(
                self.get_serializer(page, many=True).data
            )
        return Response(self.get_serializer(qs, many=True).data)