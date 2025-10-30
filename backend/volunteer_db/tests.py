from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from .models import UserProfile, UserCredentials, States, EventDetails

# Create your tests here.
class UserProfileModelTests(TestCase):
    def setUp(self):
        self.user = UserCredentials.objects.create_user(username="testuser", password="password123")
        self.state = States.objects.create(state_code="CA", state_name="California")

    def test_valid_zipcode(self):
        profile = UserProfile(
            user=self.user,
            full_name="John Doe",
            address="123 Main St",
            city="Los Angeles",
            state=self.state,
            zipcode="90001",  # valid
            skills="Python",
            preferences="Backend",
            availability="Weekends"
        )
        profile.full_clean()  # triggers validators

    def test_invalid_zipcode(self):
        profile = UserProfile(
            user=self.user,
            full_name="John Doe",
            address="123 Main St",
            city="Los Angeles",
            state=self.state,
            zipcode="ABC",  # invalid
            skills="Python",
            preferences="Backend",
            availability="Weekends"
        )
        with self.assertRaises(ValidationError):
            profile.full_clean()

class EventDetailsModelTests(TestCase):
    def test_valid_urgency_and_date(self):
        event = EventDetails(
            event_name="Food Drive",
            description="Community service",
            location="Community Center",
            required_skills="Cooking",
            urgency="High",
            event_date=timezone.now().date() + timezone.timedelta(days=1)  # future
        )
        event.full_clean()  # should pass

    def test_invalid_urgency(self):
        event = EventDetails(
            event_name="Food Drive",
            description="Community service",
            location="Community Center",
            required_skills="Cooking",
            urgency="Extreme",  # invalid
            event_date=timezone.now().date() + timezone.timedelta(days=1)
        )
        with self.assertRaises(ValidationError):
            event.full_clean()

    def test_past_event_date(self):
        event = EventDetails(
            event_name="Food Drive",
            description="Community service",
            location="Community Center",
            required_skills="Cooking",
            urgency="High",
            event_date=timezone.now().date() - timezone.timedelta(days=1)  # past
        )
        with self.assertRaises(ValidationError):
            event.full_clean()