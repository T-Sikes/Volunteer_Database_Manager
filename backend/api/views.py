# from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

@api_view(["GET"])
def get_events(request):
    # Hardcoded events
    data = [
        {
            "name": "Soup Kitchen",
            "description": "Giving food to the homeless",
            "location": "Some building",
            "address": "1234 Main St.",
            "city": "Houston",
            "state": "TX",
            "zipCode": "77204",
            "requiredSkills": ["Food prep", "Leadership"],
            "urgency": "medium",
            "date": "2025-10-16"
        },
        {
            "name": "Plant Trees",
            "description": "Planting trees for the environment :D",
            "location": "Pleasant Park",
            "address": "6767 Jefferson St.",
            "city": "Houston",
            "state": "TX",
            "zipCode": "77203",
            "requiredSkills": ["Able to lift more than 50 lbs"],
            "urgency": "low",
            "date": "2025-10-15"  
        }
    ]
    return Response(data)
