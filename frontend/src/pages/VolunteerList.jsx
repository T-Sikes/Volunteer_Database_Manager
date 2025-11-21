import React, { useEffect, useState } from 'react';
import AxiosInstance from "../components/AxiosInstance"

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState({})

  // Show inforrmation for a specific volunteer
  const toggleInfo = id => {
    if(!showInfo) {
      const index = volunteers.findIndex(volunteer => volunteer.id == id)
      setSelectedVolunteer(volunteers[index])
    }
    setShowInfo(!showInfo)
  }

  useEffect(() => {
    fetchVolunteers()
  },[])

  const fetchVolunteers = async() => {
    try{
      const response = await AxiosInstance.get("event/volunteers/")
      const data = response.data
      setVolunteers(data)
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className="min-h-screen min-w-screen flex justify-center">

      {showInfo && 
        <div className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.5)] min-h-screen min-w-screen">
          <div className="flex justify-center items-center h-screen w-screen">
            <div className="flex flex-col bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg text-lg">
              <p> <span className="font-bold">Name:</span> {selectedVolunteer.full_name}</p>
              <p> <span className="font-bold">Employee ID:</span> {selectedVolunteer.id}</p>
              <p> <span className="font-bold">Location:</span> {selectedVolunteer.city} {selectedVolunteer.state}</p>
              <p> <span className="font-bold">Availibility:</span> {selectedVolunteer.availability}</p>
              <p> <span className="font-bold">Skills:</span> {selectedVolunteer.skills}</p>
              <p> <span className="font-bold">Preferences:</span> {selectedVolunteer.preferences}</p>
              <button onClick={() => setShowInfo(!showInfo)} className="!bg-white text-[#3fA2A5] border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white mt-2">Close</button>
            </div>
          </div>
        </div>
      }
      <div>
        <h2 className="text-2xl text-center">Volunteers</h2>
        <div className="w-2xl">
          {volunteers.map(volunteer => (
            <div 
              key={volunteer.id} 
              className="px-2 hover:bg-gray-200 transition-colors cursor-pointer" 
              onClick={() => toggleInfo(volunteer.id)}
            >
              <p className="text-lg">{volunteer.full_name} (ID: {volunteer.id})</p>
              <hr/>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default VolunteerList