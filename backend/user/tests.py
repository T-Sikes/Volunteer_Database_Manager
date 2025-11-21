from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from volunteer_db.models import UserCredentials, UserProfile, VolunteerHistory, EventDetails
from django.utils import timezone
from datetime import timedelta


class UserProfileAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test user
        self.user = UserCredentials.objects.create(username="testuser")
        self.user.set_password("Pass1234!")
        self.user.save()
        
        # Create user profile - using minimal fields, let the model handle defaults
        self.profile = UserProfile.objects.create(user=self.user)
        
        self.valid_data = {
            "full_name": "Jane Doe",
            "address1": "456 Elm St",
            "address2": "Apt 101",
            "city": "Springfield",
            "state": "IL",
            "zip_code": "62704",
            "skills": ["Python", "JavaScript"],
            "preferences": "No preferences",
            "availability": ["2025-10-20", "2025-10-21"]
        }
        
        self.invalid_data = {
            "full_name": "",
            "address1": "",
            "city": "",
            "state": "",
            "zip_code": "123",
            "skills": [],
            "availability": []
        }

    def test_get_user_profile_success(self):
        """Test retrieving a user profile"""
        response = self.client.get(f"/user/profile/{self.user.username}/")
        self.assertEqual(response.status_code, 200)
        expected_keys = [
            "full_name", "address1", "address2", "city",
            "state", "zip_code", "skills", "preferences", "availability"
        ]
        for key in expected_keys:
            self.assertIn(key, response.data)

    def test_get_user_profile_nonexistent_user(self):
        """Test retrieving profile for non-existent user returns 404"""
        response = self.client.get("/user/profile/nonexistentuser/")
        self.assertEqual(response.status_code, 404)

    def test_get_user_profile_no_profile(self):
        """Test retrieving profile when user exists but profile doesn't"""
        user_no_profile = UserCredentials.objects.create(username="noprofileuser")
        response = self.client.get(f"/user/profile/{user_no_profile.username}/")
        self.assertEqual(response.status_code, 404)

    def test_save_user_profile_valid(self):
        """Test saving valid profile data"""
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            self.valid_data,
            format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "saved")
        self.assertEqual(response.data["data"]["full_name"], "Jane Doe")
        
        # Verify data was actually saved
        get_resp = self.client.get(f"/user/profile/{self.user.username}/")
        self.assertEqual(get_resp.data["full_name"], "Jane Doe")
        self.assertEqual(get_resp.data["city"], "Springfield")

    def test_save_user_profile_invalid(self):
        """Test saving invalid profile data returns 400"""
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            self.invalid_data,
            format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("full_name", response.data)

    def test_save_user_profile_nonexistent_user(self):
        """Test saving profile for non-existent user returns 404"""
        response = self.client.post(
            "/user/profile/nonexistentuser/save/",
            self.valid_data,
            format="json"
        )
        self.assertEqual(response.status_code, 404)

    def test_save_user_profile_partial_invalid(self):
        """Test saving profile with some invalid fields"""
        partial_invalid = self.valid_data.copy()
        partial_invalid["zip_code"] = "12"  # Too short
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            partial_invalid,
            format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("zip_code", response.data)

    def test_save_user_profile_empty_body(self):
        """Test saving profile with empty request body"""
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            {},
            format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_save_user_profile_update_existing(self):
        """Test updating an existing profile"""
        # First save
        self.client.post(
            f"/user/profile/{self.user.username}/save/",
            self.valid_data,
            format="json"
        )
        
        # Update with new data
        updated_data = self.valid_data.copy()
        updated_data["full_name"] = "John Smith"
        updated_data["city"] = "Chicago"
        
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            updated_data,
            format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["full_name"], "John Smith")
        self.assertEqual(response.data["data"]["city"], "Chicago")

    def test_save_user_profile_invalid_state(self):
        """Test saving profile with invalid state code"""
        invalid_state_data = self.valid_data.copy()
        invalid_state_data["state"] = "XYZ"
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            invalid_state_data,
            format="json"
        )
        self.assertEqual(response.status_code, 400)

    def test_save_user_profile_missing_required_fields(self):
        """Test saving profile with missing required fields"""
        required_fields = ["full_name", "address1", "city", "state", "zip_code"]
        for field in required_fields:
            data = self.valid_data.copy()
            del data[field]
            response = self.client.post(
                f"/user/profile/{self.user.username}/save/",
                data,
                format="json"
            )
            self.assertEqual(response.status_code, 400, f"Field {field} should be required")

    def test_get_profile_method_not_allowed(self):
        """Test that POST is not allowed on GET endpoint"""
        response = self.client.post(f"/user/profile/{self.user.username}/", {})
        self.assertEqual(response.status_code, 405)

    def test_save_profile_method_not_allowed(self):
        """Test that GET is not allowed on save endpoint"""
        response = self.client.get(f"/user/profile/{self.user.username}/save/")
        self.assertEqual(response.status_code, 405)


class VolunteerHistoryAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test user
        self.user = UserCredentials.objects.create(username="historyuser")
        self.user.set_password("Pass1234!")
        self.user.save()
        
        # Create test event
        start = timezone.now() + timedelta(days=7)
        self.event = EventDetails.objects.create(
            event_name="Test Event",
            description="Test Description",
            location="Test Location",
            required_skills=["Testing"],
            urgency="medium",
            address="123 Test St",
            city="Houston",
            state="TX",
            zip_code="77004",
            start_date=start,
            end_date=start + timedelta(hours=3)
        )
        
        self.valid_record = {
            "event_id": self.event.id,
            "hours": 3,
            "status": "Completed"
        }

    def test_get_volunteer_history_success(self):
        """Test retrieving volunteer history"""
        response = self.client.get(f"/user/history/{self.user.username}/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_get_volunteer_history_nonexistent_user(self):
        """Test retrieving history for non-existent user returns 404"""
        response = self.client.get("/user/history/nonexistentuser/")
        self.assertEqual(response.status_code, 404)

    def test_get_volunteer_history_with_records(self):
        """Test retrieving history after adding records"""
        # Create a history record
        VolunteerHistory.objects.create(
            user=self.user,
            event=self.event,
            hours_served=3,
            status="Completed"
        )
        
        response = self.client.get(f"/user/history/{self.user.username}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertIn("eventName", response.data[0])

    def test_save_volunteer_record_success(self):
        """Test saving a valid volunteer record"""
        response = self.client.post(
            f"/user/history/{self.user.username}/save/",
            self.valid_record,
            format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "saved")
        self.assertIn("data", response.data)

    def test_save_volunteer_record_missing_event_id(self):
        """Test saving record without event_id returns 400"""
        invalid_record = {"hours": 3, "status": "Completed"}
        response = self.client.post(
            f"/user/history/{self.user.username}/save/",
            invalid_record,
            format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "event_id is required")

    def test_save_volunteer_record_invalid_event_id(self):
        """Test saving record with non-existent event_id returns 400"""
        invalid_record = {
            "event_id": 99999,
            "hours": 3,
            "status": "Completed"
        }
        response = self.client.post(
            f"/user/history/{self.user.username}/save/",
            invalid_record,
            format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_save_volunteer_record_zero_hours(self):
        """Test saving record with zero hours returns 400"""
        invalid_record = self.valid_record.copy()
        invalid_record["hours"] = 0
        response = self.client.post(
            f"/user/history/{self.user.username}/save/",
            invalid_record,
            format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_save_volunteer_record_negative_hours(self):
        """Test saving record with negative hours returns 400"""
        invalid_record = self.valid_record.copy()
        invalid_record["hours"] = -5
        response = self.client.post(
            f"/user/history/{self.user.username}/save/",
            invalid_record,
            format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_save_volunteer_record_none_hours(self):
        """Test saving record with None hours returns 400"""
        invalid_record = self.valid_record.copy()
        invalid_record["hours"] = None
        response = self.client.post(
            f"/user/history/{self.user.username}/save/",
            invalid_record,
            format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)

    def test_save_volunteer_record_nonexistent_user(self):
        """Test saving record for non-existent user returns 404"""
        response = self.client.post(
            "/user/history/nonexistentuser/save/",
            self.valid_record,
            format="json"
        )
        self.assertEqual(response.status_code, 404)

    def test_save_volunteer_record_default_status(self):
        """Test saving record without status uses default 'pending'"""
        record_no_status = {
            "event_id": self.event.id,
            "hours": 3
        }
        response = self.client.post(
            f"/user/history/{self.user.username}/save/",
            record_no_status,
            format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["status"], "pending")

    def test_save_multiple_volunteer_records(self):
        """Test saving multiple volunteer records"""
        # Save first record
        response1 = self.client.post(
            f"/user/history/{self.user.username}/save/",
            self.valid_record,
            format="json"
        )
        self.assertEqual(response1.status_code, 200)
        
        # Create second event
        start2 = timezone.now() + timedelta(days=14)
        event2 = EventDetails.objects.create(
            event_name="Second Event",
            description="Second Description",
            location="Second Location",
            required_skills=["Testing"],
            urgency="high",
            address="456 Test Ave",
            city="Houston",
            state="TX",
            zip_code="77005",
            start_date=start2,
            end_date=start2 + timedelta(hours=3)
        )
        
        # Save second record
        record2 = {
            "event_id": event2.id,
            "hours": 5,
            "status": "Pending"
        }
        response2 = self.client.post(
            f"/user/history/{self.user.username}/save/",
            record2,
            format="json"
        )
        self.assertEqual(response2.status_code, 200)
        
        # Verify both records exist
        history_response = self.client.get(f"/user/history/{self.user.username}/")
        self.assertEqual(len(history_response.data), 2)

    def test_get_history_method_not_allowed(self):
        """Test that POST is not allowed on GET endpoint"""
        response = self.client.post(f"/user/history/{self.user.username}/", {})
        self.assertEqual(response.status_code, 405)

    def test_save_history_method_not_allowed(self):
        """Test that GET is not allowed on save endpoint"""
        response = self.client.get(f"/user/history/{self.user.username}/save/")
        self.assertEqual(response.status_code, 405)


class EventsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test events
        start1 = timezone.now() + timedelta(days=7)
        self.event1 = EventDetails.objects.create(
            event_name="Community Cleanup",
            description="Cleaning up litter",
            location="Central Park",
            required_skills=["Leadership"],
            urgency="medium",
            address="100 Park Ave",
            city="Houston",
            state="TX",
            zip_code="77001",
            start_date=start1,
            end_date=start1 + timedelta(hours=3)
        )
        start2 = timezone.now() + timedelta(days=14)
        self.event2 = EventDetails.objects.create(
            event_name="Food Drive",
            description="Distribute food packages",
            location="Downtown Shelter",
            required_skills=["Food prep"],
            urgency="high",
            address="200 Shelter Rd",
            city="Houston",
            state="TX",
            zip_code="77002",
            start_date=start2,
            end_date=start2 + timedelta(hours=3)
        )

    def test_get_events_success(self):
        """Test retrieving all events"""
        response = self.client.get("/user/events/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 2)

    def test_get_events_empty_database(self):
        """Test retrieving events when database is empty"""
        EventDetails.objects.all().delete()
        response = self.client.get("/user/events/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_get_events_structure(self):
        """Test that events have expected structure"""
        response = self.client.get("/user/events/")
        self.assertEqual(response.status_code, 200)
        
        event = response.data[0]
        expected_keys = ["id", "name", "description", "location", 
                        "requiredSkills", "urgency", "eventDate"]
        for key in expected_keys:
            self.assertIn(key, event)

    def test_get_events_data_accuracy(self):
        """Test that event data is accurately returned"""
        response = self.client.get("/user/events/")
        self.assertEqual(response.status_code, 200)
        
        # Find the community cleanup event
        cleanup_event = next(e for e in response.data if e["name"] == "Community Cleanup")
        self.assertEqual(cleanup_event["description"], "Cleaning up litter")
        self.assertEqual(cleanup_event["location"], "Central Park")
        self.assertEqual(cleanup_event["urgency"], "medium")
        self.assertIn("Leadership", cleanup_event["requiredSkills"])

    def test_get_events_multiple_events(self):
        """Test retrieving multiple events"""
        # Create additional event
        start3 = timezone.now() + timedelta(days=21)
        EventDetails.objects.create(
            event_name="Book Reading",
            description="Reading to children",
            location="Library",
            required_skills=["Child care"],
            urgency="low",
            address="300 Library Ln",
            city="Houston",
            state="TX",
            zip_code="77003",
            start_date=start3,
            end_date=start3 + timedelta(hours=2)
        )
        
        response = self.client.get("/user/events/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_get_events_method_not_allowed(self):
        """Test that POST, PUT, DELETE are not allowed"""
        response = self.client.post("/user/events/", {})
        self.assertEqual(response.status_code, 405)
        
        response = self.client.put("/user/events/", {})
        self.assertEqual(response.status_code, 405)
        
        response = self.client.delete("/user/events/")
        self.assertEqual(response.status_code, 405)


class EdgeCaseTests(TestCase):
    """Test edge cases and boundary conditions"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = UserCredentials.objects.create(username="edgeuser")
        self.user.set_password("Pass1234!")
        self.user.save()
        
        # Create user profile with minimal fields
        self.profile = UserProfile.objects.create(user=self.user)
        
        self.event = EventDetails.objects.create(
            event_name="Test Event",
            description="Test",
            location="Test Location",
            required_skills=["Testing"],
            urgency="medium",
            address="400 Edge St",
            city="Houston",
            state="TX",
            zip_code="77004",
            start_date=timezone.now() + timedelta(days=7),
            end_date=timezone.now() + timedelta(days=7, hours=3)
        )

    def test_profile_with_special_characters(self):
        """Test profile with special characters in names"""
        data = {
            "full_name": "José María García-López",
            "address1": "123 O'Reilly St.",
            "address2": "",
            "city": "São Paulo",
            "state": "TX",
            "zip_code": "12345",
            "skills": ["Python", "C++", "C#"],
            "preferences": "Weekends only",
            "availability": ["2025-10-20"]
        }
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            data,
            format="json"
        )
        self.assertIn(response.status_code, [200, 400])

    def test_profile_with_very_long_strings(self):
        """Test profile with maximum length strings"""
        data = {
            "full_name": "A" * 100,
            "address1": "B" * 200,
            "address2": "C" * 200,
            "city": "D" * 100,
            "state": "TX",
            "zip_code": "12345",
            "skills": ["Skill1", "Skill2"],
            "preferences": "E" * 500,
            "availability": ["2025-10-20"]
        }
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            data,
            format="json"
        )
        self.assertIn(response.status_code, [200, 400])

    def test_history_with_large_hours(self):
        """Test history with very large number of hours"""
        record = {
            "event_id": self.event.id,
            "hours": 1000,
            "status": "Completed"
        }
        response = self.client.post(
            f"/user/history/{self.user.username}/save/",
            record,
            format="json"
        )
        self.assertIn(response.status_code, [200, 400])

    def test_profile_with_empty_optional_fields(self):
        """Test saving profile with empty optional fields"""
        data = {
            "full_name": "Jane Doe",
            "address1": "123 Main St",
            "address2": "",
            "city": "Springfield",
            "state": "IL",
            "zip_code": "62704",
            "skills": ["Python"],
            "preferences": "",
            "availability": ["2025-10-20"]
        }
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            data,
            format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_history_with_different_status_values(self):
        """Test history with various status values"""
        statuses = ["Completed", "Pending", "Cancelled", "In Progress"]
        for status_val in statuses:
            record = {
                "event_id": self.event.id,
                "hours": 3,
                "status": status_val
            }
            response = self.client.post(
                f"/user/history/{self.user.username}/save/",
                record,
                format="json"
            )
            self.assertEqual(response.status_code, 200)

    def test_get_empty_history(self):
        """Test getting history when user has no records"""
        response = self.client.get(f"/user/history/{self.user.username}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_profile_with_many_skills(self):
        """Test profile with many skills"""
        data = {
            "full_name": "Jane Doe",
            "address1": "123 Main St",
            "address2": "",
            "city": "Springfield",
            "state": "IL",
            "zip_code": "62704",
            "skills": [f"Skill{i}" for i in range(20)],
            "preferences": "Flexible",
            "availability": ["2025-10-20"]
        }
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            data,
            format="json"
        )
        self.assertIn(response.status_code, [200, 400])

    def test_profile_with_many_availability_dates(self):
        """Test profile with many availability dates"""
        dates = [f"2025-{10+i//30:02d}-{1+i%30:02d}" for i in range(30)]
        data = {
            "full_name": "Jane Doe",
            "address1": "123 Main St",
            "address2": "",
            "city": "Springfield",
            "state": "IL",
            "zip_code": "62704",
            "skills": ["Python"],
            "preferences": "Flexible",
            "availability": dates
        }
        response = self.client.post(
            f"/user/profile/{self.user.username}/save/",
            data,
            format="json"
        )
        self.assertIn(response.status_code, [200, 400])