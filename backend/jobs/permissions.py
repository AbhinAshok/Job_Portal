from rest_framework import permissions

class IsJobOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission to allow only the recruiter who posted the job to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.recruiter == request.user