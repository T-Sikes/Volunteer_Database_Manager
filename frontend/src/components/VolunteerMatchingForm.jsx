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
    const volunteer = parentVolunteers.find(v => v.name === e.target.value);
    setSelectedVolunteer(volunteer || null);
  };

  const handleEventChange = (e) => {
    const event = matchedEvents.find(ev => ev.name === e.target.value);
    setSelectedEvent(event || null);
  };

  const handleAutoMatch = () => {
    if (!selectedVolunteer) {
      setTimeout(() => notifyError("Please select a volunteer."), 0);
      return;
    }

    submitMatch({ volunteerName: selectedVolunteer.name });
    closeForm();
  };

  const handleManualMatch = () => {
    if (!selectedVolunteer || !selectedEvent) {
      setTimeout(() => notifyError(!selectedVolunteer ? "Please select a volunteer." : "Please select an event."), 0);
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
  };

  const handleCancel = () => {
    setTimeout(() => notifyInfo("Event update canceled."), 0);
    closeForm();
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-[#a5d9da] rounded-lg shadow-lg p-10">
      <h1 className="text-3xl font-bold text-center text-[#3fa2a5] mb-6">Volunteer Matching</h1>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-black font-medium">Volunteer Name</label>
          <select
            value={selectedVolunteer ? selectedVolunteer.name : ""}
            onChange={handleVolunteerChange}
            className="w-full border-2 rounded-lg border-[#a5d9da] p-3 text-black bg-white focus:border-[#3fa2a5] focus:outline-none"
          >
            <option value="">Select a volunteer</option>
            {parentVolunteers.map(v => (
              <option key={v.name} value={v.name}>{v.name}</option>
            ))}
          </select>
        </div>

        {selectedVolunteer && (
          <div className="p-4 bg-[#a5d9da] rounded-lg">
            <p className="text-sm text-black"><strong>Skills:</strong> {selectedVolunteer.skills.join(", ")}</p>
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
            <option value="">
              {!selectedVolunteer ? "Select a volunteer first" : matchedEvents.length === 0 ? "No matching events found" : "Select an event"}
            </option>
            {matchedEvents.map(event => (
              <option key={event.name} value={event.name}>
                {event.name} - {event.eventDate} ({event.location})
              </option>
            ))}
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

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#a5d9da]">
        <button
          type="button"
          onClick={handleAutoMatch}
          className={`py-3 px-6 rounded-lg font-medium transition duration-200 ${selectedVolunteer ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
        >
          Auto-Match Volunteer
        </button>

        <button
          type="button"
          onClick={handleManualMatch}
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
  );
}