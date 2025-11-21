import React, { useEffect, useState } from 'react'
import AxiosInstance from './AxiosInstance'

const VolunteerAssignList = (props) => {
  const [volunteers, setVolunteers] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState({})
  const [eventID, setEventID] = useState(props.eventID)
  const [isAssignedMap, setIsAssignedMap] = useState({})
  const [volunteersForEvent, setVolunteersForEvent] = useState([])

  useEffect(() => {
    fetchVolunteers()
    fetchVolunteersForEvent(eventID)
  },[])

  // Fetch all volunteers
  const fetchVolunteers = async() => {
    try{
      const response = await AxiosInstance.get("event/volunteers/")
      const data = response.data
      setVolunteers(data)
    } catch (err) {
      console.log(err)
    }
  }

  // Fetch volunteers assigned to this event
  const fetchVolunteersForEvent = async(event_id) => {
    try{
      const response = await AxiosInstance.get(`event/${event_id}/volunteers/`)
      const data = response.data
      const ids = data.map(x => x.user_profile_details.id)
      const mp = {}
      ids.forEach((id) => {
        mp[id] = true
      })
      setIsAssignedMap(mp)
    } catch (err) {
      console.log(err)
    }
  }

  const assignVolunteer = async (eventID, sv) => {
    console.log(sv)
    try{
      const response = await AxiosInstance.post("event/assign/", {event: eventID, user: sv.user, user_profile: sv.user_profile})
      setIsAssignedMap(prevState => { return {...prevState, [sv.user_profile]: true}})
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
              className={`px-2 cursor-pointer ${!selectedVolunteer ? "hover:bg-gray-200 transition-colors" : (selectedVolunteer.user_profile == volunteer.id ? "bg-gray-200" : "hover:bg-gray-200 transition-colors")}`} 
              onClick={() => {
                if(selectedVolunteer){
                  if(selectedVolunteer.user_profile == volunteer.id){ 
                    setSelectedVolunteer(null)
                    return
                  }
                }
                setSelectedVolunteer({user: volunteer.user, user_profile: volunteer.id})
              }}
            >
              <div className="flex justify-between text-lg">
                <div>
                  <p>{volunteer.full_name} (ID: {volunteer.id}) </p>
                  <p><span className="font-medium">Skills:</span> {volunteer.skills}</p>
                  <p><span className="font-medium">Location:</span> {volunteer.city}, {volunteer.state}</p>
                </div>
                {(isAssignedMap[volunteer.id] ?? false) && 
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