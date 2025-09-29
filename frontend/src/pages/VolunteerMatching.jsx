import React, { useState } from "react";
import VolunteerMatchingForm from "../components/VolunteerMatchingForm.jsx";
import { notifySuccess, notifyInfo } from "../components/NotificationSystem.jsx";

export default function VolunteerMatching() {
  const [matches, setMatches] = useState([]);

  const handleMatchSubmit = (match) => {
    setMatches((prev) => [...prev, match]);
    notifySuccess(`Matched ${match.volunteerName} to ${match.eventName}`);
  };

  const handleRemove = (index) => {
    const updated = matches.filter((_, i) => i !== index);
    setMatches(updated);
    notifyInfo("Volunteer removed from list.");
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">

      {/* Volunteer matching form */}
      <VolunteerMatchingForm submitMatch={handleMatchSubmit} />

      {/* Matched results */}
      {matches.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Matched Volunteers
          </h2>
          <ul className="space-y-3">
            {matches.map((m, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-gray-200 pb-2 text-gray-800"
              >
                <span>
                  <strong>{m.volunteerName}</strong> → {m.eventName} (
                  {m.eventDate}, {m.location})
                </span>
                <button
                  onClick={() => handleRemove(idx)}
                  className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}