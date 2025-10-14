import { useState, useEffect } from "react";
import VolunteerHistoryForm from "../components/VolunteerHistoryForm.jsx";
import EventManagement from "./EventManagement.jsx"; //  pull events dynamically

function VolunteerHistory() {
  const [showForm, setShowForm] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [events, setEvents] = useState([]); // For the form dropdown
  const API_BASE = "http://127.0.0.1:8000/user";



// Pull existing volunteer history from backend
  useEffect(() => {
    fetch(`${API_BASE}/history/`)
      .then(res => res.json())
      .then(data => setHistoryData(data))
      .catch(err => console.error("Failed to fetch history:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/events/`) // 
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => {
        console.warn("Events fetch failed, using sample events");
        setEvents([
          { name: "Community Cleanup", description: "Cleaning up litter", location: "Central Park", requiredSkills: ["Leadership"], urgency: "Medium", eventDate: "2025-09-25" },
          { name: "Food Drive", description: "Distribute food packages", location: "Downtown Shelter", requiredSkills: ["Food prep"], urgency: "High", eventDate: "2025-10-01" },
          { name: "Test Event", description: "Temporary test event", location: "Test Location", requiredSkills: ["Testing"], urgency: "Low", eventDate: "2025-10-20" },
        ]);
      });
  }, []);


  const submitRecord = (record) => {
    fetch(`${API_BASE}/history/save/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    })
      .then(res => res.json())
      .then(data => {
        // Append saved record to the frontend state
        setHistoryData([...historyData, data.data]);
        setShowForm(false);
      })
      .catch(err => console.error("Failed to save record:", err));
  };


  const toggleForm = () => setShowForm(!showForm);

  return (
    <>
      {showForm ? (
        <div className="flex justify-center items-start min-h-screen w-screen bg-gray py-10">
          <VolunteerHistoryForm 
            submitRecord={submitRecord} 
            closeForm={toggleForm} 
            events={events} 
          />
        </div>
      ) : (
        <div className="flex justify-center items-start min-h-screen w-screen bg-gray-50 py-10">
          <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Volunteer History</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border text-black">Event Name</th>
                    <th className="py-2 px-4 border text-black">Description</th>
                    <th className="py-2 px-4 border text-black">Location</th>
                    <th className="py-2 px-4 border text-black">Required Skills</th>
                    <th className="py-2 px-4 border text-black">Urgency</th>
                    <th className="py-2 px-4 border text-black">Event Date</th>
                    <th className="py-2 px-4 border text-black">Hours</th>
                    <th className="py-2 px-4 border text-black">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((record, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border text-black">{record.eventName}</td>
                      <td className="py-2 px-4 border text-black">{record.description}</td>
                      <td className="py-2 px-4 border text-black">{record.location}</td>
                      <td className="py-2 px-4 border text-black">{record.requiredSkills.join(", ")}</td>
                      <td className="py-2 px-4 border text-black">{record.urgency}</td>
                      <td className="py-2 px-4 border text-black">{record.eventDate}</td>
                      <td className="py-2 px-4 border text-black">{record.hours}</td>
                      <td  className={`py-2 px-4 border text-black rounded ${
                        record.status === "Completed" ? "bg-green-500" :
                        record.status === "Pending" ? "bg-yellow-400" :
                        record.status === "Cancelled" ? "bg-red-500" :
                        "bg-gray-300"
                        }`}>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={toggleForm}
              style = {{backgroundColor: '#3fa2a5'}}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'black' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3fa2a5' }}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl mt-4 block mx-auto"
            >
              Add Another Record
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default VolunteerHistory;

