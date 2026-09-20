from rest_framework import serializers
from django.utils import timezone

from .models import Interview
from applications.models import Application


class ApplicationSummarySerializer(serializers.ModelSerializer):
    """Thin — just enough for interview context."""
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.company.name')
    candidate_username = serializers.ReadOnlyField(source='candidate.username')

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'company_name',
                  'candidate', 'candidate_username', 'status']


class InterviewSerializer(serializers.ModelSerializer):
    candidate_username = serializers.ReadOnlyField(source='candidate.username')
    recruiter_username = serializers.ReadOnlyField(source='recruiter.username')
    job_title = serializers.ReadOnlyField(source='application.job.title')
    company_name = serializers.ReadOnlyField(source='application.job.company.name')
    application_details = ApplicationSummarySerializer(source='application', read_only=True)

    class Meta:
        model = Interview
        fields = [
            'id', 'application', 'application_details',
            'candidate', 'candidate_username',
            'recruiter', 'recruiter_username',
            'job_title', 'company_name',
            'scheduled_at', 'duration_minutes', 'meeting_link',
            'notes', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'candidate', 'recruiter', 'status',
            'created_at', 'updated_at',
        ]

    def validate_scheduled_at(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Interview must be scheduled in the future.")
        return value

    def validate_application(self, application):
        user = self.context['request'].user
        if application.job.recruiter_id != user.id and not user.is_superuser:
            raise serializers.ValidationError(
                "You can only schedule interviews for applications on your own jobs."
            )
        return application

    def create(self, validated_data):
        application = validated_data['application']
        validated_data['candidate'] = application.candidate
        validated_data['recruiter'] = application.job.recruiter
        return super().create(validated_data)


class InterviewStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ['status']