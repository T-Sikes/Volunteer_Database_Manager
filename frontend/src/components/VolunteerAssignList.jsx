import React, { useEffect, useState } from 'react'
import { format } from "date-fns"
import AxiosInstance from './AxiosInstance'

const VolunteerAssignList = (props) => {
  const [volunteers, setVolunteers] = useState(props.volunteers)
  const [selectedVolunteer, setSelectedVolunteer] = useState(null)
  const [eventID, setEventID] = useState(props.eventID)
  const [isAssignedMap, setIsAssignedMap] = useState(props.isAssignedMap)
  const [assignOrUnsassign, setAssignOrUnassign] = useState("")
  const [eventStartDate, setEventStartDate] = useState(null)
  const [eventEndDate, setEventEndDate] = useState(null)
  const [isAvailableMap, setIsAvailableMap] = useState(props.isAvailableMap)

  useEffect(() => {
    changeButton()
  },[selectedVolunteer])

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
                  <p><span className="font-medium">Skills:</span> {volunteer.skills?.join(', ') || ""}</p>
                  <p><span className="font-medium">Location:</span> {volunteer.city}, {volunteer.state}, {volunteer.zipcode}</p>
                  <p><span className="font-medium">Preferences:</span> {volunteer.preferences}</p>
                </div>
                {(isAssignedMap[volunteer.id]) && 
                  <p className="text-green-600"> Assigned </p>
                }
                {(!isAvailableMap[volunteer.id]) && 
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
