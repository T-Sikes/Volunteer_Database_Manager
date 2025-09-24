import { useState } from "react";
import VolunteerMatchingForm from "../components/VolunteerMatchingForm.jsx";

function VolunteerMatching() {
  const [showForm, setShowForm] = useState(false);

  const [volunteers] = useState([
    { name: "John Doe", skills: ["First Aid", "Bilingual/Multilingual"] },
    { name: "Eladio Carrion", skills: ["Singer", "Bilingual/Multilingual"] },
    { name: "Jane Smith", skills: ["Event Planning", "Public Speaking"] },
    { name: "Alice Martin", skills: ["Teaching", "Mentoring"] },
  ]);

  const [events] = useState([
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
  ]);

  const [matches, setMatches] = useState([
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
  ]);

  const submitMatch = (match) => {
    setMatches((prev) => [...prev, match]);
    setShowForm(false);
  };

  const toggleForm = () => setShowForm(!showForm);

  return (
    <>
      {showForm ? (
        <VolunteerMatchingForm
          volunteers={volunteers}
          events={events}
          closeForm={toggleForm}
          submitMatch={submitMatch}
        />
      ) : (
        <div className="flex justify-center items-start min-h-screen w-screen bg-gray-50 py-10">
          <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Volunteer Matching
            </h1>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 border-b text-black">
                      Volunteer Name
                    </th>
                    <th className="py-2 px-4 border-b text-black">
                      Volunteer Skills
                    </th>
                    <th className="py-2 px-4 border-b text-black">
                      Matched Event
                    </th>
                    <th className="py-2 px-4 border-b text-black">
                      Event Date
                    </th>
                    <th className="py-2 px-4 border-b text-black">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border-b text-black">
                        {match.volunteerName}
                      </td>
                      <td className="py-2 px-4 border-b text-black">
                        {match.volunteerSkills.join(", ")}
                      </td>
                      <td className="py-2 px-4 border-b text-black">
                        {match.eventName}
                      </td>
                      <td className="py-2 px-4 border-b text-black">
                        {match.eventDate}
                      </td>
                      <td className="py-2 px-4 border-b text-black">
                        {match.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={toggleForm}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4 block mx-auto hover:bg-blue-700 transition"
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