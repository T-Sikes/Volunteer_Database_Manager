import { useState } from "react" 
import Datepicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

function EventForm(props) {
  // Hardcoded required skills for now
  const skills = ["Bilingual/Multilingual", "Childcare", "Basic math", "Able to lift more than 50 lbs", "Leadership", "Food prep", "Retail experience"]
  const states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]
  const event = {
    name: null,
    description: null,
    date: null,
    location: null,
    address: null,
    city: null,
    state: null,
    zipCode: null,
    requiredSkills: null,
    urgency: null,
  }

  // State variable that stores data from the event form in an object
  const [eventData, setEventData] = useState(event)
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // Updates event object whenever form data changes
  const handleChange = (e) => {
    const key = e.target.name
    const value = e.target.value

    setEventData(prevState => {
      return {...prevState, [key]: value}
    })
  }

  // Pass event form data to parent component and close form when user clicks save
  const handleSave = (e) => {
    e.preventDefault()
    eventData.date = selectedDate
    props.submitEventForm(eventData)
    props.closeEventForm()
  }

  // Close form when user clicks cancel
  const handleCancel = (e) => {
    e.preventDefault()
    props.closeEventForm()
  }
  

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <h1>Event Management Form</h1>
      <form>
        <div className="flex flex-col">
          <label>Name</label>
          <input
            name = "name"
            type="text"
            required
            onChange={handleChange}
            className="border-2 rounded-lg border-gray-500"
          />

          <label>Description</label>
          <textarea 
            name="description"
            onChange={handleChange}
            className="border-2 rounded-lg border-gray-500"
          >
          </textarea>
          
          <label>Date</label>
          <div className="border-2 rounded-lg border-gray-500">
            <Datepicker 
              selected={selectedDate} 
              onChange={date => setSelectedDate(date)}
              showMonthDropdown
              showYearDropdown
              scrollableYearDropdown
              scrollableMonthYearDropdown
            />
          </div>

          <label>Location</label>
          <input
            name = "location"  
            type="text"
            onChange={handleChange}
            className="border-2 rounded-lg border-gray-500"
          />

          <label>Address</label>
          <input
            name = "address"
            type="text"
            onChange={handleChange}
            className="border-2 rounded-lg border-gray-500"
          />

          <div>
            <label>City</label>
            <input
              name = "city"
              type="text"
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            />

            <label>State</label>
            <select
              name = "state"
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            >
              <option value={null}></option>
              {states.map(state => {
                return(
                  <option key={state} value={state}>{state}</option>
                )
              })}
            </select>

            <label>ZIP Code</label>
            <input
              name = "zipCode"
              type="number"
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            />
          </div>

          <label>Required Skills</label>
          <select
            name = "requiredSkills"
            onChange={handleChange}
            className="border-2 rounded-lg border-gray-500"
          >
            <option value={null}></option>
            {skills.map(skill => {
              return(
                <option key={skill} value={skill}>{skill}</option>
              )
            })}
          </select>

          <label>Urgency</label>
          <select
            name = "urgency"
            onChange={handleChange}
            className="border-2 rounded-lg border-gray-500"
          >
            <option value={null}></option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  )
}

export default EventForm