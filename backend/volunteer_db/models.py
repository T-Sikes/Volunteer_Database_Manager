from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MaxLengthValidator, MinLengthValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

#these classes represent names of tables that are translated by django to SQL


# =========================
#  Custom Validators
# =========================

def validate_zipcode(value):
    if not value.isdigit() or len(value) != 5:
        raise ValidationError("Zipcode must be exactly 5 digits.")

def validate_urgency(value):
    valid_levels = ['low', 'medium', 'high', 'critical']
    if value not in valid_levels:
        raise ValidationError(f"Urgency must be one of {valid_levels}.")

def validate_future_date(value):
    if value < timezone.now():
        raise ValidationError("Event date cannot be in the past.")
    
def validate_is_list(value):
    if not isinstance(value, list):
        raise ValidationError("Required skills must be a list")



# =========================
#  USER MANAGER
# =========================

class UserCredentialsManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Users must have a username.")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)  # hashes password automatically
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, password, **extra_fields)


# =========================
#  USER CREDENTIALS TABLE
# =========================

class UserCredentials(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserCredentialsManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    
    # note AbstractBaseUser is built in django paramater that creates a hashed password field 
    # this hashed password should not be directly accesed. 
    # Use user.set_password('raw_password') to set it
    # Use user.check_password('raw_password') to verify it

# =========================
#  STATE CHOICES
# ========================
class States(models.TextChoices):
    # NAME = database_value, human_readable_label
    ALABAMA = 'AL', 'Alabama'
    ALASKA = 'AK', 'Alaska'
    ARIZONA = 'AZ', 'Arizona'
    ARKANSAS = 'AR', 'Arkansas'
    CALIFORNIA = 'CA', 'California'
    COLORADO = 'CO', 'Colorado'
    CONNECTICUT = 'CT', 'Connecticut'
    DELAWARE = 'DE', 'Delaware'
    FLORIDA = 'FL', 'Florida'
    GEORGIA = 'GA', 'Georgia'
    HAWAII = 'HI', 'Hawaii'
    IDAHO = 'ID', 'Idaho'
    ILLINOIS = 'IL', 'Illinois'
    INDIANA = 'IN', 'Indiana'
    IOWA = 'IA', 'Iowa'
    KANSAS = 'KS', 'Kansas'
    KENTUCKY = 'KY', 'Kentucky'
    LOUISIANA = 'LA', 'Louisiana'
    MAINE = 'ME', 'Maine'
    MARYLAND = 'MD', 'Maryland'
    MASSACHUSETTS = 'MA', 'Massachusetts'
    MICHIGAN = 'MI', 'Michigan'
    MINNESOTA = 'MN', 'Minnesota'
    MISSISSIPPI = 'MS', 'Mississippi'
    MISSOURI = 'MO', 'Missouri'
    MONTANA = 'MT', 'Montana'
    NEBRASKA = 'NE', 'Nebraska'
    NEVADA = 'NV', 'Nevada'
    NEW_HAMPSHIRE = 'NH', 'New Hampshire'
    NEW_JERSEY = 'NJ', 'New Jersey'
    NEW_MEXICO = 'NM', 'New Mexico'
    NEW_YORK = 'NY', 'New York'
    NORTH_CAROLINA = 'NC', 'North Carolina'
    NORTH_DAKOTA = 'ND', 'North Dakota'
    OHIO = 'OH', 'Ohio'
    OKLAHOMA = 'OK', 'Oklahoma'
    OREGON = 'OR', 'Oregon'
    PENNSYLVANIA = 'PA', 'Pennsylvania'
    RHODE_ISLAND = 'RI', 'Rhode Island'
    SOUTH_CAROLINA = 'SC', 'South Carolina'
    SOUTH_DAKOTA = 'SD', 'South Dakota'
    TENNESSEE = 'TN', 'Tennessee'
    TEXAS = 'TX', 'Texas'
    UTAH = 'UT', 'Utah'
    VERMONT = 'VT', 'Vermont'
    VIRGINIA = 'VA', 'Virginia'
    WASHINGTON = 'WA', 'Washington'
    WEST_VIRGINIA = 'WV', 'West Virginia'
    WISCONSIN = 'WI', 'Wisconsin'
    WYOMING = 'WY', 'Wyoming'
    UNKNOWN = 'XX', 'Unknown'
    

# =========================
#  USER PROFILE TABLE
# =========================


class UserProfile(models.Model):
    user = models.OneToOneField(UserCredentials, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=200)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(
        max_length=2,
        choices=States.choices,
        default=States.UNKNOWN, 
    )
    zipcode = models.CharField(max_length=10, validators=[validate_zipcode])
    skills = models.JSONField(validators=[validate_is_list], null=True)
    preferences = models.TextField(blank=True)
    availability = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.full_name} ({self.user.username})"
    
# =========================
#  EVENT DETAILS TABLE
# =========================
class EventDetails(models.Model):
    event_name = models.CharField(max_length=200)
    description = models.TextField(null=True)
    location = models.CharField(max_length=200, null=True)
    required_skills = models.JSONField(validators=[validate_is_list], null=True)
    urgency = models.CharField(max_length=50, validators=[validate_urgency], null=True)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    state = models.CharField(
        max_length=2,
        choices=States.choices,
        default=States.UNKNOWN, 
    )
    zip_code = models.CharField(max_length=10, validators=[validate_zipcode])
    start_date = models.DateTimeField(validators=[validate_future_date])
    end_date = models.DateTimeField()

    # Validate that end date is after start date
    def clean(self):
        super().clean()
        if self.start_date and self.end_date:
            if self.end_date <= self.start_date:
                raise ValidationError({
                    'end_date': 'End date must be after start date'
                })

    def __str__(self):
        return self.event_name
    

# =========================
#  VOLUNTEER HISTORY TABLE
# =========================
class VolunteerHistory(models.Model):
    user = models.ForeignKey(UserCredentials, on_delete=models.CASCADE)
    event = models.ForeignKey(EventDetails, on_delete=models.CASCADE)
    participation_date = models.DateField(default=timezone.now)
    hours_served = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.event.event_name}"
