from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')
    recipient_username = serializers.ReadOnlyField(source='recipient.username')

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_username', 'recipient', 'recipient_username',
            'application', 'content', 'is_read', 'created_at',
        ]
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']

    def validate_recipient(self, value):
        if value == self.context['request'].user:
            raise serializers.ValidationError("You cannot message yourself.")
        return value

    def validate_application(self, application):
        if application is None:
            return application
        user = self.context['request'].user
        
        participants = {application.candidate_id, application.job.recruiter_id}
        if user.id not in participants and not user.is_superuser:
            raise serializers.ValidationError(
                "You are not a participant in this application."
            )
        return application

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)