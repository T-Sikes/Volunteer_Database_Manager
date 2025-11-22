import { useState, useEffect } from "react";
import VolunteerHistoryForm from "../components/VolunteerHistoryForm.jsx";
import AxiosInstance from "../components/AxiosInstance.jsx";

function VolunteerHistory() {
  const [showForm, setShowForm] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [events, setEvents] = useState([]); // For the form dropdown
  const [currentUsername, setCurrentUsername] = useState("");
  const [isSuperuser, setIsSuperuser] = useState(false);
  
   // Get current user first
  useEffect(() => {
    console.log("🔄 Getting current user for volunteer history...");
    AxiosInstance.get('user/current/')
      .then(response => {
        const username = response.data.username;
        const superuser = response.data.is_superuser || false; // check if superuser
        console.log("✅ Current user:", username);
        setCurrentUsername(username);
        setIsSuperuser(superuser);
      })
      .catch(err => {
        console.error("❌ Error getting current user:", err);
      });
  }, []);


// Pull existing volunteer history from backend
  useEffect(() => {
    if (!currentUsername) return; // Wait until we have username
    
    console.log("🔄 Fetching volunteer history for:", currentUsername);
    AxiosInstance.get(`user/history/${currentUsername}/`)
      .then(response => {
        console.log("✅ Volunteer history data:", response.data);
        setHistoryData(response.data);
      })
      .catch(err => {
        console.error("❌ Failed to fetch history:", err);
      });
  }, [currentUsername]);

 // Pull events from backend
  useEffect(() => {
    console.log("🔄 Fetching events...");
    AxiosInstance.get('user/events/')
      .then(response => {
        console.log("✅ Events data:", response.data);
        setEvents(response.data);
      })
      .catch(err => {
        console.error("❌ Events fetch failed:", err);
        console.warn("Using fallback events data");
        setEvents([
          { id: 1, name: "Community Cleanup", description: "Cleaning up litter", location: "Central Park", requiredSkills: ["Leadership"], urgency: "Medium", eventDate: "2025-09-25" },
          { id: 2, name: "Food Drive", description: "Distribute food packages", location: "Downtown Shelter", requiredSkills: ["Food prep"], urgency: "High", eventDate: "2025-10-01" },
          { id: 3, name: "Test Event", description: "Temporary test event", location: "Test Location", requiredSkills: ["Testing"], urgency: "Low", eventDate: "2025-10-20" },
        ]);
      });
  }, []);


  const submitRecord = (record) => {
    if (!currentUsername) {
      alert("Please wait while we load your user information");
      return;
    }

    console.log("📤 Saving volunteer record:", record);
    AxiosInstance.post(`user/history/${currentUsername}/save/`, record)
      .then(response => {
        console.log("✅ Save response:", response.data);
        
        // Backend returns the serialized record in data.data
        const newRecord = response.data.data;
        
        setHistoryData([...historyData, newRecord]);
        setShowForm(false);
      })
      .catch(err => {
        console.error("❌ Failed to save record:", err);
        console.error("Error details:", err.response?.data);
        alert("Failed to save record. Check console for details.");
      });
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
          </div>
        </div>
      )}
    </>
  );
}

export default VolunteerHistory;

