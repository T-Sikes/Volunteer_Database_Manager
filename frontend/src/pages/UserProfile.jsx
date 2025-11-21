import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserProfileForm from "../components/UserProfileForm.jsx";
import axiosInstance from "../components/AxiosInstance.jsx";


function UserProfile() {
  const [showForm, setShowForm] = useState(false); // show form only when editing
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    
  useEffect(() => {
    console.log("🔄 Starting profile load process...");
    
    // Fixed URLs - remove the extra 'user/'
    axiosInstance.get('user/current/')  // ← CHANGED
      .then(response => {
        console.log("✅ Current user response:", response.data);
        const username = response.data.username;
        const encodedUsername = encodeURIComponent(username);
        console.log("📝 Username (encoded):", encodedUsername);


        return axiosInstance.get(`user/profile/${encodedUsername}/`);  // ← CHANGED
      })
      .then(response => {
        console.log("✅ Profile data received:", response.data);
        setProfileData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error loading profile:", err);
        console.error("Error details:", err.response?.data);
        setError("Failed to load profile. Please make sure you're logged in.");
        setLoading(false);
      });
  }, []);

  const submitProfile = (data) => {
  // Get current username dynamically
  axiosInstance.get('user/current/')
    .then(response => {
      const username = response.data.username;
      const encodedUsername = encodeURIComponent(username);
      
      return axiosInstance.post(`user/profile/${encodedUsername}/save/`, data);
    })
    .then(response => {
      setProfileData(response.data.data);
      setShowForm(false);
    })
    .catch(err => {
      console.error("Error saving profile:", err);
      setError("Failed to save profile");
    });
};


const formatAvailabilityForDisplay = (availability) => {
  if (!availability || typeof availability !== 'object') return "Not set";
  
  const days = [
    { key: 'monday', name: 'Monday' },
    { key: 'tuesday', name: 'Tuesday' },
    { key: 'wednesday', name: 'Wednesday' },
    { key: 'thursday', name: 'Thursday' },
    { key: 'friday', name: 'Friday' },
    { key: 'saturday', name: 'Saturday' },
    { key: 'sunday', name: 'Sunday' }
  ];

  const availableDays = days
    .filter(day => availability[day.key]?.available)
    .map(day => {
      const timeSlot = availability[day.key];
      return `${day.name} ${timeSlot.start}-${timeSlot.end}`;
    });

  return availableDays.length > 0 ? availableDays.join(', ') : "Not available";
};

  const toggleForm = () => setShowForm(!showForm);

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="text-black">Loading profile...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // If no profile yet, force show the form
  if (!profileData) {
    return <UserProfileForm submitProfile={submitProfile} closeForm={toggleForm} initialData={profileData} />;
  }

return (
    <>
      <style>
        {`
          .fixed.top-0.z-5 {
            color: #1f2937 !important;
          }
          .fixed.top-0.z-5 h1,
          .fixed.top-0.z-5 span {
            color: inherit !important;
          }
        `}
      </style>

      {showForm ? (
        <UserProfileForm submitProfile={submitProfile} closeForm={toggleForm} initialData={profileData} />
      ) : (
        <div className="h-[89%] w-screen flex justify-center items-center"> 
          <div className="bg-white shadow-lg rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">{profileData.full_name}</h2>
            <div className="text-black p-4 rounded text-center">
              <p><strong>Full Name:</strong> {profileData.full_name}</p>
              <p><strong>Address 1:</strong> {profileData.address1}</p>
              {profileData.address2 && <p><strong>Address 2:</strong> {profileData.address2}</p>}
              <p><strong>City:</strong> {profileData.city}</p>
              <p><strong>State:</strong> {profileData.state}</p>
              <p><strong>Zip Code:</strong> {profileData.zip_code}</p>
              <p><strong>Skills:</strong> {profileData.skills?.join(', ') || "Not set"}</p>
              {profileData.preferences && <p><strong>Preferences:</strong> {profileData.preferences}</p>}
              <p><strong>Availability:</strong> {formatAvailabilityForDisplay(profileData.availability) || "Not set"}</p>
            </div>
            <button
              onClick={toggleForm}
              style={{ backgroundColor: '#3fa2a5', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'black' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3fa2a5' }}
              className="px-4 py-2 rounded mt-4 block mx-auto"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;