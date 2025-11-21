import { useState, useEffect } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import AxiosInstance from "../components/AxiosInstance.jsx"
import { format } from "date-fns"

const VolunteerPortalEvents = () => {
  const [showEventInfo, setShowEventInfo] = useState(false)
  const [eventsArray, setEventsArray] = useState([])
  const [clickedEvent, setClickedEvent] = useState({})
  const [clickedEventDetails, setClickedEventDetails] = useState({})

  const toggleEventInfo = () => setShowEventInfo(!showEventInfo)


  // Fetch events from database on mount
  const fetchEvents = async() => {
      try{
        const response = await AxiosInstance.get("event/assigned-events/")
        const data = response.data
        parseEvents(data)
      } catch (err) {
        console.log(err)
      }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Process fetched events so they can be read by FullCalendar
  const parseEvents = (events) => {
    const parsedEvents = []
    for(let i = 0; i < events.length; i++) {
      parsedEvents.push({
        title: events[i].event_details.event_name,
        start: events[i].event_details.start_date,
        end: events[i].event_details.end_date,
        extendedProps: {
          eventData: {...events[i].event_details}, 
          index: i
        } 
      })
      setEventsArray(parsedEvents)
    }
  }


  const eventClicked = info => {
    setClickedEvent(info.event) // Fullcalendar event
    setClickedEventDetails(info.event.extendedProps.eventData) // Raw event data
    toggleEventInfo()
  }

  return (
    <div className="h-screen w-screen">
      {showEventInfo && 
        <div className="flex absolute inset-0 z-10 bg-[rgba(0,0,0,0.5)] h-screen w-screen justify-center items-center">
          <div className="flex flex-col bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg">
            <div className="flex flex-col text-xl">
              <p><span className="font-bold">Name:</span> {clickedEventDetails.event_name}</p>
              <p><span className="font-bold">Description:</span> {clickedEventDetails.description}</p>
              <p><span className="font-bold">Start:</span> {format(clickedEventDetails.start_date, "MM-dd-yyyy hh:mm a")}</p>
              <p><span className="font-bold">End:</span> {format(clickedEventDetails.end_date, "MM-dd-yyyy hh:mm a")}</p>
              <p><span className="font-bold">Location Name:</span> {clickedEventDetails.location} </p>
              <p><span className="font-bold">Address:</span> {clickedEventDetails.address} </p>
              <p><span className="font-bold">City:</span> {clickedEventDetails.city} </p>
              <p><span className="font-bold">State:</span> {clickedEventDetails.state} </p>
              <p><span className="font-bold">Zip Code:</span> {clickedEventDetails.zip_code} </p>
              <p><span className="font-bold">Required Skills:</span> {clickedEventDetails.required_skills} </p>
              <p><span className="font-bold">Urgency:</span> {clickedEventDetails.urgency} </p>
            </div>

            <button onClick={() => setShowEventInfo(!showEventInfo)} className="!bg-white mt-5 text-[#3fA2A5] ml-4 border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white">Close</button>
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
    </div>
  )
}

export default VolunteerPortalEvents