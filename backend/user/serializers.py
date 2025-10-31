from rest_framework import serializers
from volunteer_db.models import UserProfile, VolunteerHistory

#custom field for serving proper date format (converting to a charField broke the front page :(( )))
class AvailabilityField(serializers.Field):
    def to_representation(self, value):
        # Convert the stored string into a Python list for frontend
        # Example: "Mon,Tue,Wed" -> ["Mon", "Tue", "Wed"]
        if not value:
            return []
        return value.split(',')

    def to_internal_value(self, data):
        # Convert the frontend list back into a string to store in DB
        # Example: ["Mon", "Tue", "Wed"] -> "Mon,Tue,Wed"
        if not isinstance(data, list):
            raise serializers.ValidationError("Availability must be a list.")
        return ','.join([str(x) for x in data])


class UserProfileSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=True)
    address1 = serializers.CharField(required=True, source='address')  # maps address -> address1
    address2 = serializers.CharField(required=False, allow_blank=True, default='')  # extra field
    city = serializers.CharField(required=True)
    state = serializers.CharField(required=True)
    zip_code = serializers.CharField(required=True, min_length=5, source='zipcode')  # maps zipcode -> zip_code
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=True,
        allow_empty=False
    )
    preferences = serializers.CharField(required=False, allow_blank=True)
    availability = AvailabilityField(required=True)  # <-- custom field

    def create(self, validated_data):
        # Map address1 -> address, zip_code -> zipcode
        validated_data['address'] = validated_data.pop('address')
        validated_data['zipcode'] = validated_data.pop('zipcode')
        return UserProfile.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Map the fields for updating
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.address = validated_data.get('address', instance.address)
        instance.city = validated_data.get('city', instance.city)
        instance.state = validated_data.get('state', instance.state)
        instance.zipcode = validated_data.get('zipcode', instance.zipcode)
        instance.skills = validated_data.get('skills', instance.skills)
        instance.preferences = validated_data.get('preferences', instance.preferences)
        instance.availability = validated_data.get('availability', instance.availability)
        instance.save()
        return instance
    
class VolunteerRecordInputSerializer(serializers.Serializer):
    event_id = serializers.IntegerField(required=True)
    hours = serializers.IntegerField(min_value=0, required=True)

class VolunteerRecordSerializer(serializers.ModelSerializer):
    eventName = serializers.CharField(source="event.event_name")
    description = serializers.CharField(source="event.description")
    location = serializers.CharField(source="event.location")
    requiredSkills = serializers.ListField(source="event.required_skills")
    urgency = serializers.CharField(source="event.urgency")
    eventDate = serializers.SerializerMethodField()  # <- use a method to extract date
    hours = serializers.IntegerField(source="hours_served")
    status = serializers.CharField()

    class Meta:
        model = VolunteerHistory
        fields = ["eventName", "description", "location", "requiredSkills", "urgency", "eventDate", "hours", "status"]

    def get_eventDate(self, obj):
        return obj.event.start_date.date()  # extract only the date part

    def get_status(self, obj):
        if obj.hours_served > 0:
            return "Completed"
        return "Pending"