import EventForm from "../components/EventForm.jsx"
import { useState } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

function EventManagement() {
  let event
  const [showEventForm, setShowEventForm] = useState(false)

  // Function for receiving data from EventForm component
  const getEventFormData = eventFormData => {
    event = eventFormData
    console.log(event)
  }
  const toggleEventForm = () => setShowEventForm(!showEventForm)


  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen w-screen">
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
        />
        <button 
          className="absolute bottom-20 right-56" 
          onClick={toggleEventForm}
        >
          Add Event
        </button>
        {/* Only show event form if showEventForm is true */}
        {showEventForm && 
          <EventForm submitEventForm={getEventFormData} closeEventForm={toggleEventForm}/>
        }
      </div>  
    </>
  )
}

export default EventManagement