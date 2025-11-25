from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from volunteer_db.models import UserProfile, VolunteerHistory, EventDetails, UserCredentials
from django.db.models import Sum, Count
from .serializers import UserProfileSerializer, VolunteerRecordSerializer
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
import csv
from datetime import datetime


#----report imports
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch


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
    
    try:
        profile = UserProfile.objects.get(user=user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    except UserProfile.DoesNotExist:
        # Return empty profile structure if doesn't exist
        return Response({
            "full_name": "",
            "address1": "", 
            "address2": "",
            "city": "",
            "state": "",
            "zip_code": "",
            "skills": [],
            "preferences": "",
            "availability": []
        })

@api_view(['POST'])
def save_user_profile(request, username):
    user = get_object_or_404(UserCredentials, username=username)
    
    try:
        profile = UserProfile.objects.get(user=user)
        serializer = UserProfileSerializer(
            profile, 
            data=request.data,
            context={'user': user}  # Pass user in context for the serializer
        )
    except UserProfile.DoesNotExist:
        # Create new profile if it doesn't exist
        serializer = UserProfileSerializer(
            data=request.data,
            context={'user': user}  # Pass user in context for creation
        )
    
    if serializer.is_valid():
        profile = serializer.save()
        return Response({"status": "saved", "data": serializer.data})
    else:
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=400)

#--------------------------
# current user endpoint
#--------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get the current logged-in user's basic info
    """
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'id': user.id,
        'is_superuser' : user.is_superuser,
        # Add any other user fields you need
    })


    
#---------------------------
# Volunteer History Endpoint
#---------------------------
    
@api_view(['GET'])
def get_volunteer_history(request, username):
    user = get_object_or_404(UserCredentials, username=username)
    history_qs = VolunteerHistory.objects.filter(user=user)
    serializer = VolunteerRecordSerializer(history_qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_volunteer_history_from_user_id(request, user_id):
    history_qs = VolunteerHistory.objects.filter(user_id=user_id)
    serializer = VolunteerRecordSerializer(history_qs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def save_volunteer_record(request, username):
    user = get_object_or_404(UserCredentials, username=username)

     # Get the user's profile 
    user_profile = get_object_or_404(UserProfile, user=user)
    
    event_id = request.data.get("event_id")
    if not event_id:
        return Response({"error": "event_id is required"}, status=400)
    
    try:
        event = get_object_or_404(EventDetails, id=event_id)
    except:
        return Response({"error": "Event not found"}, status=400)
    
    # Map frontend fields to model fields
    hours = request.data.get("hours", 0)
    if hours is None or hours <= 0:
        return Response({"error": "Hours must be greater than 0"}, status=400)

    status = request.data.get("status", "pending")
    
    record = VolunteerHistory.objects.create(
        user=user,
        user_profile=user_profile,
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

#------------------------
#report module endpoints
#------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_reports_csv(request):
    """Export both volunteers and events data in one CSV"""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="volunteer_reports.csv"'
    
    writer = csv.writer(response)
    
    # SECTION 1: Volunteers and their participation history
    writer.writerow(['VOLUNTEERS AND PARTICIPATION HISTORY'])
    writer.writerow(['Name', 'Email', 'City', 'State', 'Total Events', 'Total Hours', 'Last Participation'])
    writer.writerow([])
    
    profiles = UserProfile.objects.all().select_related('user')
    for profile in profiles:
        history = VolunteerHistory.objects.filter(user=profile.user, status='completed')
        events_count = history.count()
        total_hours = history.aggregate(Sum('hours_served'))['hours_served__sum'] or 0
        last_participation = history.order_by('-participation_date').first()
        last_date = last_participation.participation_date.strftime('%Y-%m-%d') if last_participation else 'Never'
        
        writer.writerow([
            profile.full_name,
            profile.user.email,
            profile.city,
            profile.state,
            events_count,
            total_hours,
            last_date
        ])
    
    writer.writerow([])
    writer.writerow([])
    
    # SECTION 2: Event details and volunteer assignments
    writer.writerow(['EVENT DETAILS AND VOLUNTEER ASSIGNMENTS'])
    writer.writerow(['Event Name', 'Date', 'Location', 'Urgency', 'Volunteers Assigned', 'Total Hours'])
    writer.writerow([])
    
    events = EventDetails.objects.all()
    for event in events:
        event_history = VolunteerHistory.objects.filter(event=event, status='completed')
        volunteer_count = event_history.count()
        total_hours = event_history.aggregate(Sum('hours_served'))['hours_served__sum'] or 0
        
        writer.writerow([
            event.event_name,
            event.start_date.strftime('%Y-%m-%d'),
            f"{event.location}, {event.city}, {event.state}",
            event.urgency,
            volunteer_count,
            total_hours
        ])
    
    return response
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_reports_pdf(request):
    """Export both volunteers and events data in a proper PDF"""
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="volunteer_reports.pdf"'
    
    # Create the PDF document
    doc = SimpleDocTemplate(response, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=1,  # Center aligned
    )
    elements.append(Paragraph("VOLUNTEER MANAGEMENT REPORTS", title_style))
    elements.append(Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # SECTION 1: Volunteers and their participation history
    elements.append(Paragraph("VOLUNTEERS AND PARTICIPATION HISTORY", styles['Heading2']))
    elements.append(Spacer(1, 10))
    
    # Volunteer data for table
    volunteer_data = [['Name', 'Email', 'Location', 'Events', 'Total Hours', 'Last Participation']]
    
    profiles = UserProfile.objects.all().select_related('user')
    for profile in profiles:
        history = VolunteerHistory.objects.filter(user=profile.user, status='completed')
        events_count = history.count()
        total_hours = history.aggregate(Sum('hours_served'))['hours_served__sum'] or 0
        last_participation = history.order_by('-participation_date').first()
        last_date = last_participation.participation_date.strftime('%Y-%m-%d') if last_participation else 'Never'
        
        volunteer_data.append([
            profile.full_name,
            profile.user.email,
            f"{profile.city}, {profile.state}",
            str(events_count),
            str(total_hours),
            last_date
        ])
    
    # Create volunteer table
    volunteer_table = Table(volunteer_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 0.7*inch, 0.8*inch, 1.2*inch])
    volunteer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(volunteer_table)
    elements.append(Spacer(1, 30))
    
    # SECTION 2: Event details and volunteer assignments
    elements.append(Paragraph("EVENT DETAILS AND VOLUNTEER ASSIGNMENTS", styles['Heading2']))
    elements.append(Spacer(1, 10))
    
    # Event data for table
    event_data = [['Event Name', 'Date', 'Location', 'Urgency', 'Volunteers', 'Total Hours']]
    
    events = EventDetails.objects.all()
    for event in events:
        event_history = VolunteerHistory.objects.filter(event=event, status='completed')
        volunteer_count = event_history.count()
        total_hours = event_history.aggregate(Sum('hours_served'))['hours_served__sum'] or 0
        
        event_data.append([
            event.event_name,
            event.start_date.strftime('%Y-%m-%d'),
            f"{event.city}, {event.state}",
            event.urgency.capitalize() if event.urgency else 'Not set',
            str(volunteer_count),
            str(total_hours)
        ])
    
    # Create event table
    event_table = Table(event_data, colWidths=[2*inch, 1*inch, 1.5*inch, 1*inch, 0.8*inch, 0.8*inch])
    event_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.lightblue),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(event_table)
    
    # Build PDF
    doc.build(elements)
    return response