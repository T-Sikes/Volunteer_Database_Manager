import React, { useState, useEffect } from "react";
import { notifySuccess, notifyInfo, notifyError } from "../components/NotificationSystem.jsx";

export default function VolunteerMatchingForm({
  closeForm = () => {},
  submitMatch = (match) => console.log("Match submitted:", match),
  volunteers: parentVolunteers = [],
  events: parentEvents = [],
}) {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!selectedVolunteer || !parentEvents || parentEvents.length === 0) {
      setMatchedEvents([]);
      setSelectedEvent(null);
      return;
    }

    const volunteerSkills = selectedVolunteer.skills.map(s => String(s).toLowerCase().trim());

    const matches = parentEvents.filter(event => {
      if (!event.requiredSkills || !Array.isArray(event.requiredSkills)) return false;
      const eventSkills = event.requiredSkills.map(s => String(s).toLowerCase().trim());
      return eventSkills.some(skill => volunteerSkills.includes(skill));
    });

    setMatchedEvents(matches);
    setSelectedEvent(matches.length > 0 ? matches[0] : null);
  }, [selectedVolunteer, parentEvents]);

  const handleVolunteerChange = (e) => {
    const volunteerName = e.target.value;
    const volunteer = parentVolunteers.find(v => v.name === volunteerName);
    setSelectedVolunteer(volunteer || null);
  };

  const handleEventChange = (e) => {
    const eventName = e.target.value;
    const event = matchedEvents.find(ev => ev.name === eventName);
    setSelectedEvent(event || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVolunteer || !selectedEvent) {
      notifyError(!selectedVolunteer ? "Please select a volunteer." : "Please select an event.");
      return;
    }

    const matchData = {
      volunteerName: selectedVolunteer.name,
      volunteerSkills: selectedVolunteer.skills,
      eventName: selectedEvent.name,
      eventDate: selectedEvent.eventDate,
      location: selectedEvent.location,
    };

    try {
      const response = await fetch("/api/events/match/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) throw new Error("Backend match request failed");

      const data = await response.json();
      notifySuccess(`Match successful: ${data.volunteerName} → ${data.eventName}`);
      closeForm();
    } catch (error) {
      console.error("Match submission failed:", error);
      notifyError("Failed to match volunteer to event.");
    }
  };

  const handleCancel = () => {
    notifyInfo("Event update canceled.");
    closeForm();
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="flex-shrink-0 p-8 text-center bg-[#3fa2a5]">
        <h1 className="text-4xl font-bold text-white">Volunteer Matching</h1>
      </div>

      <div className="flex-1 p-8">
        <div className="bg-white border border-[#a5d9da] rounded-lg shadow-lg p-10 h-full flex flex-col">
          <div className="flex-1 space-y-6">
            <div>
              <label className="block mb-2 text-black font-medium">Volunteer Name</label>
              <select
                value={selectedVolunteer ? selectedVolunteer.name : ""}
                onChange={handleVolunteerChange}
                className="w-full border-2 rounded-lg border-[#a5d9da] p-3 text-black bg-white focus:border-[#3fa2a5] focus:outline-none"
              >
                <option value="">Select a volunteer</option>
                {parentVolunteers.map(volunteer => (
                  <option key={volunteer.name} value={volunteer.name}>
                    {volunteer.name}
                  </option>
                ))}
              </select>
              {!selectedVolunteer && <p className="text-red-500 text-sm mt-1">Please select a volunteer.</p>}
            </div>

            {selectedVolunteer && (
              <div className="p-4 bg-[#a5d9da] rounded-lg">
                <p className="text-sm text-black">
                  <strong>Skills:</strong> {selectedVolunteer.skills.join(", ")}
                </p>
              </div>
            )}

            <div>
              <label className="block mb-2 text-black font-medium">Matched Event</label>
              <select
                value={selectedEvent ? selectedEvent.name : ""}
                onChange={handleEventChange}
                disabled={!selectedVolunteer || matchedEvents.length === 0}
                className="w-full border-2 rounded-lg border-[#a5d9da] p-3 text-black bg-white focus:border-[#3fa2a5] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {!selectedVolunteer ? (
                  <option value="">Select a volunteer first</option>
                ) : matchedEvents.length > 0 ? (
                  <>
                    <option value="">Select an event</option>
                    {matchedEvents.map(event => (
                      <option key={event.name} value={event.name}>
                        {event.name} - {event.eventDate} ({event.location})
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No matching events found</option>
                )}
              </select>
            </div>

            {selectedEvent && (
              <div className="p-4 bg-[#a5d9da] rounded-lg">
                <p className="text-sm text-black"><strong>Event:</strong> {selectedEvent.name}</p>
                <p className="text-sm text-black"><strong>Date:</strong> {selectedEvent.eventDate}</p>
                <p className="text-sm text-black"><strong>Location:</strong> {selectedEvent.location}</p>
                <p className="text-sm text-black"><strong>Required Skills:</strong> {selectedEvent.requiredSkills.join(", ")}</p>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex justify-end gap-4 mt-8 pt-6 border-t border-[#a5d9da]">
            <button
              type="button"
              onClick={() => selectedVolunteer && submitMatch({ volunteerName: selectedVolunteer.name })}
              className={`py-3 px-6 rounded-lg font-medium transition duration-200 ${selectedVolunteer ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
            >
              Auto-Match Volunteer
            </button>

            <button
              type="button"
              onClick={() => {
                if (!selectedVolunteer || !selectedEvent) {
                  notifyError(!selectedVolunteer ? "Please select a volunteer." : "Please select an event.");
                  return;
                }
                submitMatch({
                  volunteerName: selectedVolunteer.name,
                  volunteerSkills: selectedVolunteer.skills,
                  eventName: selectedEvent.name,
                  eventDate: selectedEvent.eventDate,
                  location: selectedEvent.location,
                });
                closeForm();
              }}
              className={`py-3 px-6 rounded-lg font-medium transition duration-200 ${selectedVolunteer && selectedEvent ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
            >
              Manual Match
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}