import EventForm from "../components/EventForm.jsx"
import { useState } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { format } from "date-fns"

function EventManagement() {
  let blankEvent = {
    name: "",
    description: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    requiredSkills: "",
    urgency: ""
  }
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventsArray, setEventsArray] = useState([])
  const [clickedEvent, setClickedEvent] = useState({})

  const toggleEventForm = () => setShowEventForm(!showEventForm)

  // Function for receiving data from EventForm component and updating the eventsArray being given to FullCalendar
  const getEventFormData = eventFormData => {
    console.log(eventFormData)
    const newEvent = Object.values(clickedEvent).every(x => x === "") ? true : false // Boolean that stores whether the user is adding a new event or updating an existing event
    const arrayIndex = newEvent ? eventsArray.length : clickedEvent.index // Stores array index of event in eventsArray
    const event = {
      // These are properties specifically for FullCalender to read
      title: eventFormData.name,
      start: format(eventFormData.date, "yyyy-MM-dd"),
      end: format(eventFormData.date, "yyyy-MM-dd"),
      
      // extendedProps stores all of the event form data and its index in the eventsArray to be retrieved later.
      extendedProps: {...eventFormData, index: arrayIndex} 
    }

    if (newEvent)
      setEventsArray(prevState => prevState.concat([event]))
    else
      setEventsArray(prevState => {
        const modifiedArray = [...prevState]
        modifiedArray[arrayIndex] = event
        return modifiedArray  
      })
  }

  // Function for showing showing event form when an event is clicked
  const eventClicked = info => {
    setClickedEvent(info.event.extendedProps)
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
            <EventForm openedEvent={clickedEvent} submitEventForm={getEventFormData} closeEventForm={toggleEventForm}/>
          </div>
        }
      </div>
      <div className="flex justify-center h-fit mt-3">
        <button 
          onClick={() => {
            setClickedEvent({...blankEvent}) // Whenever a user clicks on "Add Event" the event data should be empty
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