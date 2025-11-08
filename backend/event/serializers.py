from rest_framework import serializers
from volunteer_db.models import EventDetails

class MatchRequestSerializer(serializers.Serializer):
    volunteerName = serializers.CharField(max_length=100)
    eventName = serializers.CharField(max_length=200, required=False, allow_blank=True)
    eventDate = serializers.CharField(max_length=30, required=False, allow_blank=True)
    location = serializers.CharField(max_length=200, required=False, allow_blank=True)
    requiredSkills = serializers.ListField(
        child=serializers.CharField(max_length=100), required=False
    )

    def validate_volunteerName(self, value):
        v = value.strip()
        if not v:
            raise serializers.ValidationError("volunteerName cannot be blank")
        return v


class EventDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventDetails
        fields = "__all__"