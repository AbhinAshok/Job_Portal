from rest_framework import permissions


class IsCandidate(permissions.BasePermission):
    message = "Only candidates can access this."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'CANDIDATE'
        )


class IsRecruiter(permissions.BasePermission):
    message = "Only recruiters can access this."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'RECRUITER'
        )


class IsAdmin(permissions.BasePermission):
    message = "Only admins can access this."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == 'ADMIN' or request.user.is_superuser)
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level: only the owner can modify; anyone can read."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = (
            getattr(obj, 'user', None)
            or getattr(obj, 'candidate', None)
            or getattr(obj, 'recruiter', None)
        )
        return owner == request.user