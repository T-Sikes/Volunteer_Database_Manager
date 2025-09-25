import { useState } from "react";

function UserProfileForm(props) {
  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state ,setState] = useState('');
  const [zip, setZip] = useState('');
  const [skills, setSkills] = useState('');
  const [preferences, setPreferences] = useState('');
  const [availability, setAvailability] = useState([]);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');




const allSkills = ["JavaScript", "Python", "C++", "Customer Service", "Microsoft Office", "Leadership", "SQL"];
const allStates = [
    { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
    { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
    { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" }, { code: "DE", name: "Deleware" },
    { code: "Fl", name: "Florida" }, { code: "GA", name: "Georgia" },
    { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinios" }, { code: "IN", name: "Indiana" },
    { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" },
    { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
    { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" },
    { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
    { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" },
    { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
    { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" },
    { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
    { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" },
    { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
    { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" },
    { code: "WA", name: "Washingotn" }, { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconson" }, { code: "WY", name: "Wyoming" },
]


  const handleSubmit = (e) => {
    e.preventDefault();

    //validation
    if (!fullName) return alert('Full Name is required');
    if (!address1) return alert('Address 1 is required');
    if (!city) return alert('City is required');
    if (!state) return alert('State is required');
    if (!zip || zip.length < 5) return alert('Zip code must be at least 5 characters');
    if (skills.length === 0) return alert('Select at least one skill');
    if (availability.length === 0) return alert('Select at least one availability date');


    // send data to parent
    props.submitProfile({ fullName, address1, address2, city, state, zip, skills, preferences, availability});
  }

  const handleCancel = (e) => {
    e.preventDefault();
    props.closeForm();
  }

  const handleSkillsChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSkills(value);
  }

   const handleAvailabilityChange = (e) => {
    const value = e.target.value; // YYYY-MM-DD
    if (!availability.includes(value)) {
      setAvailability([...availability, value]);
    }
  }


  return (
  <div className='flex justify-center items-start min-h-screen bg-gray-100 w-screen py-10' >
    <form className="bg-white p-6 rounded-lg shadow-md w-96 flex flex-col space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">User Profile</h1>


        {/* Full Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Full Name*</label>
          <input 
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              maxLength={50}
              className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
          />
        </div>

        {/* Address 1 */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Address 1*</label>
          <input           
              type="text"
              value={address1}
              onChange={e => setAddress1(e.target.value)}
              maxLength={100}
              className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
          />
        </div>


        {/* Address 2*/}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Address 2</label>
          <input 
            type="text"
            value={address2}
            onChange={e => setAddress2(e.target.value)}
            maxLength={100}
            className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
          />
        </div>


        {/* City */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">City*</label>
          <input 
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            maxLength={100}
            className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
          />
        </div>

         {/* State Dropdown */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">State*</label>
          <select 
            value={state}
            onChange={e => setState(e.target.value)}
            className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
          >
            <option value="">Select a state</option>
            {allStates.map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Zip code */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Zip Code*</label>
          <input 
            type="text"
            value={zip}
            onChange={e => setZip(e.target.value)}
            maxLength={9}
            className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
          />
        </div>

        {/* Skills multi-select */}
        <div className="flex flex-col relative">
        <label className="mb-1 font-medium text-gray-700">Skills*</label>

        {/* Dropdown toggle */}
        <div 
            className="border-2 rounded-xl border-gray-500 p-2 bg-white cursor-pointer text-black"
            onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)}
        >
            {skills.length > 0 ? skills.join(', ') : 'Select skills'}
        </div>

        {/* Dropdown options */}
        {skillsDropdownOpen && (
            <div className="border-2 border-gray-500 bg-white rounded-xl mt-1 max-h-40 overflow-y-auto p-2 z-10 relative">
            {allSkills.map(skill => (
                <label key={skill} className="flex items-center space-x-2 mb-1">
                <input
                    type="checkbox"
                    checked={skills.includes(skill)}
                    onChange={() => {
                    if (skills.includes(skill)) {
                        setSkills(skills.filter(s => s !== skill));
                    } else {
                        setSkills([...skills, skill]);
                    }
                    }}
                />
                <span className="text-black">{skill}</span>
                </label>
            ))}
            </div>
        )}
        </div>

        {/* Preferences textarea */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Preferences</label>
          <textarea 
            value={preferences}
            onChange={e => setPreferences(e.target.value)}
            maxLength={500}
            className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
          />
        </div>

        {/* Availability date picker (multiple dates allowed) */}
        <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Availability*</label>
        <div className="flex space-x-2 mb-2">
            <input 
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border-2 rounded-xl border-gray-500 p-2 text-gray-900 bg-white"
            />
            <button
            type="button"
            onClick={() => {
                if (selectedDate && !availability.includes(selectedDate)) {
                setAvailability([...availability, selectedDate]);
                setSelectedDate('');
                }
            }}
            style={{ backgroundColor: '#3fa2a5', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'black' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3fa2a5' }}
            className="bg-[#3fa2a5] text-white px-3 rounded hover:bg-black transition-colors duration-200"
            >
            Add
            </button>
        </div>

        {/* Show added dates */}
        {availability.length > 0 && (
            <p className="text-sm text-gray-700">Selected: {availability.join(', ')}</p>
        )}
        </div>


        <div className="flex justify-between mt-4">

          <button onClick={handleSubmit} 
            style={{ backgroundColor: '#3fa2a5', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'black' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3fa2a5' }}
            className="text-white px-4 py-2 rounded w-1/2 mr-2">
              Save
          </button>

          <button
            onClick={handleCancel}
            style={{ backgroundColor: '#3fa2a5', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'black' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3fa2a5' }}
            className="px-4 py-2 rounded w-1/2 ml-2"
          >
            Cancel
          </button>

        </div>
    </form>
  </div>
);
}

export default UserProfileForm;