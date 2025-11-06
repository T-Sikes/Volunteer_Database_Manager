from rest_framework import serializers
from volunteer_db.models import UserProfile, EventDetails


class VolunteerSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='full_name')
    skills = serializers.ListField(source='skills')

    class Meta:
        model = UserProfile
        fields = ['name', 'skills']


class EventSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='event_name')
    requiredSkills = serializers.ListField(source='required_skills')
    eventDate = serializers.DateTimeField(source='start_date')
    location = serializers.CharField()

    class Meta:
        model = EventDetails
        fields = ['name', 'requiredSkills', 'eventDate', 'location']


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
        child=serializers.CharField(), required=False, allow_empty=True
    )