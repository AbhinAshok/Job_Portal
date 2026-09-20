from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q

from .models import Message
from .serializers import MessageSerializer


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        return (
            Message.objects
            .filter(Q(sender=user) | Q(recipient=user))
            .select_related('sender', 'recipient', 'application')
            .order_by('-created_at')
        )

    @action(detail=False, methods=['get'], url_path=r'thread/(?P<user_id>\d+)')
    def thread(self, request, user_id=None):
        other_id = int(user_id)
        qs = (
            Message.objects
            .filter(
                (Q(sender=request.user) & Q(recipient_id=other_id)) |
                (Q(sender_id=other_id) & Q(recipient=request.user))
            )
            .select_related('sender', 'recipient', 'application')
            .order_by('-created_at')  # newest first for pagination
        )

        
        qs.filter(recipient=request.user, is_read=False).update(is_read=True)

        page = self.paginate_queryset(qs)
        ser = self.get_serializer(page or qs, many=True)
        return self.get_paginated_response(ser.data) if page is not None else Response(ser.data)

    @action(detail=True, methods=['patch'])
    def mark_read(self, request, pk=None):
        message = self.get_object()
        if message.recipient_id != request.user.id:
            return Response(
                {"detail": "Only the recipient can mark a message as read."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if not message.is_read:
            message.is_read = True
            message.save(update_fields=['is_read'])
        return Response(self.get_serializer(message).data)