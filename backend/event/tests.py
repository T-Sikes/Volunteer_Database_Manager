from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class EventMatchTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.BASE_URL = "/api/events/"

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
