from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import MatchRequestSerializer
from datetime import datetime
from volunteer_db.models import EventDetails, UserProfile, VolunteerHistory, UserCredentials, Notification
from .serializers import VolunteerSerializer, EventSerializer, MatchRequestSerializer, EventDetailsSerializer

URGENCY_WEIGHT = {"low": 0, "medium": 1, "high": 2, "critical": 3}

def _normalize_list(lst):
    return [s.strip().lower() for s in lst]
def _score_event_for_volunteer(event, volunteer):
    volunteer_skills = _normalize_list(volunteer.get("skills", []))
    required_skills = _normalize_list(event.get("requiredSkills", []))
    matched_count = sum(1 for rs in required_skills if rs in volunteer_skills)
    urgency = event.get("urgency", "low").lower()
    urgency_point = URGENCY_WEIGHT.get(urgency, 0)
    try:
        event_date = datetime.fromisoformat(event.get("date"))
        days_until = (event_date - datetime.now()).days
        date_score = max(0, 30 - max(days_until, 0)) / 30
    except Exception:
        date_score = 0
    return matched_count * 10 + urgency_point + date_score

@api_view(["GET"])
def get_events(request):
    events = EventDetails.objects.all()
    serializedData = EventDetailsSerializer(events, many=True).data
    return Response(serializedData)

@api_view(["GET"])
def get_volunteers(request):
    profiles = UserProfile.objects.select_related("user").all()
    data = [
        {
            "id": p.user.id,
            "name": p.full_name,
            "skills": p.skills if p.skills else []
        }
        for p in profiles
    ]
    return Response(data)

@api_view(["POST"])
def create_event(request):
    data = request.data
    serializer = EventDetailsSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT", "DELETE"])
def update_or_delete_event(request, pk):
    try:
        event = EventDetails.objects.get(pk=pk)
    except EventDetails.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == "PUT":
        data = request.data
        serializer = EventDetailsSerializer(event, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
matches = []
@api_view(["POST"])
def match_volunteers(request):
    serializer = MatchRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    name = serializer.validated_data["volunteerName"].strip()
    selected_event_name = serializer.validated_data.get("eventName", "").strip()
    posted_event_date = serializer.validated_data.get("eventDate", "").strip()
    posted_location = serializer.validated_data.get("location", "").strip()
    posted_required_skills = serializer.validated_data.get("requiredSkills", [])

    volunteer = next((v for v in volunteers if v["name"].strip().lower() == name.lower()), None)
    if not volunteer:
        return Response({"error": "Volunteer not found."}, status=status.HTTP_404_NOT_FOUND)

    if selected_event_name:
        event = next((e for e in events if e["name"].strip().lower() == selected_event_name.lower()), None)

        if not event:
            event = {
                "id": max([e.get("id", 0) for e in events]) + 1,
                "name": selected_event_name,
                "date": posted_event_date or "TBD",
                "location": posted_location or "Unknown",
                "requiredSkills": posted_required_skills or [],
            }

        match_entry = {
            "volunteerName": volunteer["name"],
            "eventName": event["name"],
            "eventDate": event.get("date", event.get("eventDate", "")),
            "location": event.get("location", ""),
            "matchedSkills": [
                s for s in event.get("requiredSkills", [])
                if s.strip().lower() in _normalize_list(volunteer.get("skills", []))
            ],
            "matchType": "manual",
            "timestamp": datetime.now().isoformat()
        }

        existing_same = next((m for m in matches if m["volunteerName"].strip().lower() == volunteer["name"].strip().lower() and m["eventName"].strip().lower() == event["name"].strip().lower()), None)
        if not existing_same:
            prev = next((m for m in matches if m["volunteerName"].strip().lower() == volunteer["name"].strip().lower()), None)
            if prev:
                matches.remove(prev)
            matches.append(match_entry)

            notifications.append({
                "to": volunteer["name"],
                "message": f"You were manually matched to event '{event['name']}' on {event.get('date','TBD')}",
                "timestamp": datetime.now().isoformat()
            })

        return Response(match_entry, status=status.HTTP_200_OK)

    matched_events = []
    for event in events:
        score = _score_event_for_volunteer(event, volunteer)
        if score >= 10:
            matched_events.append((score, event))

    if not matched_events:
        return Response({"message": "No matching events found."}, status=status.HTTP_200_OK)

    matched_events.sort(key=lambda se: (-se[0], se[1].get("date", "")))
    best_match = matched_events[0][1]

    match_entry = {
        "volunteerName": volunteer["name"],
        "eventName": best_match["name"],
        "eventDate": best_match["date"],
        "location": best_match["location"],
        "matchedSkills": [s for s in best_match.get("requiredSkills", [])
                          if s.strip().lower() in _normalize_list(volunteer.get("skills", []))],
        "matchType": "auto",
        "timestamp": datetime.now().isoformat()
    }

    existing = next((m for m in matches if m["volunteerName"].strip().lower() == volunteer["name"].strip().lower()), None)
    if existing:
        matches.remove(existing)
    matches.append(match_entry)
    notifications.append({
        "to": volunteer["name"],
        "message": f"You were automatically matched to event '{best_match['name']}' on {best_match['date']}",
        "timestamp": datetime.now().isoformat()
    })

    return Response(match_entry, status=status.HTTP_200_OK)
@api_view(["GET"])
def get_all_matches(request):
    return Response(matches, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_notifications(request):
    return Response(notifications, status=status.HTTP_200_OK)

@api_view(["POST"])
def send_notification(request):
    payload = request.data
    to = payload.get("to")
    message = payload.get("message")
    if not to or not message:
        return Response({"error": "Both 'to' and 'message' are required."}, status=status.HTTP_400_BAD_REQUEST)
    notifications.append({
        "to": to,
        "message": message,
        "timestamp": datetime.now().isoformat()
    })
    return Response({"status": "sent"}, status=status.HTTP_201_CREATED)