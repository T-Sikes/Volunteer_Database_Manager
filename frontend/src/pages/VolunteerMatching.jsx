import React, { useState } from "react";
import VolunteerMatchingForm from "../components/VolunteerMatchingForm.jsx";
import { notifySuccess } from "../components/NotificationSystem.jsx";

export default function VolunteerMatching() {
  const [matches, setMatches] = useState([]);

  const handleMatchSubmit = (match) => {
    setMatches((prev) => [...prev, match]);

    notifySuccess(`Matched ${match.volunteerName} to ${match.eventName}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Volunteer Matching
      </h1>

      {/* Volunteer matching form */}
      <VolunteerMatchingForm
        submitMatch={handleMatchSubmit}
      />

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
                className="border-b border-gray-200 pb-2 text-gray-800"
              >
                <strong>{m.volunteerName}</strong> → {m.eventName} (
                {m.eventDate}, {m.location})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
