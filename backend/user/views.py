from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserProfileSerializer

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