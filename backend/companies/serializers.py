from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    recruiter_username = serializers.ReadOnlyField(source='recruiter.username')
    

    class Meta:
        model = Company
        fields = [
            'id', 'recruiter', 'recruiter_username', 'name', 
            'description', 'website', 'location', 'logo', 
            'industry', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'recruiter', 'created_at', 'updated_at']

    def get_logo(self, obj):
        if obj and obj.logo:
            try:
                return obj.logo.url
            except ValueError:
                return None
        return None

    def create(self, validated_data):
        validated_data['recruiter'] = self.context['request'].user
        return super().create(validated_data)