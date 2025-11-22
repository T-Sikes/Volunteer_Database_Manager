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
    address1 = serializers.CharField(required=True, write_only=True)  # Mark as write_only
    address2 = serializers.CharField(required=False, allow_blank=True, default='', write_only=True)  # Mark as write_only
    city = serializers.CharField(required=True)
    state = serializers.CharField(required=True)
    zip_code = serializers.CharField(required=True, min_length=5, source='zipcode')
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=True,
        allow_empty=False
    )
    preferences = serializers.CharField(required=False, allow_blank=True)
    availability = serializers.JSONField(required=False)

    def to_representation(self, instance):
        # Completely custom representation - don't call super()
        return {
            'full_name': instance.full_name,
            'address1': instance.address.split(', ')[0] if instance.address else '',
            'address2': instance.address.split(', ')[1] if instance.address and ', ' in instance.address else '',
            'city': instance.city,
            'state': instance.state,
            'zip_code': instance.zipcode,
            'skills': instance.skills or [],
            'preferences': instance.preferences or '',
             # Use new JSON field if available, otherwise provide default
            'availability': instance.availability_json if instance.availability_json else {
                'monday': {'available': False, 'start': '09:00', 'end': '17:00'},
                'tuesday': {'available': False, 'start': '09:00', 'end': '17:00'},
                'wednesday': {'available': False, 'start': '09:00', 'end': '17:00'},
                'thursday': {'available': False, 'start': '09:00', 'end': '17:00'},
                'friday': {'available': False, 'start': '09:00', 'end': '17:00'},
                'saturday': {'available': False, 'start': '09:00', 'end': '17:00'},
                'sunday': {'available': False, 'start': '09:00', 'end': '17:00'}
            }
        }

    def to_internal_value(self, data):
        # When deserializing for saving - combine addresses
        internal_data = super().to_internal_value(data)
        
        # Combine address1 and address2 into a single address field
        address1 = internal_data.pop('address1', '')
        address2 = internal_data.pop('address2', '')
        
        if address2:
            internal_data['address'] = f"{address1}, {address2}"
        else:
            internal_data['address'] = address1

        if 'availability' in internal_data:
            internal_data['availability_json'] = internal_data.pop('availability')
            
            
        return internal_data

    def create(self, validated_data):
        # Map zip_code -> zipcode
        validated_data['zipcode'] = validated_data.pop('zipcode')
        
        # Get the user from context
        user = self.context.get('user')
        validated_data['user'] = user
            
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
        instance.availability_json = validated_data.get('availability_json', instance.availability_json)
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
    

class UserProfileSerializerBasic(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = "__all__"
