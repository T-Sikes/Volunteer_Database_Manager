from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import NotificationSerializer
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)
#Hard Coded
VOLUNTEERS = [
    {"name": "Alice Martin", "email": "alice@example.com"},
    {"name": "John Doe", "email": "john@example.com"},
    {"name": "Jane Smith", "email": "jane@example.com"},
    {"name": "Eladio Carrion", "email": "eladio@example.com"},
]
EVENTS = [
    {"name": "Community Clean-Up", "date": "2025-12-15", "location": "Central Park"},
    {"name": "Food Drive", "date": "2025-12-20", "location": "Community Center"},
    {"name": "Charity Concert", "date": "2025-12-25", "location": "City Hall"},
    {"name": "Soup Kitchen", "date": "2025-10-16", "location": "Some building"},
    {"name": "Plant Trees", "date": "2025-10-15", "location": "Pleasant Park"},
    {"name": "Charity Run", "date": "2025-11-15", "location": "Camp Nou"},
]
NOTIFICATIONS = []
def _find_volunteer_by_name(name):
    if not name: return None
    name = name.strip().lower()
    for v in VOLUNTEERS:
        if v["name"].strip().lower() == name:
            return v
    return None
def _find_event_by_name(name):
    if not name:
        return None
    name = name.strip().lower()
    for e in EVENTS:
        if e["name"].strip().lower() == name:
            return e
    return None
@api_view(["GET"])
def get_notifications(request):
    return Response(NOTIFICATIONS, status=status.HTTP_200_OK)
@api_view(["POST"])
def send_notification(request):
    serializer = NotificationSerializer(data=request.data, context={"volunteers": VOLUNTEERS})
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    payload = serializer.validated_data
    volunteer_name = payload.get("volunteerName")
    event_name = payload.get("eventName")
    event = _find_event_by_name(event_name) if event_name else None

    if event_name and not event:
        return Response({"error": f"Event '{event_name}' not found"}, status=status.HTTP_400_BAD_REQUEST)

    notification = {
        "id": len(NOTIFICATIONS) + 1,
        "notificationType": payload["notificationType"],
        "volunteerName": volunteer_name or "",
        "eventName": event_name or "",
        "eventDate": payload.get("eventDate") or (event.get("date") if event else ""),
        "location": payload.get("location") or (event.get("location") if event else ""),
        "message": payload.get("message") or f"{payload['notificationType'].capitalize()} notification",
        "sentAt": timezone.now().isoformat(),
    }
    NOTIFICATIONS.append(notification)
    logger.info(f"Notification sent: {notification}")
    return Response({"status": "Notification sent", "notification": notification}, status=status.HTTP_200_OK)