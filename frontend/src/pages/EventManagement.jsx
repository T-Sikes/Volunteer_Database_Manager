import EventForm from "../components/EventForm.jsx"
import { useState, useEffect } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import VolunteerAssignList from "../components/VolunteerAssignList.jsx"
import AxiosInstance from "../components/AxiosInstance.jsx"

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

  useEffect(() => {
    fetchEvents()
  }, [])

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

  // Fetch volunteers assigned to an event
  const fetchVolunteersForEvent = async(event_id) => {
    try{
      const response = await AxiosInstance.get(`event/${event_id}/volunteers/`)
      const data = response.data
      setVolunteersForEvent(data.map(x => x.user_profile_details))
      console.log(data.map(x => x.user_profile_details))
      // console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  // Add event to database
  const addEvent = async (event) => {
    try{
        const response = await AxiosInstance.post("event/create/", event.extendedProps.eventData)
        const data = response.data
        event.extendedProps.eventData = data
        setEventsArray(prevState => [...prevState, event])
      } catch (err) {
        console.log(err)
      }
  }

  // Update event in database
  const updateEvent = async (event, pk) => {
      try{
        const response = await AxiosInstance.put(`event/${pk}/`, event.extendedProps.eventData)
        const data = response.data
        event.extendedProps.eventData = data
        setEventsArray(prevState => {
          const modifiedArray = [...prevState]
          const index = modifiedArray.findIndex(item => item.extendedProps.eventData.id == pk)
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
    else
      updateEvent(event, event.extendedProps.eventData.id)
  }

  // Function for showing showing event form when an event is clicked
  const eventClicked = info => {
    setClickedEvent(info.event)
    fetchVolunteersForEvent(info.event.extendedProps.eventData.id)
    toggleEventForm()
  }

  return (
    <div className="h-screen w-screen">
      {/* Only show event form if showEventForm is true */}
      {showEventForm && 
        <div className="flex absolute justify-center items-center top-0 left-0 z-10 bg-[rgba(0,0,0,0.5)] min-h-full min-w-full">
          <div className="flex items-start">
            <EventForm 
              openedEvent={clickedEvent ? clickedEvent.extendedProps.eventData : blankEvent} 
              submitEventForm={getEventFormData} 
              closeEventForm={toggleEventForm}
              deleteEvent={deleteEvent}
              newEvent={clickedEvent ? false : true}
              showVolunteerAssign={toggleVolunteerAssign}
            />
            <div className="bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg"> 
              <h2 className="text-2xl text-center">Assigned Volunteers</h2>
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
        </div>
      }
      {/* Volunteer assignment pop up */}
      {showVolunteerAssign &&
        <div className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.5)] h-screen w-screen">
          <div className="absolute inset-0 m-auto h-fit w-fit">
            <VolunteerAssignList
              eventID={clickedEvent.extendedProps.eventData.id}
              closeVolunteerAssign={toggleVolunteerAssign}
            />
          </div>
        </div>
      }
      <div className="h-[89%] w-screen px-5 relative z-0">
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
      <div className="flex justify-center h-fit mt-3">
        <button 
          onClick={() => {
            setClickedEvent(null) // Whenever a user clicks on "Add Event" there is no clicked event
            toggleEventForm()
          }}
          className="!bg-[#3fA2A5] hover:!bg-[#203e3f] text-white"
        >
          Add Event
        </button>
      </div>  
    </div>
  )
}

export default EventManagement