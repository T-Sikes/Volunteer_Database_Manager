import {useState,} from "react";

function VolunteerMatchingForm({ volunteer = [], events = [], submitMatch, closeForm }) {
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [matchedEvent, setMatchedEvent] = useState(null);

  const getMatchedEvents = (volunteer) => { 
    if (!volunteer) return [];
    return events.filter(event => 
      event.requiredSkills.some(skill => volunteer.skills.includes(skill))
    );
  }
  const handleVolunteerChange = (e) => {
    const vol = volunteer.find(v => v.name === e.target.value);
    setSelectedVolunteer(vol || null);
    setMatchedEvent(getMatchedEvents(volunteer));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVolunteer) return alert("Please select a volunteer"); 
    if (!matchedEvent) return alert("No matched event found for this volunteer");
    submitMatch({
      volunteerName: selectedVolunteer.name,
      volunteerSkills: selectedVolunteer.skills || [],
      eventName: matchedEvent.name,
      eventDate: matchedEvent.eventDate || "",
      location: matchedEvent.location || "",
    });
    setSelectedVolunteer(null);
    setMatchedEvent(null);
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md w-96 flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Volunteer Matching Form</h2>

      {/* Volunteer dropdown */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Volunteer*</label>
        <select
          value={selectedVolunteer ? selectedVolunteer.name : ''}
          onChange={handleVolunteerChange}
          className="border-2 rounded-lg border-gray-500 p-2 text-gray-900 bg-white"
        >
          <option value="">Select a volunteer</option>
          {volunteers.map(v => (
            <option key={v.name} value={v.name}>{v.name}</option>
          ))}
        </select>
      </div>

      {/*Auto-filled match event */}
      {matchedEvent && (
        <div className="p-3 border rounded bg-gray-50">
          <p><strong>Matched Events:</strong>{matchedEvent.name}</p>
          <p><strong>Date:</strong> {matchedEvent.eventDate}</p>
          <p><strong>Location:</strong> {matchedEvent.location}</p>
          <p><strong>Required Skills:</strong> {matchedEvent.requiredSkills.join(", ")}</p>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <label className="mb-1 font-medium text-gray-700">Hours*</label>
        <input
          type="number"
          value={hours}
          onChange={e => setHours(e.target.value)}
          min={0}
          className="border-2 rounded-lg border-gray-500 p-2 text-gray-900 bg-white"
        />
      </div>

      <div className="flex flex-col">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Match
        </button>
        <button
          onClick={closeForm}
          className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default VolunteerMatchingForm;