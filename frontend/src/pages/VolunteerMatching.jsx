import React, { useState, useEffect } from "react";
import VolunteerMatchingForm from "../components/VolunteerMatchingForm.jsx";
import { notifyError, notifySuccess, notifyInfo } from "../components/NotificationSystem.jsx";

export default function VolunteerMatching() {
  const [matches, setMatches] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [volRes, evRes, matchRes] = await Promise.all([
          fetch("http://localhost:8000/api/events/volunteers/"),
          fetch("http://localhost:8000/api/events/"),
          fetch("http://localhost:8000/api/events/matches/")
        ]);

        if (!volRes.ok || !evRes.ok || !matchRes.ok) throw new Error("Failed to fetch backend data");

        const [volData, evData, matchData] = await Promise.all([
          volRes.json(), evRes.json(), matchRes.json()
        ]);

        const uniqueVolunteers = Array.from(new Map(volData.map(v => [v.name.toLowerCase(), v])).values());

        setVolunteers(uniqueVolunteers);
        setEvents(evData);
        setMatches(Array.isArray(matchData) ? matchData : []);
      } catch (err) {
        console.error(err);
        notifyError("Failed to load volunteers, events, or matches.");
      }
    }

    fetchData();
  }, []);

  const handleMatchSubmit = async (match) => {
    try {
      // POST to backend
      const response = await fetch("http://localhost:8000/api/events/match/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(match),
      });

      const savedMatch = await response.json();
      if (!response.ok) {
        notifyError(savedMatch.error || "Failed to submit match.");
        return;
      }

      // Update state
      let message = "";
      setMatches(prev => {
        const idx = prev.findIndex(m => m.volunteerName.toLowerCase() === savedMatch.volunteerName.toLowerCase());
        const updated = [...prev];
        if (idx !== -1) {
          updated[idx] = savedMatch;
          message = `Updated ${savedMatch.volunteerName}'s match to ${savedMatch.eventName}`;
        } else {
          updated.push(savedMatch);
          message = `Matched ${savedMatch.volunteerName} to ${savedMatch.eventName}`;
        }
        return updated;
      });

      // Notify **after state update**
      notifySuccess(message);

    } catch (err) {
      console.error(err);
      notifyError("Error saving match to backend.");
    }
  };

  const handleRemove = (index) => {
    setMatches(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
    notifyInfo("Volunteer removed from list.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      <VolunteerMatchingForm
        submitMatch={handleMatchSubmit}
        volunteers={volunteers}
        events={events}
      />

      {matches.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Matched Volunteers</h2>
          <ul className="space-y-3">
            {matches.map((m, idx) => (
              <li key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2 text-gray-800">
                <span>
                  <strong>{m.volunteerName}</strong> → {m.eventName} ({m.eventDate}, {m.location}) {m.matchType === "manual" ? "🧩 (manual)" : "⚙️ (auto)"}
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