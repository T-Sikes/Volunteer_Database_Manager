import React, { useEffect, useState } from 'react';
import AxiosInstance from "../components/AxiosInstance"
import { parse, format } from 'date-fns';
import VolunteerHistory from './VolunteerHistory';

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState({})
  const [showVolunteerHistory, setShowVolunteerHistory] = useState(false)
  const [showVolunteerList, setShowVolunteerList] = useState(true)

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

  // Format availability JSON to readable format
  const formatAvailability = (availabilityJson) => {
    const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    
    return daysOrder.map(day => {
      const dayData = availabilityJson[day]
      const dayName = day.charAt(0).toUpperCase() + day.slice(1)
      
      if (!dayData.available) {
        return `${dayName}: Not available`
      }
      
      // Parse 24-hour time and convert to 12-hour format with AM/PM
      const startTime = format(parse(dayData.start, 'HH:mm', new Date()), 'h:mm a')
      const endTime = format(parse(dayData.end, 'HH:mm', new Date()), 'h:mm a')
      
      return `${dayName}: ${startTime} - ${endTime}`
    }).join('\n')
  }

  return (
    <div className="min-h-screen min-w-screen flex justify-center">
      {showVolunteerHistory &&
        <div>
          <div className="flex justify-center">
          <button
            className='!bg-white text-[#3fA2A5] border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white'
            onClick={() => {
              setShowVolunteerHistory(false)
              setShowVolunteerList(true)
            }}
          >
          Back
          </button> 
          </div>
          <VolunteerHistory
            user={selectedVolunteer.user}
          />
        </div>
      }

      {showInfo && 
        <div className="flex justify-center items-start py-10 fixed inset-0 z-10 bg-[rgba(0,0,0,0.5)] overflow-y-auto">
            <div className="flex flex-col bg-white border-gray-500 border-2 h-fit w-1/3 p-10 rounded-lg text-lg">
              <p> <span className="font-bold">Name:</span> {selectedVolunteer.full_name}</p>
              <p> <span className="font-bold">ID:</span> {selectedVolunteer.id}</p>
              <p> <span className="font-bold">Location:</span> {selectedVolunteer.city}, {selectedVolunteer.state}</p>
              <div>
                <span className="font-bold">Availability:</span>
                <pre className="whitespace-pre-wrap mt-1 ml-5 font-sans">
                  {selectedVolunteer.availability_json && formatAvailability(selectedVolunteer.availability_json)}
                </pre>
              </div>
              <p> <span className="font-bold">Skills:</span> {selectedVolunteer.skills}</p>
              <p> <span className="font-bold">Preferences:</span> {selectedVolunteer.preferences}</p>
              <div className="flex justify-around mt-2">
                <button 
                  onClick={() => {
                    setShowVolunteerList(false)
                    setShowVolunteerHistory(true)
                    setShowInfo(!showInfo)
                  }} 
                  className="!bg-[#3fA2A5] hover:!bg-[#203e3f] text-white"
                >
                  Volunteer History
                </button>
                <button 
                  onClick={() => {
                    setShowInfo(!showInfo)
                  }} 
                  className="!bg-white text-[#3fA2A5] border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white"
                >
                  Close
                </button>
              </div>
            </div>
        </div>
      }
      {showVolunteerList &&
        <div>
          <h2 className="text-2xl text-center">Volunteers</h2>
          <div className="w-2xl">
            {volunteers.map(volunteer => (
              <div 
                key={volunteer.id} 
                className="px-2 hover:bg-gray-200 transition-colors cursor-pointer" 
                onClick={() => {
                  toggleInfo(volunteer.id)
                }}
              >
                <p className="text-lg">{volunteer.full_name} (ID: {volunteer.id})</p>
                <hr/>
              </div>
              ))}
          </div>
        </div>
      }
    </div>
  )
}

export default VolunteerList