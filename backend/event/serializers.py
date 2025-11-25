from rest_framework import serializers
from volunteer_db.models import UserProfile, EventDetails, VolunteerHistory
from user.serializers import UserProfileSerializerBasic
from .models import Notification


class VolunteerSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="full_name")
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
    user_profile_details = UserProfileSerializerBasic(source="user_profile", read_only=True)

    class Meta:
        model = VolunteerHistory
        fields = "__all__"
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "recipient", "message", "timestamp"]
        read_only_fields = ["id", "timestamp"]