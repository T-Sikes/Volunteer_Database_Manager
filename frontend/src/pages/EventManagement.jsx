import EventForm from "../components/EventForm.jsx"
import { useState, useEffect } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import VolunteerAssignList from "../components/VolunteerAssignList.jsx"
import AxiosInstance from "../components/AxiosInstance.jsx"
import { format, parse } from "date-fns"

function EventManagement() {
  
  let blankEvent = {
    event_name: "",
    description: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    required_skills: "",
    urgency: ""
  }
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventsArray, setEventsArray] = useState([])
  const [clickedEvent, setClickedEvent] = useState({})
  const [showVolunteerAssign, setShowVolunteerAssign] = useState(false)
  const [volunteersForEvent, setVolunteersForEvent] = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [eventStartDate, setEventStartDate] = useState(null)
  const [eventEndDate, setEventEndDate] = useState(null)
  const [isAssignedMap, setIsAssignedMap] = useState({})
  const [isAvailableMap, setIsAvailableMap] = useState({})
  const [isScheduleConflict, setIsScheduleConflict] = useState(false)
  const [unavailableVolunteers, setUnavailableVolunteers] = useState([])
  const [updatedEvent, setUpdatedEvent] = useState(null)
  const [showAvailabilityMap, setShowAvailabilityMap] = useState({})

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if(volunteers.length > 0 && eventStartDate && eventEndDate) {
      volunteers.forEach((volunteer) => checkAvailability(volunteer, eventStartDate, eventEndDate))
    }
  }, [volunteers, eventStartDate, eventEndDate])

  const toggleEventForm = () => setShowEventForm(!showEventForm)

  const toggleVolunteerAssign = () => setShowVolunteerAssign(!showVolunteerAssign) // Toggle pop up for assigning volunteers

  // Fetch events from database on mount
  const fetchEvents = async() => {
    try{
        const response = await AxiosInstance.get("event/")
        const data = response.data
        parseEvents(data)
    } catch (err) {
      console.log(err)
    }
  }

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
  const fetchVolunteersForEvent = async(eventData) => {
    try{
      const response = await AxiosInstance.get(`event/${eventData.id}/volunteers/`)
      const data = response.data
      setVolunteersForEvent(data.map(x => x.user_profile_details))
      const ids = data.map(x => x.user_profile_details.id)
      const mp = {}
      ids.forEach((id) => {
        mp[id] = true
      })
      setIsAssignedMap(mp)

      const formattedStartDate = format(new Date(eventData.start_date), 'eeee, HH:mm').split(", ")
      const formattedEndDate = format(new Date(eventData.end_date), 'eeee, HH:mm').split(", ")
      const startDate = {dayOfWeek: formattedStartDate[0], time: formattedStartDate[1]}
      const endDate = {dayOfWeek: formattedEndDate[0], time: formattedEndDate[1]}
      
      setEventStartDate(startDate)
      setEventEndDate(endDate)

    } catch (err) {
      console.log(err)
    }
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
  
  const checkAvailabilitySync = (volunteer, evStartDate, evEndDate) => {
    const availability = volunteer.availability_json
    const eventStartDayOfWeek = (evStartDate.dayOfWeek).toLowerCase()
    const eventStartTime = (evStartDate.time).toLowerCase()
    const eventEndDayOfWeek = (evEndDate.dayOfWeek).toLowerCase()
    const eventEndTime = (evEndDate.time).toLowerCase()

    if(!availability[eventStartDayOfWeek].available || !availability[eventEndDayOfWeek].available){
      return false
    }

    if(availability[eventStartDayOfWeek].start > eventStartTime || availability[eventEndDayOfWeek].end < eventEndTime){
      return false
    }

    return true
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

  // Add event to database
  const addEvent = async (event) => {
    try{
        const response = await AxiosInstance.post("event/create/", event.extendedProps.eventData)
        const data = response.data
        event.extendedProps.eventData = data
        event.start = event.extendedProps.eventData.start_date
        event.end = event.extendedProps.eventData.end_date
        setEventsArray(prevState => [...prevState, event])
      } catch (err) {
        console.log(err)
      }
  }

  // Update event in database
  const updateEvent = async (event) => {
      setUnavailableVolunteers(false)
      try{
        const response = await AxiosInstance.put(`event/${event.extendedProps.eventData.id}/`, event.extendedProps.eventData)
        const data = response.data
        event.extendedProps.eventData = data
        event.start = event.extendedProps.eventData.start_date
        event.end = event.extendedProps.eventData.end_date
        setEventsArray(prevState => {
          const modifiedArray = [...prevState]
          const index = modifiedArray.findIndex(item => item.extendedProps.eventData.id == event.extendedProps.eventData.id)
          modifiedArray[index] = event
          return modifiedArray  
      })
      } catch (err) {
        console.log(err)
      }
  }

  // Delete event in database
  const deleteEvent = async () => {
    const pk = clickedEvent.extendedProps.eventData.id
    try{
      const response = await AxiosInstance.delete(`event/${pk}/`)
      setEventsArray(prevState => prevState.filter(
        event => event.extendedProps.eventData.id !== pk
      ))
    } catch (err) {
      console.log(err)
    }
    toggleEventForm()
  }

  // Process fetched events so they can be read by FullCalendar
  const parseEvents = (events) => {
    const parsedEvents = []
    for(let i = 0; i < events.length; i++) {
      parsedEvents.push({
        title: events[i].event_name,
        start: events[i].start_date,
        end: events[i].end_date,
        extendedProps: {
          eventData: {...events[i]}, 
          index: i
        } 
      })
      setEventsArray(parsedEvents)
    }
  }

  const unassignVolunteer = async (eventID, volunteer) => {
    try{
      const response = await AxiosInstance.delete(`event/unassign/${eventID}/${volunteer.user}/${volunteer.id}`)
    } catch (err) {
      console.log(err)
    }
  }


  // Function for receiving data from EventForm component and updating the eventsArray being given to FullCalendar
  const getEventFormData = eventFormData => {
    

    const newEvent = clickedEvent ? false : true // Boolean that stores whether the user is adding a new event or updating an existing event
    
    // Create event that can be properly read by FullCalendar
    const event = {
      title: eventFormData.event_name,
      start: eventFormData.start_date,
      end: eventFormData.end_date,
      
      // extendedProps stores all of the event form data and its index in the eventsArray to be retrieved later.
      extendedProps: {
        eventData: {...eventFormData}, 
      } 
    }

    if (newEvent)
      addEvent(event)
    else{
      const unavailableVolunteers = []
      const prevIsAvailableMap = {...isAvailableMap}
      const formattedStartDate = format(new Date(event.extendedProps.eventData.start_date), 'eeee, HH:mm').split(", ")
      const formattedEndDate = format(new Date(event.extendedProps.eventData.end_date), 'eeee, HH:mm').split(", ")
      
      if(volunteersForEvent.length > 0) {
        const newAvailabilityMap = {}
        
        // Compute new availability for all volunteers
        volunteersForEvent.forEach((volunteer) => {
          const isAvailable = checkAvailabilitySync(volunteer, 
            {dayOfWeek: formattedStartDate[0], time: formattedStartDate[1]}, 
            {dayOfWeek: formattedEndDate[0], time: formattedEndDate[1]})
          newAvailabilityMap[volunteer.id] = isAvailable
        })

        // Compare old vs new availability
        volunteersForEvent.forEach((volunteer) => {
          if(prevIsAvailableMap[volunteer.id] && !newAvailabilityMap[volunteer.id]){
            unavailableVolunteers.push(volunteer)
          }
        })
        
        // Update state with new availability
        setIsAvailableMap(prev => ({...prev, ...newAvailabilityMap}))
      }

      if(unavailableVolunteers.length > 0){
        setUpdatedEvent(event)
        setUnavailableVolunteers(unavailableVolunteers)
        setIsScheduleConflict(true)
        return
      }
      updateEvent(event)
    }
  }

  // Function for showing showing event form when an event is clicked
  const eventClicked = info => {
    setClickedEvent(info.event)
    fetchVolunteers()
    fetchVolunteersForEvent(info.event.extendedProps.eventData)
    toggleEventForm()
  }

  return (
    <div className="h-screen w-screen">
      {(isScheduleConflict) && 
        <div className="flex justify-center items-start py-10 fixed inset-0 z-10 bg-[rgba(0,0,0,0.5)] overflow-y-auto">
          <div className="bg-white border-gray-500 border-2 h-fit w-3/5 p-10 rounded-lg">
            <p className="text-xl"> Changing the event to this date and time will result in the following volunteers 
              being unsassigned because they are unavailable. Do you wish to proceed?:</p>
            {unavailableVolunteers.map(volunteer => (
              <div 
                key={volunteer.id} 
                className="p-2"
              >
                <div className="flex justify-between text-lg">
                  <div>
                    <p>{volunteer.full_name} (ID: {volunteer.id}) </p>
                    <p><span className="font-medium">Skills:</span> {volunteer.skills}</p>
                    <p><span className="font-medium">Location:</span> {volunteer.city}, {volunteer.state}</p>
                    {showAvailabilityMap[volunteer.id] &&
                      <div>
                        <span className="font-medium">Availability:</span>
                        <pre className="whitespace-pre-wrap mt-1 ml-5 font-sans text-base">
                          {volunteer.availability_json && formatAvailability(volunteer.availability_json)}
                        </pre>
                      </div>
                    }
                    <p 
                      className="underline text-blue-500 cursor-pointer" 
                      onClick={() => {
                        if(!showAvailabilityMap[volunteer.id]){
                          setShowAvailabilityMap(prevState => {return {...prevState, [volunteer.id]: true}})
                          return
                        }
                        setShowAvailabilityMap(prevState => {return {...prevState, [volunteer.id]: false}})
                      }}
                    >
                      {!showAvailabilityMap[volunteer.id] ? "Show availability" : "Hide availability"}
                    </p>
                  </div>
                </div>
                <hr/>
              </div>
            ))}
            <div className="flex mt-4 justify-around w-full">
              <button 
                onClick={() => {
                  unavailableVolunteers.forEach((volunteer) => {
                    unassignVolunteer(clickedEvent.extendedProps.eventData.id, volunteer)
                    setIsScheduleConflict(false)
                    setShowAvailabilityMap({})
                  })
                  updateEvent(updatedEvent)
                }} 
                className="!bg-[#3fA2A5] text-white hover:!bg-[#203e3f]"
              >
                Yes</button>
              <button 
              onClick={() => {
                setIsScheduleConflict(false)
                setShowAvailabilityMap({})
              }} 
              className="!bg-white text-[#3fA2A5] ml-4 border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white">No</button>
            </div>
          </div>
        </div>
      }
      {/* Only show event form if showEventForm is true */}
      {showEventForm && 
        <div className="flex justify-center items-start py-10 fixed inset-0 z-10 bg-[rgba(0,0,0,0.5)] overflow-y-auto">
            <div className="flex items-start">
            <EventForm 
              openedEvent={clickedEvent ? clickedEvent.extendedProps.eventData : blankEvent} 
              submitEventForm={getEventFormData} 
              closeEventForm={toggleEventForm}
              deleteEvent={deleteEvent}
              newEvent={clickedEvent ? false : true}
              showVolunteerAssign={toggleVolunteerAssign}
            />
            {clickedEvent &&
              <div className="bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg"> 
                <h2 className="text-2xl text-center">Assigned Volunteers</h2>
                <div className="mt-5">
                  {volunteersForEvent.length == 0 && 
                    <p>No assigned volunteers for this event</p>
                  }
                  {volunteersForEvent.map(volunteer => (
                    <div 
                      key={volunteer.id} 
                      className="px-2" 
                    >
                      <p className="text-lg">{volunteer.full_name} (ID: {volunteer.id})</p>
                      <hr/>
                    </div>
                    ))}
                </div>
              </div>
            }
            </div>
        </div>
      }
      {/* Volunteer assignment pop up */}
      {showVolunteerAssign &&
        <div className="flex justify-center items-start py-10 fixed inset-0 z-10 bg-[rgba(0,0,0,0.5)] overflow-y-auto">
          <div className="h-fit w-fit">
            <VolunteerAssignList
              eventID={clickedEvent.extendedProps.eventData.id}
              eventData={clickedEvent.extendedProps.eventData}
              closeVolunteerAssign={toggleVolunteerAssign}
              isAssignedMap={isAssignedMap}
              isAvailableMap={isAvailableMap}
              volunteers={volunteers}
            />
          </div>
        </div>
      }
      <div className="flex justify-center h-fit mt-3">
        <button 
          onClick={() => {
            setClickedEvent(null) // Whenever a user clicks on "Add Event" there is no clicked event
            toggleEventForm()
          }}
          className="!bg-[#3fA2A5] hover:!bg-[#203e3f] text-white"
        >
          <span className="text-2xl">+</span> Add Event
        </button>
      </div>  
      <div className="h-[80%] w-screen px-20 relative z-0">
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          events={eventsArray}
          height="100%"
          expandRows={true}
          eventClick={eventClicked}
          eventDisplay="block"
          timeZone="local"
        />
      </div>
    </div>
  )
}

export default EventManagement