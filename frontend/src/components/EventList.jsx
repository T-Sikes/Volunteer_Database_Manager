import { useState, useEffect } from "react"
import { format } from "date-fns"


const EventList = (props) => {
  const [eventsArray, setEventsArray] = useState(props.eventsArray)
  
  useEffect(() => {
    setEventsArray(props.eventsArray)
  }, [props.eventsArray])
  

  return (
    <div className="flex justify-center w-screen">
      <div className="w-3/4">
        {eventsArray.map(event => (
          <div 
            key={event.extendedProps.eventData.id} 
            className="px-2 hover:bg-gray-200 transition-colors cursor-pointer" 
            onClick={() => {
              props.eventClicked(event, false)
            }}
          >
            <div className="flex w-full items-center py-5 text-lg">
                <p className="mb-7">{format(new Date(event.extendedProps.eventData.start_date), 'MM/dd/yyyy')} | </p>
                <div className="flex flex-col items-start ml-4">
                  <p>{event.extendedProps.eventData.event_name}</p>
                  <p>{format(new Date(event.extendedProps.eventData.start_date), 'HH:mm aa')} - {format(new Date(event.extendedProps.eventData.end_date), 'HH:mm aa')}</p>
                </div>
            </div>
            <hr/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventList