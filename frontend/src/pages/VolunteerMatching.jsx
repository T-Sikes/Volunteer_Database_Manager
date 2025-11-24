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
      const token = localStorage.getItem("token");
      if (!token) {
        notifyError("No token found — please log in.");
        return;
      }

      const authHeaders = {
        method: "GET",
        headers: { "Authorization": `Token ${token}` },
      };

      const [volRes, evRes, matchRes] = await Promise.all([
        fetch("http://localhost:8000/event/volunteers/", authHeaders),
        fetch("http://localhost:8000/event/", authHeaders),
        fetch("http://localhost:8000/event/matches/", authHeaders),
      ]);

      if (!volRes.ok || !evRes.ok || !matchRes.ok) {
        throw new Error("Backend request failed");
      }

      const [volData, evData, matchData] = await Promise.all([
        volRes.json(),
        evRes.json(),
        matchRes.json(),
      ]);
 
      const normalizedEvents = evData.map(e => ({
        name: e.event_name || "Unnamed Event",
        requiredSkills: Array.isArray(e.required_skills) ? e.required_skills : [],
        event_date: e.start_date || "",
        location: e.location || "",
        description: e.description || "",
        urgency: e.urgency || "low",
      }));

      const uniqueVolunteers = Array.from(
        new Map(volData.map(v => [(v.name || "").toLowerCase(), v])).values()
      );

      setVolunteers(uniqueVolunteers);
      setEvents(normalizedEvents);
      setMatches(Array.isArray(matchData) ? matchData : []);

    } catch (err) {
      console.error("Loading error:", err);
      notifyError(`Error loading data: ${err.message}`);
    }
  }

  fetchData();
}, []);

  const handleMatchSubmit = async (match) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Submitting match:", match);

      const response = await fetch("http://localhost:8000/event/match/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(match),
      });

      const savedMatch = await response.json();
      if (!response.ok) {
        notifyError(savedMatch.error || "Failed to submit match.");
        return;
      }

      let message = "";
      let isUpdate = false;
      
      setMatches(prev => {
        const idx = prev.findIndex(m => m.volunteerName.toLowerCase() === savedMatch.volunteerName.toLowerCase());
        const updated = [...prev];
        if (idx !== -1) {
          updated[idx] = savedMatch;
          isUpdate = true;
        } else {
          updated.push(savedMatch);
          isUpdate = false;
        }
        return updated;
      });

      if (isUpdate) {
        message = `Updated ${savedMatch.volunteerName}'s match to ${savedMatch.eventName}`;
      } else {
        message = `Matched ${savedMatch.volunteerName} to ${savedMatch.eventName}`;
      }

      notifySuccess(message);

    } catch (err) {
      console.error(err);
      notifyError("Error saving match to backend.");
    }
  };

  const handleRemove = async (index) => {
    const removedMatch = matches[index];
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`http://localhost:8000/event/match/${removedMatch.volunteerName}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        notifyError(error.error || "Failed to remove match from backend.");
        return;
      }
      
      setMatches(prev => prev.filter((_, i) => i !== index));
      notifyError(`Removed ${removedMatch.volunteerName} from matches.`);
    } catch (err) {
      console.error(err);
      notifyError("Error removing match from backend.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 overflow-auto">
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