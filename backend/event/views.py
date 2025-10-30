from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import MatchRequestSerializer
from datetime import datetime
from .serializers import EventDetailsSerializer
from volunteer_db.models import EventDetails
# Mock data
matches = []
notifications = []
events = [
    {
        "id": 1,
        "name": "Soup Kitchen",
        "description": "Giving food to the homeless",
        "location": "Some building",
        "address": "1234 Main St.",
        "city": "Houston",
        "state": "TX",
        "zipCode": "77204",
        "requiredSkills": ["Event Planning", "Leadership", "Bilingual/Multilingual"],
        "urgency": "medium",
        "date": "2025-10-16"
    },
    {
        "id": 2,
        "name": "Plant Trees",
        "description": "Planting trees for the environment :D",
        "location": "Pleasant Park",
        "address": "6767 Jefferson St.",
        "city": "Houston",
        "state": "TX",
        "zipCode": "77203",
        "requiredSkills": ["Event Planning", "First Aid", "Bilingual/Multilingual"],
        "urgency": "low",
        "date": "2025-10-15"
    },
    {
        "id": 3,
        "name": "Charity Run",
        "description": "Raising money for a local cause",
        "location": "Camp Nou",
        "address": "500 Charity Rd.",
        "city": "Houston",
        "state": "TX",
        "zipCode": "77001",
        "requiredSkills": ["Event Planning", "First Aid", "Bilingual/Multilingual"],
        "urgency": "high",
        "date": "2025-11-15"
    },
    {
    "id": 4,
    "name": "Concert Fundraiser",
    "description": "Music event to raise funds for food bank",
    "location": "Houston Food Bank",
    "address": "500 Donation Dr.",
    "city": "Houston",
    "state": "TX",
    "zipCode": "77002",
    "requiredSkills": ["Singer", "Event Planning", "Public Speaking"],
    "urgency": "medium",
    "date": "2025-12-21"
    },
]

volunteers = [
    {"id": 1, "name": "John Doe", "skills": ["First Aid", "Bilingual/Multilingual"]},
    {"id": 2, "name": "Eladio Carrion", "skills": ["Singer", "Bilingual/Multilingual"]},
    {"id": 3, "name": "Jane Smith", "skills": ["Event Planning", "Public Speaking"]},
    {"id": 4, "name": "Alice Martin", "skills": ["Event Planning", "Public Speaking"]},
]
URGENCY_WEIGHT = {
    "low": 0,
    "medium": 1,
    "high": 2
}

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
    return Response(events)

@api_view(["POST"])
def create_event(request):
    data = request.data
    serializer = EventDetailsSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
def update_event(request, pk):
    data = request.data
    found_index = -1
    for index, d in enumerate(events):
        if d.get('id') == pk:
            found_index = index
            break
    if data and found_index != -1:
        events[found_index] = data
        events[found_index]["id"] = pk
        print(events)
        return Response(data, status=status.HTTP_201_CREATED)
    return Response("", status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_volunteers(request):
    unique = {}
    for v in volunteers:
        key = v["name"].strip().lower()
        if key not in unique:
            unique[key] = {"name": v["name"], "skills": v.get("skills", [])}
    return Response(list(unique.values()))

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