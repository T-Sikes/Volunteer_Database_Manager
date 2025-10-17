from rest_framework import serializers

class NotificationSerializer(serializers.Serializer):
    NOTIFICATION_TYPES = [
        ("match", "Match"),
        ("update", "Update"),
        ("reminder", "Reminder"),
        ("cancellation", "Cancellation"),
        ("error", "Error"),
    ]

    notificationType = serializers.ChoiceField(choices=NOTIFICATION_TYPES)
    volunteerName = serializers.CharField(max_length=200, required=False, allow_blank=True)
    eventName = serializers.CharField(max_length=200, required=False, allow_blank=True)
    eventDate = serializers.CharField(max_length=50, required=False, allow_blank=True)
    location = serializers.CharField(max_length=200, required=False, allow_blank=True)
    message = serializers.CharField(max_length=200, required=False, allow_blank=True)

    def validate(self, data):
        nt = data.get("notificationType")
        volunteer_name = data.get("volunteerName")

        if nt in ("match", "update", "reminder") and not volunteer_name:
            raise serializers.ValidationError({
                "volunteerName": "volunteerName is required for this notificationType"
            })

        volunteers = self.context.get("volunteers", [])
        if volunteer_name:
            if not any(v["name"].lower() == volunteer_name.lower() for v in volunteers):
                raise serializers.ValidationError({
                    "volunteerName": f"Volunteer '{volunteer_name}' does not exist"
                })

        if not (data.get("message") or data.get("eventName")):
            raise serializers.ValidationError("Either eventName or message must be provided")

        return data