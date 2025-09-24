import React, { useState, useEffect } from "react";

// Mock notification functions since we don't have the actual service
const notifySuccess = (message) => console.log("Success:", message);
const notifyError = (message) => console.log("Error:", message);

export default function VolunteerMatchingForm({
  closeForm = () => {},
  submitMatch = (match) => console.log("Match submitted:", match),
  volunteers: parentVolunteers = [],
  events: parentEvents = [],
}) {
  // Hardcoded demo volunteers
  const hardcodedVolunteers = [
    { name: "John Doe", skills: ["First Aid", "Bilingual/Multilingual"] },
    { name: "Eladio Carrion", skills: ["Singer", "Bilingual/Multilingual"] },
    { name: "Jane Smith", skills: ["Event Planning", "Public Speaking"] },
    { name: "Alice Martin", skills: ["Teaching", "Mentoring"] },
  ];

  // Hardcoded demo events
  const hardcodedEvents = [
    {
      name: "Community Cleanup",
      eventDate: "2025-12-25",
      location: "Herman Park",
      requiredSkills: ["First Aid"],
    },
    {
      name: "Concert Fundraiser",
      eventDate: "2025-12-21",
      location: "Houston Food Bank",
      requiredSkills: ["Singer"],
    },
    {
      name: "Charity Run",
      eventDate: "2025-11-15",
      location: "Camp Nou",
      requiredSkills: ["Event Planning"],
    },
    {
      name: "After-School Tutoring",
      eventDate: "2025-10-10",
      location: "UH Main Campus",
      requiredSkills: ["Teaching"],
    },
  ];

  const [volunteers, setVolunteers] = useState([
    ...hardcodedVolunteers,
    ...parentVolunteers,
  ]);
  const [events, setEvents] = useState([...hardcodedEvents, ...parentEvents]);

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [matchedEvents, setMatchedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const dbVolunteers = [
          { name: "Michael Jordan", skills: ["Public Speaking", "Mentoring"] },
          {
            name: "Maria Gonzalez",
            skills: ["Bilingual/Multilingual", "Teaching"],
          },
        ];
        const dbEvents = [
          {
            name: "Basketball Camp",
            eventDate: "2025-08-01",
            location: "Chicago Stadium",
            requiredSkills: ["Mentoring"],
          },
          {
            name: "Community Spanish Class",
            eventDate: "2025-09-15",
            location: "Houston Library",
            requiredSkills: ["Teaching"],
          },
        ];

        setVolunteers([
          ...hardcodedVolunteers,
          ...parentVolunteers,
          ...dbVolunteers,
        ]);
        setEvents([...hardcodedEvents, ...parentEvents, ...dbEvents]);
      } catch (err) {
        console.error("Failed to fetch volunteers/events:", err);
      }
    }

    fetchData();
  }, [parentVolunteers, parentEvents]);

  const handleVolunteerChange = (e) => {
    const volunteerName = e.target.value;
    const volunteer = volunteers.find((v) => v.name === volunteerName);
    setSelectedVolunteer(volunteer);

    if (volunteer) {
      const matches = events.filter((event) =>
        event.requiredSkills.some((skill) => volunteer.skills.includes(skill))
      );
      setMatchedEvents(matches);
      setSelectedEvent(matches.length > 0 ? matches[0] : null);
    } else {
      setMatchedEvents([]);
      setSelectedEvent(null);
    }
  };

  const handleEventChange = (e) => {
    const eventName = e.target.value;
    const event = matchedEvents.find((ev) => ev.name === eventName);
    setSelectedEvent(event || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedVolunteer || !selectedEvent) {
      notifyError("Please select both a volunteer and an event before submitting.");
      return;
    }

    const match = {
      volunteerName: selectedVolunteer.name,
      volunteerSkills: selectedVolunteer.skills,
      eventName: selectedEvent.name,
      eventDate: selectedEvent.eventDate,
      location: selectedEvent.location,
    };

    submitMatch(match);
    notifySuccess(`Matched ${selectedVolunteer.name} to ${selectedEvent.name}`);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Page Header */}
      <div className="flex-shrink-0 p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Volunteer Matching
        </h1>
      </div>

      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-10 h-full flex flex-col">
          {/* Form Content */}
          <div className="flex-1 space-y-6">
            {/* Volunteer Dropdown */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Volunteer Name
              </label>
              <select
                value={selectedVolunteer ? selectedVolunteer.name : ""}
                onChange={handleVolunteerChange}
                className="w-full border-2 rounded-lg border-gray-300 p-3 text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a volunteer</option>
                {volunteers.map((volunteer) => (
                  <option key={volunteer.name} value={volunteer.name}>
                    {volunteer.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedVolunteer && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Skills:</strong> {selectedVolunteer.skills.join(", ")}
                </p>
              </div>
            )}

            {/* Event Dropdown */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Matched Event
              </label>
              <select
                value={selectedEvent ? selectedEvent.name : ""}
                onChange={handleEventChange}
                disabled={!selectedVolunteer}
                className="w-full border-2 rounded-lg border-gray-300 p-3 text-gray-900 bg-white focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {!selectedVolunteer ? (
                  <option value="">Select a volunteer first</option>
                ) : matchedEvents.length > 0 ? (
                  <>
                    <option value="">Select an event</option>
                    {matchedEvents.map((event) => (
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
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Event:</strong> {selectedEvent.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Date:</strong> {selectedEvent.eventDate}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Required Skills:</strong>{" "}
                  {selectedEvent.requiredSkills.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Buttons - Fixed at bottom */}
          <div className="flex-shrink-0 flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!selectedVolunteer || !selectedEvent}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              Match Volunteer
            </button>
            <button
              type="button"
              onClick={closeForm}
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