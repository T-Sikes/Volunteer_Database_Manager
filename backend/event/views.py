from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from volunteer_db.models import EventDetails, UserProfile, VolunteerHistory, UserCredentials, Notification
from .serializers import VolunteerSerializer, MatchRequestSerializer, EventDetailsSerializer, VolunteerHistorySerializer
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import PermissionDenied


# add "@permission_classes([IsAuthenticated])" above your endpoints if a user needs to be logged in to make this API call. More often than not, they will need to be

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
        event_date = datetime.fromisoformat(event.get("eventDate"))
        days_until = (event_date - datetime.now()).days
        date_score = max(0, 30 - max(days_until, 0)) / 30
    except Exception:
        date_score = 0
    return matched_count * 10 + urgency_point + date_score


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_events(request):
    try:
        events = EventDetails.objects.all()
        serializedData = EventDetailsSerializer(events, many=True).data
        
        return Response(
            serializedData,
            status=status.HTTP_200_OK
        )

    except Exception as e:
        # Log the error if needed: print(e) or use logger
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# @api_view(["GET"])
# def get_volunteers(request):
#     profiles = UserProfile.objects.select_related("user").all()
#     data = [
#         {
#             "id": p.user.id,
#             "name": p.full_name,
#             "skills": p.skills if p.skills else []
#         }
#         for p in profiles
#     ]
#     return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_volunteers(request):
    try:
        volunteers = UserProfile.objects.select_related("user").all()
        serializedData = VolunteerSerializer(volunteers, many=True).data
        return Response(
            serializedData,
            status=status.HTTP_200_OK
        )

    except Exception as e:
        # Log the error if needed: print(e) or use logger
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_event(request):
    data = request.data
    serializer = EventDetailsSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
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
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def match_volunteers(request):
    serializer = MatchRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    name = serializer.validated_data["volunteerName"].strip()
    selected_event_name = serializer.validated_data.get("eventName", "").strip()
    posted_event_date = serializer.validated_data.get("eventDate", "").strip()
    posted_location = serializer.validated_data.get("location", "").strip()
    posted_required_skills = serializer.validated_data.get("requiredSkills", [])

    try:
        volunteer_profile = UserProfile.objects.select_related("user").get(full_name__iexact=name)
    except UserProfile.DoesNotExist:
        return Response({"error": "Volunteer not found."}, status=status.HTTP_404_NOT_FOUND)

    if selected_event_name:
        event_obj, _ = EventDetails.objects.get_or_create(
            event_name=selected_event_name,
            defaults={
                "location": posted_location or "Unknown",
                "required_skills": posted_required_skills,
                "urgency": "low",
                "start_date": posted_event_date or datetime.now(),
                "end_date": posted_event_date or datetime.now()
            }
        )
        match_type = "manual"

    else:
        all_events = EventDetails.objects.all()
        scored_events = []
        volunteer_skills = _normalize_list(volunteer_profile.skills if volunteer_profile.skills else [])
        for e in all_events:
            event_dict = {
                "id": e.id,
                "name": e.event_name,
                "location": e.location,
                "requiredSkills": e.required_skills if e.required_skills else [],
                "urgency": e.urgency,
                "eventDate": e.start_date.isoformat()
            }
            score = _score_event_for_volunteer(event_dict, {"skills": volunteer_skills})
            if score >= 10:
                scored_events.append((score, event_dict))
        if not scored_events:
            return Response({"message": "No matching events found."}, status=status.HTTP_200_OK)
        scored_events.sort(key=lambda se: (-se[0], se[1].get("eventDate", "")))
        best_match = scored_events[0][1]
        event_obj = EventDetails.objects.get(event_name=best_match["name"])
        match_type = "auto"

    history_entry, created = VolunteerHistory.objects.get_or_create(
        user=volunteer_profile.user,
        event=event_obj,
        defaults={
            "user_profile": volunteer_profile,
            "match_type": match_type
        }
    )

    Notification.objects.create(
        recipient=volunteer_profile.user,
        message=f"You were {'manually' if match_type=='manual' else 'automatically'} matched to event '{event_obj.event_name}' on {event_obj.start_date}"
    )

    return Response({
        "volunteerName": volunteer_profile.full_name,
        "eventName": event_obj.event_name,
        "eventDate": event_obj.start_date.isoformat(),
        "location": event_obj.location,
        "matchType": match_type,
        "timestamp": history_entry.timestamp.isoformat()
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_matches(request):
    history = VolunteerHistory.objects.select_related("user", "event").all()
    data = []
    for h in history:
        try:
            profile = UserProfile.objects.get(user=h.user)
            volunteer_name = profile.full_name
        except UserProfile.DoesNotExist:
            volunteer_name = h.user.username

        data.append({
            "volunteerName": volunteer_name,
            "eventName": h.event.event_name,
            "eventDate": h.event.start_date.isoformat(),
            "location": h.event.location,
            "matchType": h.match_type,
            "timestamp": h.timestamp.isoformat()
        })
    return Response(data, status=status.HTTP_200_OK)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_match(request, volunteer_name):
    try:
        volunteer_profile = UserProfile.objects.get(full_name__iexact=volunteer_name)
        deleted, _ = VolunteerHistory.objects.filter(user=volunteer_profile.user).delete()
        if deleted:
            return Response({"message": f"Match for {volunteer_name} removed successfully."}, status=200)
        else:
            return Response({"error": f"No match found for {volunteer_name}"}, status=404)
    except UserProfile.DoesNotExist:
        return Response({"error": "Volunteer not found."}, status=404)

@api_view(["GET"])
def get_notifications(request):
    notifications = Notification.objects.select_related("recipient").all().order_by("-timestamp")
    data = [{"to": n.recipient.username, "message": n.message, "timestamp": n.timestamp.isoformat()} for n in notifications]
    return Response(data)

@api_view(["POST"])
def send_notification(request):
    to_username = request.data.get("to")
    message = request.data.get("message")
    if not to_username or not message:
        return Response({"error": "Both 'to' and 'message' are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = UserCredentials.objects.get(username=to_username)
    except UserCredentials.DoesNotExist:
        return Response({"error": "Recipient not found."}, status=status.HTTP_404_NOT_FOUND)

    Notification.objects.create(recipient=user, message=message)
    return Response({"status": "sent"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def assign_volunteer(request):
    data = request.data
    serializer = VolunteerHistorySerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_events(request):
    try:
        # If admin, get all the events assigned to at least 1 volunteer
        if request.user.is_superuser:
            events = VolunteerHistory.objects.select_related('event').all()
        # If volunteer, only get events specifically asigned to that volunteer
        else:
            events = VolunteerHistory.objects.filter(user=request.user).select_related('event')
        serializedData = VolunteerHistorySerializer(events, many=True).data
        
        return Response(
            serializedData,
            status=status.HTTP_200_OK
        )

    except Exception as e:
        # Log the error if needed: print(e) or use logger
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_volunteers_for_event(request, event_id):
    try:
        volunteers = VolunteerHistory.objects.filter(event=event_id).select_related('user_profile')
        serializedData = VolunteerHistorySerializer(volunteers, many=True).data
        
        return Response(
            serializedData,
            status=status.HTTP_200_OK
        )

    except Exception as e:
        # Log the error if needed: print(e) or use logger
        return Response(
            {"status": "error", "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
