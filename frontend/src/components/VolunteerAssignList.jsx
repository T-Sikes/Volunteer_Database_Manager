import React, { useEffect, useState } from 'react'
import { format } from "date-fns"
import AxiosInstance from './AxiosInstance'

const VolunteerAssignList = (props) => {
  const [volunteers, setVolunteers] = useState([])
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [eventID, setEventID] = useState(props.eventID)
  const [isAssignedMap, setIsAssignedMap] = useState({})
  const [assignOrUnsassign, setAssignOrUnassign] = useState("")
  const [eventStartDate, setEventStartDate] = useState(null)
  const [eventEndDate, setEventEndDate] = useState(null)
  const [isAvailableMap, setIsAvailableMap] = useState({})

  useEffect(() => {
    fetchVolunteers()
    fetchVolunteersForEvent(eventID)
  },[])

  useEffect(() => {
    changeButton()
  },[selectedVolunteer])

  useEffect(() => {
    if(volunteers.length > 0 && eventStartDate && eventEndDate) {
      volunteers.forEach((volunteer) => checkAvailability(volunteer, eventStartDate, eventEndDate))
    }
  }, [volunteers, eventStartDate, eventEndDate])


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

      const formattedStartDate = format(new Date(props.eventData.start_date), 'eeee, HH:mm').split(", ")
      const formattedEndDate = format(new Date(props.eventData.end_date), 'eeee, HH:mm').split(", ")
      const startDate = {dayOfWeek: formattedStartDate[0], time: formattedStartDate[1]}
      const endDate = {dayOfWeek: formattedEndDate[0], time: formattedEndDate[1]}
      
      setEventStartDate(startDate)
      setEventEndDate(endDate)

    } catch (err) {
      console.log(err)
    }
  }

  const assignVolunteer = async (eventID, sv) => {
    try{
      const response = await AxiosInstance.post("event/assign/", {event: eventID, user: sv.user, user_profile: sv.user_profile})
      setIsAssignedMap(prevState => { return {...prevState, [sv.user_profile]: true}})
      setSelectedVolunteer(null)
    } catch (err) {
      console.log(err)
    }
  }

  const unassignVolunteer = async (eventID, sv) => {
    try{
      const response = await AxiosInstance.delete(`event/unassign/${eventID}/${sv.user}/${sv.user_profile}`)
      setIsAssignedMap(prevState => { return {...prevState, [sv.user_profile]: false}})
      setSelectedVolunteer(null)
    } catch (err) {
      console.log(err)
    }
  }

  const changeButton = () => {
    if(!selectedVolunteer){
      setAssignOrUnassign("")
      return
    }

    if(isAssignedMap[selectedVolunteer.user_profile]){
      setAssignOrUnassign("unassign")
      return
    }

    setAssignOrUnassign("assign")
  }

  const checkAvailability = (volunteer, evStartDate, evEndDate) => {
    const availability = volunteer.availability_json
    const eventStartDayOfWeek = (evStartDate.dayOfWeek).toLowerCase()
    const eventStartTime = (evStartDate.time).toLowerCase()
    const eventEndDayOfWeek = (evEndDate.dayOfWeek).toLowerCase()
    const eventEndTime = (evEndDate.time).toLowerCase()

    if(!availability[eventStartDayOfWeek].available || !availability[eventEndDayOfWeek].available){
      setIsAvailableMap(prevState => { return {...prevState, [volunteer.id]: false}})
      return
    }

    if(availability[eventStartDayOfWeek].start > eventStartTime || availability[eventEndDayOfWeek].end < eventEndTime){
      setIsAvailableMap(prevState => { return {...prevState, [volunteer.id]: false}})
      return
    }

    setIsAvailableMap(prevState => { return {...prevState, [volunteer.id]: true}})
  }




  return (
    <div className="flex flex-col bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg">
      <div>
        <h2 className="text-2xl text-center">Volunteers</h2>
        <div className="w-2xl">
          {volunteers.map(volunteer => (
            <div 
              key={volunteer.id} 
              className={`px-2 ${!isAvailableMap[volunteer.id] 
                ? "text-gray-400 cursor-default" 
                : `cursor-pointer ${!selectedVolunteer ? "hover:bg-gray-200 transition-colors" : (selectedVolunteer.user_profile == volunteer.id ? "bg-gray-200" : "hover:bg-gray-200 transition-colors")}`
              }`}
              onClick={() => {
                if(!isAvailableMap[volunteer.id]){
                  return
                }
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
                {(!isAvailableMap[volunteer.id] ?? false) && 
                  <p className="text-red-600"> Not Available </p>
                }
              </div>
              <hr/>
            </div>
            ))}
        </div>
      </div>
      <div className="flex w-full justify-around mt-5"> 
        {(assignOrUnsassign == "") &&
          <div></div> 
        }
        {(assignOrUnsassign == "assign") &&
          <button 
            className="!bg-[#3fA2A5] text-white hover:!bg-[#203e3f]"
            onClick={() => assignVolunteer(eventID, selectedVolunteer)}
          >
            Assign
          </button>
        }
        {(assignOrUnsassign == "unassign") &&
          <button 
            className="!bg-red-600 text-white hover:!bg-red-900"
            onClick={() => unassignVolunteer(eventID, selectedVolunteer)}
          >
            Unassign
          </button>
        }
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