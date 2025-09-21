import EventForm from "../components/EventForm.jsx"
import { useState } from "react"

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
    </>
  )
}

export default EventManagement