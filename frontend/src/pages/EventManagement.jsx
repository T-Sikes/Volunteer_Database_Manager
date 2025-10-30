import EventForm from "../components/EventForm.jsx"
import { useState, useEffect } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { format } from "date-fns"

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

  useEffect(() => {
    fetchEvents()
  }, [])

  const toggleEventForm = () => setShowEventForm(!showEventForm)

  // Fetch events from backend on mount
  const fetchEvents = async() => {
    try{
      const response = await fetch("http://127.0.0.1:8000/event/")
      const data = await response.json()
      parseEvents(data)
    } catch (err) {
      console.log(err)
    }
  }

  // Add event to database (when the database is implemented)
  const addEvent = async (event) => {
    try{
      const response = await fetch("http://127.0.0.1:8000/event/create/",{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event.extendedProps.eventData)
      })
      const data = await response.json()
      console.log(data)
      setEventsArray(prevState => [...prevState, event])
    } catch (err) {
      console.log(err)
    }
  }

  // Update event in database (when the database is implemented)
  const updateEvent = async (event, pk) => {
    try{
      const response = await fetch(`http://127.0.0.1:8000/event/${pk}/`,{
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event.extendedProps.eventData)
      })
      const data = await response.json()
      console.log(data)
      setEventsArray(prevState => {
        const modifiedArray = [...prevState]
        modifiedArray[event.extendedProps.index] = event
        return modifiedArray  
      })
    } catch (err) {
      console.log(err)
    }
  }

  // Process fetched events so they can be read by FullCalendar
  const parseEvents = (events) => {
    const parsedEvents = []
    for(let i = 0; i < events.length; i++) {
      parsedEvents.push({
        title: events[i].name,
        start: format(events[i].date, "yyyy-MM-dd"),
        end: format(events[i].date, "yyyy-MM-dd"),
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
    const arrayIndex = newEvent ? eventsArray.length : clickedEvent.extendedProps.index // Stores array index of event in eventsArray
    const event = {
      // These are properties specifically for FullCalender to read
      title: eventFormData.name,
      start: format(eventFormData.date, "yyyy-MM-dd"),
      end: format(eventFormData.date, "yyyy-MM-dd"),
      
      // extendedProps stores all of the event form data and its index in the eventsArray to be retrieved later.
      extendedProps: {
        eventData: {...eventFormData}, 
        index: arrayIndex
      } 
    }

    if (newEvent){
      addEvent(event)
    }
    else
      updateEvent(event, event.extendedProps.eventData.id)
  }

  // Function for showing showing event form when an event is clicked
  const eventClicked = info => {
    setClickedEvent(info.event)
    toggleEventForm()
  }



  return (
    <div className="h-screen w-screen">
      <div className="h-[89%] w-screen px-5 relative z-0">
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          events={eventsArray}
          height="100%"
          expandRows={true}
          eventClick={eventClicked}
        />
        {/* Only show event form if showEventForm is true */}
        {showEventForm && 
          <div className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.5)] h-screen w-screen">
            <EventForm openedEvent={clickedEvent ? clickedEvent.extendedProps.eventData : blankEvent} submitEventForm={getEventFormData} closeEventForm={toggleEventForm}/>
          </div>
        }
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