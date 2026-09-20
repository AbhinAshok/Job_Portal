from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    candidate_username = serializers.ReadOnlyField(source='candidate.username')
    file = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            'id', 'candidate', 'candidate_username', 'title', 
            'file', 'skills', 'experience_years', 'is_default', 'uploaded_at'
        ]
        read_only_fields = ['id', 'candidate', 'uploaded_at']

    def get_file(self, obj):
        if obj and obj.file:
            try:
                return obj.file.url
            except ValueError:
                return None
        return None

    def create(self, validated_data):
        validated_data['candidate'] = self.context['request'].user
        return super().create(validated_data)
