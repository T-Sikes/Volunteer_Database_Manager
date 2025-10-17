from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserProfileSerializer, VolunteerRecordSerializer

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

@api_view(['GET'])
def get_user_profile(request):
    serializer = UserProfileSerializer(HARDCODED_TEST_PROFILE)
    return Response(serializer.data)

@api_view(['POST'])
def save_user_profile(request):
    serializer = UserProfileSerializer(data=request.data)
    if serializer.is_valid():
        # overwrite in-memory data
        global HARDCODED_TEST_PROFILE
        HARDCODED_TEST_PROFILE = serializer.data
        return Response({"status": "saved", "data": HARDCODED_TEST_PROFILE})
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
def get_volunteer_history(request):
    serializer = VolunteerRecordSerializer(HARD_CODED_HISTORY, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def save_volunteer_record(request):
    serializer = VolunteerRecordSerializer(data=request.data)
    if serializer.is_valid():
        record = serializer.validated_data
        global HARD_CODED_HISTORY
        HARD_CODED_HISTORY.append(record)
        return Response({"status": "saved", "data": record})
    else:
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_events(request):
    return Response(HARD_CODED_EVENTS)
