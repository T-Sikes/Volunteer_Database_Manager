from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from volunteer_db.models import UserProfile, VolunteerHistory, EventDetails, UserCredentials
from .serializers import UserProfileSerializer, VolunteerRecordSerializer
from django.shortcuts import get_object_or_404

# Create your views here.
HARDCODED_TEST_PROFILE = {
    "full_name": "John Doe",
    "address1": "123 Main St",
    "address2": "",
    "city": "Springfield",
    "state": "IL",
    "zip_code": "62704",
    "skills": ["Python", "JavaScript"],
    "preferences": "No preferences",
    "availability": ["2025-10-14", "2025-10-15"]
}

HARD_CODED_HISTORY = [
    {
        "eventName": "Community Cleanup",
        "eventDate": "2025-09-25",
        "location": "Central Park",
        "description": "Cleaning up litter.",
        "requiredSkills": ["Leadership"],
        "urgency": "Medium",
        "hours": 4,
        "status": "Completed",
    },
    {
        "eventName": "Food Drive",
        "eventDate": "2025-10-01",
        "location": "Downtown Shelter",
        "description": "Distribute food packages.",
        "requiredSkills": ["Food prep"],
        "urgency": "High",
        "hours": 3,
        "status": "Pending",
    },
    {
        "eventName": "Children's Book Reading",
        "eventDate": "2025-10-12",
        "location": "Louis Elementary",
        "description": "Reading books for 1st grade students ",
        "requiredSkills": ["child care"],
        "urgency": "High",
        "hours": 3,
        "status": "Pending",
    },
]

HARD_CODED_EVENTS = [
    {
        "name": "Community Cleanup",
        "description": "Cleaning up litter",
        "location": "Central Park",
        "requiredSkills": ["Leadership"],
        "urgency": "Medium",
        "eventDate": "2025-09-25"
    },
    {
        "name": "Food Drive",
        "description": "Distribute food packages",
        "location": "Downtown Shelter",
        "requiredSkills": ["Food prep"],
        "urgency": "High",
        "eventDate": "2025-10-01"
    },
    {
        "name": "Children's Book Reading",
        "description": "Reading books for 1st grade students",
        "location": "Louis Elementary",
        "requiredSkills": ["child care"],
        "urgency": "High",
        "eventDate": "2025-10-12"
    },
    {
        "name": "Test Event",
        "description": "Temporary test event",
        "location": "Test Location",
        "requiredSkills": ["Testing"],
        "urgency": "Low",
        "eventDate": "2025-10-20"
    }
]

#--------------------------
# user profile endpoints
#--------------------------

@api_view(['GET'])
def get_user_profile(request, username):
    user = get_object_or_404(UserCredentials, username=username)
    profile = get_object_or_404(UserProfile, user=user)
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['POST'])
def save_user_profile(request, username):
    user = get_object_or_404(UserCredentials, username=username)
    profile = get_object_or_404(UserProfile, user=user)

    serializer = UserProfileSerializer(profile, data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "saved", "data": serializer.data})
    else:
        return Response(serializer.errors, status=400)
    
#---------------------------
# Volunteer History Endpoint
#---------------------------
    
@api_view(['GET'])
def get_volunteer_history(request, username):
    user = get_object_or_404(UserCredentials, username=username)
    history_qs = VolunteerHistory.objects.filter(user=user)
    serializer = VolunteerRecordSerializer(history_qs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def save_volunteer_record(request, username):
    user = get_object_or_404(UserCredentials, username=username)
    
    event_id = request.data.get("event_id")
    event = get_object_or_404(EventDetails, id=event_id)
    
    # Map frontend fields to model fields
    hours = request.data.get("hours", 0)
    status = request.data.get("status", "pending")
    
    record = VolunteerHistory.objects.create(
        user=user,
        event=event,
        hours_served=hours,
        status=status
    )   
    
    serializer = VolunteerRecordSerializer(record)
    return Response({"status": "saved", "data": serializer.data})
    

@api_view(['GET'])
def get_events(request):
    events = EventDetails.objects.all()
    data = []
    for e in events:
        data.append({
            "id": e.id,
            "name": e.event_name,
            "description": e.description,
            "location": e.location,
            "requiredSkills": e.required_skills,
            "urgency": e.urgency,
            "eventDate": e.start_date.date()
        })
    return Response(data)