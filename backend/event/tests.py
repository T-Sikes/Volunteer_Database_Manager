from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from datetime import datetime, timedelta
from volunteer_db.models import EventDetails, UserProfile, VolunteerHistory, Notification, UserCredentials

class EventMatchTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.BASE_URL = "/event/"

    def test_get_events(self):
        res = self.client.get(f"{self.BASE_URL}")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(res.data, list))

    def test_get_volunteers(self):
        res = self.client.get(f"{self.BASE_URL}volunteers/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) > 0)

    def test_auto_match(self):
        res = self.client.post(f"{self.BASE_URL}match/", {"volunteerName": "Jane Smith"}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("eventName", res.data)
        self.assertIn("matchType", res.data)
        self.assertEqual(res.data["matchType"], "auto")

    def test_manual_match_existing_event(self):
        payload = {
            "volunteerName": "John Doe",
            "eventName": "Soup Kitchen",
            "eventDate": "2025-10-16",
            "location": "Some building"
        }
        res = self.client.post(f"{self.BASE_URL}match/", payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get("matchType"), "manual")
        self.assertEqual(res.data.get("eventName"), "Soup Kitchen")

    def test_manual_match_posted_event_not_in_backend(self):
        payload = {
            "volunteerName": "John Doe",
            "eventName": "Community Cleanup",
            "eventDate": "2025-12-25",
            "location": "Herman Park",
            "requiredSkills": ["First Aid"]
        }
        res = self.client.post(f"{self.BASE_URL}match/", payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get("matchType"), "manual")
        self.assertEqual(res.data.get("eventName"), "Community Cleanup")

class EventViewsTestCase(TestCase):
    def setUp(self):
        """Set up test data before each test"""
        self.client = APIClient()
        self.BASE_URL = "/event/"
        
        # Create admin user
        self.admin_user = UserCredentials.objects.create_superuser(
            email='admin@admin.com',
            password='adminpass123',
        )
        self.admin_profile = UserProfile.objects.create(
            user=self.admin_user,
            full_name='Admin User',
            address='5678 Windsor St.',
            city='Townsville',
            zipcode='33412',
            skills=["Leadership", "Childcare", "Food prep"],
            preferences="I like to work in the evening",
            state='TX',
            availability_json={"friday": {"end": "17:00", "start": "09:00", "available": True}, "monday": {"end": "17:00", "start": "09:00", "available": True}, "sunday": {"end": "17:00", "start": "09:00", "available": True}, "tuesday": {"end": "17:00", "start": "09:00", "available": True}, "saturday": {"end": "17:00", "start": "09:00", "available": True}, "thursday": {"end": "17:00", "start": "09:00", "available": True}, "wednesday": {"end": "17:00", "start": "09:00", "available": True}},
            availability="placeholder" # Old availability field. Nor relevant
        )
        
        # Create regular volunteer user
        self.volunteer_user = UserCredentials.objects.create_user(
            email='volunteer@gmail.com',
            password='volpass123',
        )
        self.volunteer_profile = UserProfile.objects.create(
            user=self.volunteer_user,
            full_name='Volunteer User',
            address='1234 Main St',
            city='Cityville',
            zipcode='73845',
            skills=["Leadership", "Childcare", "Food prep"],
            preferences="I like to work in the morning",
            state='CA',
            availability_json={"friday": {"end": "17:00", "start": "09:00", "available": True}, "monday": {"end": "17:00", "start": "09:00", "available": True}, "sunday": {"end": "17:00", "start": "09:00", "available": True}, "tuesday": {"end": "17:00", "start": "09:00", "available": True}, "saturday": {"end": "17:00", "start": "09:00", "available": True}, "thursday": {"end": "17:00", "start": "09:00", "available": True}, "wednesday": {"end": "17:00", "start": "09:00", "available": True}},
            availability="placeholder" # Old availability field. Nor relevant

        )
        
        # Create test events
        self.event1 = EventDetails.objects.create(
            event_name='Beach Cleanup',
            description='Clean up the beach',
            location='Santa Monica Beach',
            required_skills=['Leadership'],
            urgency='medium',
            address='1234 Santa Monica St',
            city='Santa Monica',
            state='CA',
            zip_code='22345',
            start_date=datetime.now().date() + timedelta(days=7),
            end_date=datetime.now().date() + timedelta(days=8)

        )
        
        self.event2 = EventDetails.objects.create(
            event_name='Food Drive',
            description='Organize food donations',
            location='Community Center',
            required_skills=['Food prep', 'Ability to lift 50 lbs', 'Retail experience'],
            urgency='high',
            address='3845 Thompson Ln.',
            city='Dallas',
            state='TX',
            zip_code='77372',
            start_date=datetime.now().date() + timedelta(days=14),
            end_date=datetime.now().date() + timedelta(days=15)
        )
        
        # Create volunteer assignment
        self.assignment = VolunteerHistory.objects.create(
            user=self.volunteer_user,
            user_profile=self.volunteer_profile,
            event=self.event1,
        )

    def test_get_events_authenticated(self):
        """Test getting all events when authenticated"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f"{self.BASE_URL}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        event_names = [event['event_name'] for event in response.data]
        self.assertIn('Food Drive', event_names)
        self.assertIn('Beach Cleanup', event_names)

    def test_get_events_unauthenticated(self):
        """Test getting events without authentication fails"""
        response = self.client.get(f"{self.BASE_URL}")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_volunteers_authenticated(self):
        """Test getting all volunteers when authenticated"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f"{self.BASE_URL}volunteers/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_volunteers_unauthenticated(self):
        """Test getting volunteers without authentication fails"""
        response = self.client.get(f"{self.BASE_URL}volunteers/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_event_as_admin(self):
        """Test creating event as admin user"""
        self.client.force_authenticate(user=self.admin_user)
        
        event_data = {
            'event_name':'More Beach Cleanup',
            'description':'Clean up the beach',
            'location':'Santa Monica Beach',
            'required_skills':['Leadership', ],
            'urgency':'medium',
            'address':'1234 Santa Monica St',
            'city':'Santa Monica',
            'state':'CA',
            'zip_code':'22345',
            'start_date':datetime.now().date() + timedelta(days=7),
            'end_date':datetime.now().date() + timedelta(days=8)
        }
        
        response = self.client.post(f"{self.BASE_URL}create/", event_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['event_name'], 'More Beach Cleanup')
        self.assertTrue(EventDetails.objects.filter(event_name='More Beach Cleanup').exists())
        
        # Check notification was created
        # notification = Notification.objects.filter(
        #     user_profile=self.admin_profile,
        #     message__contains='More Beach Cleanup'
        # ).first()
        # self.assertIsNotNone(notification)

    def test_create_event_as_volunteer_denied(self):
        """Test creating event as volunteer is denied"""
        self.client.force_authenticate(user=self.volunteer_user)
        
        event_data = {
            'event_name':'More Beach Cleanup',
            'description':'Clean up the beach',
            'location':'Santa Monica Beach',
            'required_skills':['Leadership', ],
            'urgency':'medium',
            'address':'1234 Santa Monica St',
            'city':'Santa Monica',
            'state':'CA',
            'zip_code':'22345',
            'start_date':datetime.now().date() + timedelta(days=7),
            'end_date':datetime.now().date() + timedelta(days=8)
        }
        
        response = self.client.post(f"{self.BASE_URL}create/", event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_event_invalid_data(self):
        """Test creating event with invalid data"""
        self.client.force_authenticate(user=self.admin_user)
        
        event_data = {
            'event_name': '',  # Invalid: empty name
            'location': 'Test Location',
            'urgency': 'whatever'
        }
        
        response = self.client.post(f"{self.BASE_URL}create/", event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_event_as_admin(self):
        """Test updating event as admin"""
        self.client.force_authenticate(user=self.admin_user)
        
        updated_data = {
            'event_name':'Food Drive - Updated',
            'description': self.event2.description,
            'location': self.event2.location,
            'required_skills': self.event2.required_skills,
            'urgency': 'medium',
            'address':  self.event2.address,
            'city': self.event2.city,
            'state': self.event2.state,
            'zip_code': self.event2.zip_code,
            'start_date': self.event2.start_date.isoformat(),
            'end_date': self.event2.end_date.isoformat()
        }
        
        response = self.client.put(f'{self.BASE_URL}{self.event2.pk}/', updated_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.event2.refresh_from_db()
        self.assertEqual(self.event2.event_name, 'Food Drive - Updated')
        self.assertEqual(self.event2.urgency, 'medium')

    def test_update_event_as_volunteer_denied(self):
        """Test updating event as volunteer is denied"""
        self.client.force_authenticate(user=self.volunteer_user)
        
        updated_data = {'event_name': 'Should Not Update'}
        response = self.client.put(f"{self.BASE_URL}{self.event1.pk}/", updated_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_nonexistent_event(self):
        """Test updating event that doesn't exist"""
        self.client.force_authenticate(user=self.admin_user)
        
        updated_data = {'event_name': 'Does Not Exist'}
        response = self.client.put(f"{self.BASE_URL}9999999999/", updated_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_event_as_admin(self):
        """Test deleting event as admin"""
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.delete(f"{self.BASE_URL}{self.event2.pk}/")
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(EventDetails.objects.filter(pk=self.event2.pk).exists())
        
        # Check notification was created
        # notification = Notification.objects.filter(
        #     user_profile=self.admin_profile,
        #     message__contains='Food Drive'
        # ).first()
        # self.assertIsNotNone(notification)

    def test_delete_event_as_volunteer_denied(self):
        """Test deleting event as volunteer is denied"""
        self.client.force_authenticate(user=self.volunteer_user)
        
        response = self.client.delete(f"{self.BASE_URL}{self.event1.pk}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_assign_volunteer_as_admin(self):
        """Test assigning volunteer to event as admin"""
        self.client.force_authenticate(user=self.admin_user)
        
        assignment_data = {
            'user': self.volunteer_user.id,
            'user_profile': self.volunteer_profile.id,
            'event': self.event2.id,
        }
        
        response = self.client.post(f"{self.BASE_URL}assign/", assignment_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            VolunteerHistory.objects.filter(
                user=self.volunteer_user,
                event=self.event2
            ).exists()
        )

    def test_assign_volunteer_as_volunteer_denied(self):
        """Test assigning volunteer as non-admin is denied"""
        self.client.force_authenticate(user=self.volunteer_user)
        
        assignment_data = {
            'user': self.volunteer_user.id,
            'user_profile': self.volunteer_profile.id,
            'event': self.event2.id,
        }
        
        response = self.client.post(f"{self.BASE_URL}assign/", assignment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_user_events_as_admin(self):
        """Test admin gets all volunteer assignments"""
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(f"{self.BASE_URL}assigned-events/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_user_events_as_volunteer(self):
        """Test volunteer gets only their assignments"""
        self.client.force_authenticate(user=self.volunteer_user)
        
        response = self.client.get(f"{self.BASE_URL}assigned-events/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['event_details']['event_name'], 'Beach Cleanup')

    def test_unassign_volunteer_as_admin(self):
        """Test unassigning volunteer from event as admin"""
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.delete(
            f"{self.BASE_URL}unassign/{self.event1.id}/{self.volunteer_user.id}/{self.volunteer_profile.id}/"
        )
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            VolunteerHistory.objects.filter(
                user=self.volunteer_user,
                event=self.event1
            ).exists()
        )

    def test_unassign_volunteer_as_volunteer_denied(self):
        """Test unassigning volunteer as non-admin is denied"""
        self.client.force_authenticate(user=self.volunteer_user)
        
        response = self.client.delete(
            f"{self.BASE_URL}unassign/{self.event1.id}/{self.volunteer_user.id}/{self.volunteer_profile.id}/"
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unassign_nonexistent_assignment(self):
        """Test unassigning non-existent assignment returns 404"""
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.delete(f"{self.BASE_URL}unassign/99999/99999/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_volunteers_for_event(self):
        """Test getting volunteers assigned to specific event"""
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(f"{self.BASE_URL}{self.event1.id}/volunteers/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user_profile_details']['full_name'], 'Volunteer User')

    def test_get_volunteers_for_event_no_assignments(self):
        """Test getting volunteers for event with no assignments"""
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.get(f"{self.BASE_URL}{self.event2.id}/volunteers/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
