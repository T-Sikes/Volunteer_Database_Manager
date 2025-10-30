from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from volunteer_db.models import UserCredentials as User


class UserProfileAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create a test user with proper password hashing
        self.user = User.objects.create(username="testuser")
        self.user.set_password("Pass1234!")
        self.user.save()
        self.client.force_authenticate(user=self.user)

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
        self.partial_invalid_data = self.valid_data.copy()
        self.partial_invalid_data["zip_code"] = "12"

    def test_get_profile(self):
        response = self.client.get("/user/profile/")
        self.assertEqual(response.status_code, 200)
        expected_keys = [
            "full_name", "address1", "address2", "city",
            "state", "zip_code", "skills", "preferences", "availability"
        ]
        for key in expected_keys:
            self.assertIn(key, response.data)

    def test_save_profile_valid(self):
        response = self.client.post("/user/profile/save/", self.valid_data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "saved")
        for key, value in self.valid_data.items():
            self.assertEqual(response.data["data"][key], value)

        # Verify GET reflects updated data
        get_resp = self.client.get("/user/profile/")
        for key, value in self.valid_data.items():
            self.assertEqual(get_resp.data[key], value)

    def test_save_profile_fully_invalid(self):
        response = self.client.post("/user/profile/save/", self.invalid_data, format="json")
        self.assertEqual(response.status_code, 400)
        for key in ["full_name", "address1", "city", "state", "zip_code", "skills", "availability"]:
            self.assertIn(key, response.data)

    def test_save_profile_partial_invalid(self):
        response = self.client.post("/user/profile/save/", self.partial_invalid_data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("zip_code", response.data)

    def test_save_profile_empty_body(self):
        response = self.client.post("/user/profile/save/", {}, format="json")
        self.assertEqual(response.status_code, 400)
        for key in ["full_name", "address1", "city", "state", "zip_code", "skills", "availability"]:
            self.assertIn(key, response.data)


class VolunteerHistoryAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(username="historyuser")
        self.user.set_password("Pass1234!")
        self.user.save()
        self.client.force_authenticate(user=self.user)

        self.valid_record = {
            "eventName": "Test Event",
            "description": "Temp event",
            "location": "Test Location",
            "requiredSkills": ["Testing"],
            "urgency": "Low",
            "eventDate": "2025-10-20",
            "hours": 2,
            "status": "Pending"
        }
        self.invalid_record = self.valid_record.copy()
        self.invalid_record["hours"] = -1
        self.partial_invalid_record = self.valid_record.copy()
        self.partial_invalid_record.pop("eventName")

    def test_get_history(self):
        response = self.client.get("/user/history/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_save_valid_record(self):
        response = self.client.post("/user/history/save/", self.valid_record, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "saved")
        self.assertEqual(response.data["data"]["eventName"], "Test Event")

    def test_save_invalid_record(self):
        response = self.client.post("/user/history/save/", self.invalid_record, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("hours", response.data)

    def test_save_partial_invalid_record(self):
        response = self.client.post("/user/history/save/", self.partial_invalid_record, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("eventName", response.data)

    def test_save_empty_record(self):
        response = self.client.post("/user/history/save/", {}, format="json")
        self.assertEqual(response.status_code, 400)
        # Adjusted keys to match actual serializer output
        for key in ["eventName", "location", "requiredSkills", "urgency", "eventDate", "hours", "status"]:
            self.assertIn(key, response.data)


class EventsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(username="eventsuser")
        self.user.set_password("Pass1234!")
        self.user.save()
        self.client.force_authenticate(user=self.user)

    def test_get_events(self):
        response = self.client.get("/user/events/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        self.assertTrue(len(response.data) > 0)
