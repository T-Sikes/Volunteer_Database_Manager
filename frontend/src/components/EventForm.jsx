import { useState } from "react" 
import Datepicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format } from "date-fns"

function EventForm(props) {
  // Hardcoded required skills for now
  const skills = ["Bilingual/Multilingual", "Childcare", "Basic math", "Able to lift more than 50 lbs", "Leadership", "Food prep", "Retail experience"]
  const states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]


  const [eventData, setEventData] = useState({...props.openedEvent})  // State variable that stores data from the event form in an object
  const [selectedStartDate, setSelectedStartDate] = useState("start_date" in props.openedEvent ? props.openedEvent.start_date : new Date())
  const [selectedEndDate, setSelectedEndDate] = useState("end_date" in props.openedEvent ? props.openedEvent.end_date : new Date())
  const [selectedSkills, setSelectedSkills] = useState(props.openedEvent.required_skills)
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  
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
    eventData.start_date = format(selectedStartDate, "yyyy-MM-dd HH:mm:ss")
    eventData.end_date = format(selectedEndDate, "yyyy-MM-dd HH:mm:ss")
    eventData.required_skills = selectedSkills
    props.submitEventForm(eventData)
    props.closeEventForm()
  }

  // Close form when user clicks cancel
  const handleCancel = (e) => {
    e.preventDefault()
    props.closeEventForm()
  }
  

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg">
        <form>
          <div className="flex flex-col">
            <label>Name</label>
            <input
              name = "event_name"
              type="text"
              required
              value={eventData.event_name}
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            />

            <label>Description</label>
            <textarea 
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            >
            </textarea>
            
            <div className="mt-4 flex">
              <label>Start</label>
              <div className="border-2 rounded-lg border-gray-500 w-1/3">
                <Datepicker 
                  selected={selectedStartDate} 
                  onChange={date => setSelectedStartDate(date)}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  scrollableMonthYearDropdown
                  showTimeSelect
                  dateFormat="Pp"
                />
              </div>

              <label>End</label>
              <div className="border-2 rounded-lg border-gray-500 w-1/3">
                <Datepicker 
                  selected={selectedEndDate} 
                  onChange={date => setSelectedEndDate(date)}
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  scrollableMonthYearDropdown
                  showTimeSelect
                  dateFormat="Pp"
                />
              </div>
            </div>

            <label>Location Name</label>
            <input
              name = "location"  
              type="text"
              value={eventData.location}
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            />

            <label>Address</label>
            <input
              name = "address"
              type="text"
              value={eventData.address}
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            />

            <div className="mt-4">
              <label>City</label>
              <input
                name = "city"
                type="text"
                value={eventData.city}
                onChange={handleChange}
                className="border-2 rounded-lg border-gray-500"
              />

              <label>State</label>
              <select
                name = "state"
                value={eventData.state}
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
                name = "zip_code"
                type="number"
                value={eventData.zip_code}
                onChange={handleChange}
                className="border-2 rounded-lg border-gray-500"
              />
            </div>

            <label>Required Skills</label>
            <div 
              className="border-2 rounded-xl border-gray-500 p-2 bg-white cursor-pointer text-black max-w-[600px]"
              onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)}
            >
            {selectedSkills.length > 0 ? selectedSkills.join(', ') : ''}
            </div>

            {/* Dropdown options */}
            {skillsDropdownOpen && (
                <div className="border-2 border-gray-500 bg-white rounded-xl mt-1 max-h-40 overflow-y-auto p-2 z-10 relative">
                {skills.map(skill => (
                    <label key={skill} className="flex items-center space-x-2 mb-1">
                    <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => {
                          if (selectedSkills.includes(skill)) 
                              setSelectedSkills(selectedSkills.filter(s => s !== skill));
                          else 
                              setSelectedSkills([...selectedSkills, skill]);
                        
                        }}
                    />
                    <span className="text-black">{skill}</span>
                    </label>
                ))}
                </div>
            )}

            {/* Old Implementation */}
            {/* <select
              name = "requiredSkills"
              value={eventData.requiredSkills}
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            >
              <option value={null}></option>
              {skills.map(skill => {
                return(
                  <option key={skill} value={skill}>{skill}</option>
                )
              })}
            </select> */}

            <label>Urgency</label>
            <select
              name = "urgency"
              value={eventData.urgency}
              onChange={handleChange}
              className="border-2 rounded-lg border-gray-500"
            >
              <option value={null}></option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex mt-4">
            <button onClick={handleSave} className="!bg-[#3fA2A5] text-white hover:!bg-[#203e3f]">Save</button>
            <button onClick={handleCancel} className="!bg-white text-[#3fA2A5] ml-4 border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm