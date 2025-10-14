import { useState, useEffect } from "react";
import UserProfileForm from "../components/userProfileForm.jsx";

function UserProfile() {
  const [showForm, setShowForm] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const API_BASE = "http://127.0.0.1:8000/user";


  useEffect(() => {
    // fetch existing profile
    fetch(`${API_BASE}/profile/`)
      .then(res => res.json())
      .then(data => {
        setProfileData(data);
        setShowForm(false); // hide form if we have data
      })
      .catch(err => console.error("Error fetching profile:", err));
  }, []);

  const submitProfile = (data) => {
    // POST to backend save endpoint
    fetch(`${API_BASE}/profile/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(savedData => {
        console.log("Saved:", savedData);
        setProfileData(savedData.data); // update state with response
        setShowForm(false); // hide form after save
      })
      .catch(err => console.error("Error saving profile:", err));
  };

  const toggleForm = () => setShowForm(!showForm);

  return (
    <>
      {showForm ? (
        <UserProfileForm submitProfile={submitProfile} closeForm={toggleForm} initialData={profileData} />
      ) : (
        <div className="flex justify-center items-center h-screen w-screen">
          <div className="bg-white shadow-lg rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Profile Saved!</h2>
            <div className="text-black p-4 rounded text-center">
              <p><strong>Full Name:</strong> {profileData.full_name}</p>
              <p><strong>Address 1:</strong> {profileData.address1}</p>
              {profileData.address2 && <p><strong>Address 2:</strong> {profileData.address2}</p>}
              <p><strong>City:</strong> {profileData.city}</p>
              <p><strong>State:</strong> {profileData.state}</p>
              <p><strong>Zip Code:</strong> {profileData.zip_code}</p>
              <p><strong>Skills:</strong> {profileData.skills.join(', ')}</p>
              {profileData.preferences && <p><strong>Preferences:</strong> {profileData.preferences}</p>}
              <p><strong>Availability:</strong> {profileData.availability.join(', ')}</p>
            </div>
            <button
              onClick={toggleForm}
              style={{ backgroundColor: '#3fa2a5', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'black' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3fa2a5' }}
              className="bg-black text-white px-4 py-2 rounded mt-4 block mx-auto"
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