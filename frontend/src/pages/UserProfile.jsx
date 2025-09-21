import { useState } from "react";
import UserProfileForm from "../components/UserProfileForm.jsx";

function UserProfile() {
  const [showForm, setShowForm] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const submitProfile = (data) => {
    setProfileData(data);
    setShowForm(false);  // hide form after submission
    console.log(data);
  }

  const toggleForm = () => setShowForm(!showForm);

  return (
  <>
    {showForm ? (
      <UserProfileForm submitProfile={submitProfile} closeForm={toggleForm} />
    ) : (
      <div className="flex justify-center items-center h-screen w-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Profile Saved!</h2>
        <div className="bg-gray-100 text-black p-4 rounded text-center">
          <p><strong>Full Name:</strong> {profileData.fullName}</p>
          <p><strong>Address 1:</strong> {profileData.address1}</p>
          {profileData.address2 && <p><strong>Address 2:</strong> {profileData.address2}</p>}
          <p><strong>City:</strong> {profileData.city}</p>
          <p><strong>State:</strong> {profileData.state}</p>
          <p><strong>Zip Code:</strong> {profileData.zip}</p>
          <p><strong>Skills:</strong> {profileData.skills.join(', ')}</p>
          {profileData.preferences && <p><strong>Preferences:</strong> {profileData.preferences}</p>}
          <p><strong>Availability:</strong> {profileData.availability.join(', ')}</p>
        </div>
        <button
          onClick={toggleForm}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 block mx-auto"
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