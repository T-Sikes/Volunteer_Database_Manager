from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

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

# Create your tests here.
class EventManagementAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_data = {
            "id": 5,
            "name": "School Supply Drive",
            "description": "Donate school supplies for K-12 Students",
            "location": "Houston Food Bank",
            "address": "500 Donation Dr.",
            "city": "Houston",
            "state": "TX",
            "zipCode": "77002",
            "requiredSkills": ["Able to lift more than 50 lbs, Leadership"],
            "urgency": "medium",
            "date": "2025-10-23"
        }

    def test_get_events(self):
        response = self.client.get("/event/")
        self.assertEqual(response.status_code, 200)
        # check all expected keys exist
        for key in ["id", "name", "description", "city", "state", "zipCode", "requiredSkills", "urgency", "date"]:
            self.assertIn(key, response.data)

    def test_create_event_valid(self):
        response = self.client.post("/event/create/", self.valid_data, format="json")
        self.assertEqual(response.status_code, 201)
        # check all fields in response
        for key, value in self.valid_data.items():
            self.assertEqual(response.data[key], value)

        # Verify GET reflects updated data
        get_resp = self.client.get("/event/")
        for key, value in self.valid_data.items():
            self.assertEqual(get_resp.data[key], value)

    def test_update_event_valid(self):
        response = self.client.put("/event/2/", self.valid_data, format="json")
        self.assertEqual(response.status_code, 201)
        # check all fields in response
        for key, value in self.valid_data.items():
            self.assertEqual(response.data[key], value)

        # Verify GET reflects updated data
        get_resp = self.client.get("/event/")
        for key, value in self.valid_data.items():
            self.assertEqual(get_resp.data[key], value)
