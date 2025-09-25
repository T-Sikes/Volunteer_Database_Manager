import {useState,} from "react";

function VolunteerHistoryForm({ submitRecord, closeForm, events = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hours, setHours] = useState('');
  const [status, setStatus] = useState('');

  const allStatuses = ["Completed", "Pending", "Cancelled"];

  const handleSubmit = (e) => {
    e. preventDefault(); 

    //validations
    if (!selectedEvent) return alert("Select an event");
    if (!hours || isNaN(hours)) return alert("Hours must be a number");
    if (!status) return alert("Status is required");


    submitRecord({
      eventName: selectedEvent.name,
      description: selectedEvent.description || "",
      location: selectedEvent.location || "",
      requiredSkills: selectedEvent.requiredSkills || [],
      urgency: selectedEvent.urgency || "",
      eventDate: selectedEvent.eventDate || "",
      hours: Number(hours),
      status,
    });

    //reset form
    setSelectedEvent(null);
    setHours("");
    setStatus("");
  };

  return (
    <form className="bg-white p-6 rounded-xl shadow-md w-96 flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Add Volunteer Record</h2>

      {/* Event dropdown */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Event*</label>
        <select
          value={selectedEvent ? selectedEvent.name : ''}
          onChange={e => {
            const event = events.find(ev => ev.name === e.target.value);
            setSelectedEvent(event || null);
          }}
          className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
        >
          <option value="">Select an event</option>
          {events.map(ev => (
            <option key={ev.name} value={ev.name}>{ev.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Hours*</label>
        <input
          type="number"
          value={hours}
          onChange={e => setHours(e.target.value)}
          min={0}
          className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Status*</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white "
        >
          <option value="">Select status</option>
          {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={handleSubmit} 
        style={{ backgroundColor: '#3fa2a5', color: 'white' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'black' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3fa2a5' }}
        className="bg-blue-500 text-white px-4 py-2 rounded w-1/2 mr-2">
        Save
        </button>
        <button onClick={closeForm} 
        style={{ backgroundColor: '#3fa2a5', color: 'white' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'black' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3fa2a5' }}
        className="bg-black px-4 py-2 rounded w-1/2 ml-2">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default VolunteerHistoryForm;