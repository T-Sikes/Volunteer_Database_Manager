from rest_framework import serializers
from volunteer_db.models import UserProfile, EventDetails, VolunteerHistory
from backend.user.serializers import UserProfileSerializerBasic


class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"

class EventDetailsSerializer(serializers.ModelSerializer):
    """Used for creating, updating, and retrieving EventDetails records."""
    class Meta:
        model = EventDetails
        fields = "__all__"


class MatchRequestSerializer(serializers.Serializer):
    volunteerName = serializers.CharField()
    eventName = serializers.CharField(required=False, allow_blank=True)
    eventDate = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    requiredSkills = serializers.ListField(
        child=serializers.CharField(max_length=100), required=False, allow_empty=True
    )

    def validate_volunteerName(self, value):
        v = value.strip()
        if not v:
            raise serializers.ValidationError("volunteerName cannot be blank")
        return v

class VolunteerHistorySerializer(serializers.ModelSerializer):
    event_details = EventDetailsSerializer(source="event", read_only=True)
    user_profile = UserProfileSerializerBasic(source="user_profile", read_only=True)

    class Meta:
        model = VolunteerHistory
        fields = "__all__"