import { useState, useEffect } from "react";
import VolunteerMatchingForm from "../components/VolunteerMatchingForm.jsx";
import EventManagement from "./EventManagement.jsx"; //  eventually pull events dynamically

function VolunteerMatching({ volunteer = [], events = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [matches, setMatches] = useState([]);
  
  //hardcoded example for now
  useEffect(() => {
    const sampleData = [
      {
        volunteerName: "John Doe",
        volunteerSkills: ["First Aid", "Bilingual/Multilingual"],
        eventName: "Community Cleanup",
        eventDate: "2025-12-25",
        location: "Herman Park",
      },
      {
        volunteerName: "Eladio Carrion",
        volunteerSkills: ["Singer", "Bilingual/Multilingual"],
        eventName: "Concert Fundraiser",
        eventDate: "2025-12-21",
        location: "Houston Food Bank",
      },
      {
        volunteerName: "Jane Smith",
        volunteerSkills: ["Event Planning", "Public Speaking"],
        eventName: "Charity Run",
        eventDate: "2025-11-15",
        location: "Camp Nou",
      },
      {
        volunteerName: "Alice Martin",
        volunteerSkills: ["Teaching", "Mentoring"],
        eventName: "After-School Tutoring",
        eventDate: "2025-10-10",
        location: "UH Main Campus",
      }
    ];
    setMatches(sampleMatches);
  }, []);

  const submitMatch = (match) => {
    setMatches([...matches, match]);
    setShowForm(false);
  };

  const toggleForm = () => setShowForm(!showForm);

  return (
    <>
      {showForm ? (
        <div className="flex justify-center items-start min-h-screen w-screen bg-gray-50 py-10">
          <VolunteerHistoryForm 
            volunteer={volunteer}
            closeForm={toggleForm} 
            events={events}
            submitMatch={submitMatch}
          />
        </div>
      ) : (
        <div className="flex justify-center items-start min-h-screen w-screen bg-gray-50 py-10">
          <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Volunteer Matching</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b text-black">Volunteer Name</th>
                    <th className="py-2 px-4 border-b text-black">Volunteer Skills</th>
                    <th className="py-2 px-4 border-b text-black">Matched Events</th>
                    <th className="py-2 px-4 border-b text-black">Event Date</th>
                    <th className="py-2 px-4 border-b text-black">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border-b text-black">{match.volunteerName}</td>
                      <td className="py-2 px-4 border-b text-black">{match.volunteerSkills.join(", ")}</td>
                      <td className="py-2 px-4 border-b text-black">{match.eventName}</td>
                      <td className="py-2 px-4 border-b text-black">{match.eventDate}</td>
                      <td className="py-2 px-4 border-b text-black">{match.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={toggleForm}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 block mx-auto"
            >
              Match Volunteer to Event
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default VolunteerMatching;
