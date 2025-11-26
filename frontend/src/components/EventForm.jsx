import { useState, useRef } from "react" 
import Datepicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { formatInTimeZone } from "date-fns-tz"

function EventForm(props) {
  const skills = ["Bilingual/Multilingual", "Childcare", "Basic math", "Ability to lift 50 lbs", "Leadership", "Food prep", "Retail experience, Computer literacy", "Cleaning and sanitation", "First aid/CPR", "Ability to use hand tools"]
  const states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"]

  const [eventData, setEventData] = useState({...props.openedEvent})
  
  // One date picker for the event date
  const [selectedDate, setSelectedDate] = useState(
    "start_date" in props.openedEvent 
      ? new Date(props.openedEvent.start_date) 
      : new Date()
  )
  
  // Two separate time pickers
  const [startTime, setStartTime] = useState(
    "start_date" in props.openedEvent 
      ? new Date(props.openedEvent.start_date) 
      : new Date()
  )
  const [endTime, setEndTime] = useState(
    "end_date" in props.openedEvent 
      ? new Date(props.openedEvent.end_date) 
      : new Date()
  )
  
  const [selectedSkills, setSelectedSkills] = useState(props.openedEvent.required_skills)
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [showConfirmMsg, setShowConfirmMsg] = useState(false);
  const [noSelectedSkills, setNoSelectedSkills] = useState(false)
  const [timeError, setTimeError] = useState("")
  const formRef = useRef(null)
  
  // Helper functions to combine date with times
  const getStartDateTime = () => {
    const start = new Date(selectedDate);
    start.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    return start;
  };

  const getEndDateTime = () => {
    const end = new Date(selectedDate);
    end.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
    return end;
  };

  const handleChange = (e) => {
    const key = e.target.name
    const value = e.target.value

    setEventData(prevState => {
      return {...prevState, [key]: value}
    })
  }

  const handleSave = (e) => {
    e.preventDefault()
    const form = formRef.current;
    let isError = false;

    if (selectedSkills.length > 0){
      setNoSelectedSkills(false)
    }

    if (endTime.getHours() < startTime.getHours() || 
    (endTime.getHours() === startTime.getHours() && endTime.getMinutes() <= startTime.getMinutes())) {
      setTimeError("End time must be after start time");
      isError = true
    }
    else{
      setTimeError("") 
    } 

    if (selectedSkills.length == 0){
      setNoSelectedSkills(true)
      isError = true
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if(isError)
      return;
    
    

    // Combine date with times to create full DateTime objects
    const startDateTime = getStartDateTime();
    const endDateTime = getEndDateTime();

    eventData.start_date = formatInTimeZone(startDateTime, "UTC", "yyyy-MM-dd HH:mm:ss")
    eventData.end_date = formatInTimeZone(endDateTime, "UTC", "yyyy-MM-dd HH:mm:ss")
    eventData.required_skills = selectedSkills != "" ? selectedSkills : []
    props.submitEventForm(eventData)
    props.closeEventForm()
  }

  const handleCancel = (e) => {
    e.preventDefault()
    props.closeEventForm()
  }

  const handleDelete = (e) => {
    e.preventDefault()
    props.deleteEvent()
  }

  const showVolunteerAssign = (e) => {
    e.preventDefault()
    props.showVolunteerAssign()
    props.closeEventForm()
  }

  const toggleConfirmMsg = () => setShowConfirmMsg(!showConfirmMsg)
  

  return (
    <div>
      {showConfirmMsg && 
        <div className="bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg">
          <p className="text-xl font-bold">Are you sure you want to delete this event?: {eventData.event_name}</p>
            <div className="flex mt-4 justify-between">
              <button onClick={handleDelete} className="!bg-red-600 text-white hover:!bg-red-900"> Delete </button>
              <button onClick={toggleConfirmMsg} className="!bg-white text-[#3fA2A5] ml-4 border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white">Cancel</button>
            </div>
        </div>
      }
      {!showConfirmMsg &&
        <div className="flex flex-col bg-white border-gray-500 border-2 h-fit w-fit p-10 rounded-lg">
          <form ref={formRef}>
            <div className="flex flex-col">
              <label>Name <span className="text-red-500">*</span></label>
              <input
                name = "event_name"
                type="text"
                required
                value={eventData.event_name}
                onChange={handleChange}
                className="border-2 rounded-lg border-gray-500"
                maxLength="200"
              />

              <label>Description<span className="text-red-500">*</span></label>
              <textarea 
                name="description"
                value={eventData.description}
                onChange={handleChange}
                className="border-2 rounded-lg border-gray-500"
                required
              >
              </textarea>
              
              <div className="mt-4">
                {timeError && <p className="text-red-500">{timeError}</p>}
              <div className="flex space-x-4">
                <div>
                  <label>Event Date <span className="text-red-500">*</span></label>
                  <div className="border-2 rounded-lg border-gray-500 w-fit">
                    <Datepicker 
                      selected={selectedDate} 
                      onChange={date => setSelectedDate(date)}
                      showMonthDropdown
                      showYearDropdown
                      scrollableYearDropdown
                      scrollableMonthYearDropdown
                      dateFormat="MM/dd/yyyy"
                      minDate={new Date()}
                      onChangeRaw={e => e.preventDefault()}
                    />
                  </div>
                </div>
                <div>
                  <label>Start Time <span className="text-red-500">*</span></label>
                  <div className="border-2 rounded-lg border-gray-500 w-fit">
                    <Datepicker 
                      selected={startTime} 
                      onChange={time => setStartTime(time)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Start"
                      dateFormat="h:mm aa"
                      onChangeRaw={e => e.preventDefault()}
                    />
                  </div>
                </div>

                <div>
                  <label>End Time <span className="text-red-500">*</span></label>
                  <div className="border-2 rounded-lg border-gray-500 w-fit">
                    <Datepicker 
                      selected={endTime} 
                      onChange={time => setEndTime(time)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="End"
                      dateFormat="h:mm aa"
                      onChangeRaw={e => e.preventDefault()}
                    />
                  </div>
                </div>
              </div>
              </div>

              <label className="mt-4">Location Name<span className="text-red-500">*</span> </label>
              <input
                name = "location"  
                type="text"
                value={eventData.location}
                onChange={handleChange}
                className="border-2 rounded-lg border-gray-500"
                maxLength="200"
                required
              />

              <label>Address <span className="text-red-500">*</span></label>
              <input
                name = "address"
                type="text"
                value={eventData.address}
                onChange={handleChange}
                className="border-2 rounded-lg border-gray-500"
                required
                maxLength="200"
              />

              <div className="flex mt-4 space-x-1">
                <label>City <span className="text-red-500">*</span></label>
                <input
                  name = "city"
                  type="text"
                  value={eventData.city}
                  onChange={handleChange}
                  className="border-2 rounded-lg border-gray-500"
                  required
                  maxLength="50"
                />

                <label>State <span className="text-red-500">*</span></label>
                <select
                  name = "state"
                  value={eventData.state}
                  onChange={handleChange}
                  className="border-2 rounded-lg border-gray-500"
                  required
                >
                  <option value="" selected disabled hidden></option>
                  {states.map(state => {
                    return(
                      <option key={state} value={state}>{state}</option>
                    )
                  })}
                </select>

                <label>ZIP Code <span className="text-red-500">*</span></label>
                <input
                  name = "zip_code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  value={eventData.zip_code}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,5}$/.test(value)) {
                      handleChange(e)
                    }
                  }}
                  className="border-2 rounded-lg border-gray-500"
                  required
                  title="ZIP code must be exactly 5 digits"
                />
              </div>

              <label>Required Skills <span className="text-red-500">*</span></label>
              {noSelectedSkills && <p className="text-red-500">Select at least 1 required skill</p>}
              <div 
                className="border-2 rounded-xl border-gray-500 p-2 bg-white cursor-pointer text-black max-w-[600px]"
                onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)}
              >
              {selectedSkills.length > 0 ? selectedSkills.join(', ') : ''}
              </div>

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
              
              <label>Urgency <span className="text-red-500">*</span></label>
              <select
                name = "urgency"
                value={eventData.urgency}
                onChange={handleChange}
                className="border-2 rounded-lg border-gray-500"
                required
              >
                <option selected value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex mt-4 justify-between">
              <div>
                <button onClick={handleSave} className="!bg-[#3fA2A5] text-white hover:!bg-[#203e3f]">Save</button>
                <button onClick={handleCancel} className="!bg-white text-[#3fA2A5] ml-4 border-2 !border-[#3fA2A5] hover:!bg-gray-300 hover:!text-white">Cancel</button>
              </div>
              {!props.newEvent ? (
                <button onClick={toggleConfirmMsg} className="!bg-red-600 text-white hover:!bg-red-900"> Delete </button>
              ) : (
                <div></div>
              )}
            </div>
            {!props.newEvent && 
              <div className="flex w-full justify-center">
                <button 
                onClick={showVolunteerAssign} 
                className="!bg-[#3fA2A5] text-white hover:!bg-[#203e3f]"
                >
                  Manage Assignments
                </button>
              </div>
            }
          </form>
        </div>
      }
    </div>
  )
}

export default EventForm
