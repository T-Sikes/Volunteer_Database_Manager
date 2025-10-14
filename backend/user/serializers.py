from rest_framework import serializers

class UserProfileSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=True)
    address1 = serializers.CharField(required=True)
    address2 = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=True)
    state = serializers.CharField(required=True)
    zip_code = serializers.CharField(required=True, min_length=5)
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=True,
        allow_empty=False
    )
    preferences = serializers.CharField(required=False, allow_blank=True)
    availability = serializers.ListField(
        child=serializers.DateField(),
        required=True,
        allow_empty=False
    )