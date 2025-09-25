import { useState, useEffect } from "react";
import VolunteerHistoryForm from "../components/VolunteerHistoryForm.jsx";
import EventManagement from "./EventManagement.jsx"; //  pull events dynamically

function VolunteerHistory({ events = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [historyData, setHistoryData] = useState([]);


//hardcoded example for now
//will properly pull from eventManagement.jsx when backend is implemented using API FETCH calls
useEffect(() => {
    const sampleData = [
      {
        eventName: "Community Cleanup",
        eventDate: "2025-09-25",
        location: "Central Park",
        description: "Cleaning up litter and debris.",
        requiredSkills: ["Leadership", "Bilingual/Multilingual"],
        urgency: "Medium",
        hours: 4,
        status: "Completed",
      },
      {
        eventName: "Food Drive",
        eventDate: "2025-10-01",
        location: "Downtown Shelter",
        description: "Distribute food packages to families in need.",
        requiredSkills: ["Food prep", "Retail experience"],
        urgency: "High",
        hours: 3,
        status: "Pending",
      },
    ];
    setHistoryData(sampleData);
  }, []);


  const submitRecord = (record) => {
    setHistoryData([...historyData, record]);
    setShowForm(false);
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

