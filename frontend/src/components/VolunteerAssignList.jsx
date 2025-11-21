import React, { useEffect, useState } from 'react'
import AxiosInstance from './AxiosInstance'

const VolunteerAssignList = (props) => {
  const [volunteers, setVolunteers] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState({})
  const [eventID, setEventID] = useState(props.eventID)
  const [isAssignedMap, setIsAssignedMap] = useState({})

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

  const assignVolunteer = async (eventID, volunteerID) => {
    try{
      const response = await AxiosInstance.post("event/assign/", {event: eventID, user: volunteerID})
      setIsAssignedMap(prevState => { return {...prevState, [volunteerID]: true}})
      setSelectedVolunteer(null)
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className="flex flex-col bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg">
      <div>
        <h2 className="text-2xl text-center">Volunteers</h2>
        <div className="w-2xl">
          {volunteers.map(volunteer => (
            <div 
              key={volunteer.id} 
              className={`px-2 cursor-pointer ${selectedVolunteer == volunteer.user ? "bg-gray-200" : "hover:bg-gray-200 transition-colors"}`} 
              onClick={() => {
                if(selectedVolunteer == volunteer.user) 
                  setSelectedVolunteer(null)
                else
                  setSelectedVolunteer(volunteer.user)
              }}
            >
              <div className="flex justify-between">
                <p className="text-lg">{volunteer.full_name} (ID: {volunteer.id}) </p>
                {isAssignedMap[volunteer.user] && 
                  <p className="text-green-600"> Assigned </p>
                }
              </div>
              <hr/>
            </div>
            ))}
        </div>
      </div>
      <div className="flex w-full justify-around mt-5">
        <button 
          className="!bg-[#3fA2A5] text-white hover:!bg-[#203e3f]"
          onClick={() => assignVolunteer(eventID, selectedVolunteer)}
        >
          Assign
        </button>
        <button 
          className="!bg-white text-[#3fA2A5] border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white"
          onClick={() => props.closeVolunteerAssign()}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default VolunteerAssignList