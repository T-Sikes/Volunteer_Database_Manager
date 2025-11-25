import { useState, useEffect } from "react";
import {formatInTimeZone} from 'date-fns-tz';

function UserProfileForm({ submitProfile, closeForm, initialData }) {
  //------------- form state -------------
  const [fullName, setFullName] = useState(initialData?.full_name || '');
  const [address1, setAddress1] = useState(initialData?.address1 || '');
  const [address2, setAddress2] = useState(initialData?.address2 || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [state ,setState] = useState(initialData?.state || '');
  const [zip, setZip] = useState(initialData?.zip_code || '');
  const [skills, setSkills] = useState(initialData?.skills || []);
  const [preferences, setPreferences] = useState(initialData?.preferences || '');
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const [availability, setAvailability] = useState({
      monday: { available: false, start: '09:00', end: '17:00' },
      tuesday: { available: false, start: '09:00', end: '17:00' },
      wednesday: { available: false, start: '09:00', end: '17:00' },
      thursday: { available: false, start: '09:00', end: '17:00' },
      friday: { available: false, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '09:00', end: '17:00' },
      sunday: { available: false, start: '09:00', end: '17:00' }
  });
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
 

useEffect(() => {
    if (initialData) {
      setFullName(initialData.full_name || '');
      setAddress1(initialData.address1 || '');
      setAddress2(initialData.address2 || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      setZip(initialData.zip_code || '');
      setSkills(initialData.skills || []);
      setPreferences(initialData.preferences || '');
       // Convert UTC availability to local time
      if (initialData.availability) {
        console.log('Converting UTC to local:', initialData.availability);
        const localAvailability = {};
        for (const [day, dayData] of Object.entries(initialData.availability)) {
          if (dayData.available) {
            const localStart = formatInTimeZone(
              new Date(`1970-01-01T${dayData.start}:00Z`),
              userTimeZone,
              'HH:mm'
            );
            const localEnd = formatInTimeZone(
              new Date(`1970-01-01T${dayData.end}:00Z`),
              userTimeZone,
              'HH:mm'
            );
            
            console.log(`${day}: UTC ${dayData.start}-${dayData.end} -> Local ${localStart}-${localEnd}`);
            
            localAvailability[day] = {
              available: true,
              start: localStart,
              end: localEnd
            };
          } else {
            localAvailability[day] = { available: false };
          }
        }
        console.log('Setting converted availability:', localAvailability);
        setAvailability(localAvailability);
      }
    }
  }, [initialData, userTimeZone]);


  useEffect(() => {
  console.log('Initial availability data:', initialData?.availability);
}, [initialData]);

 useEffect(() => {
    console.log('Current availability state:', availability);
  }, [availability]);

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

    // Validation
    if (!fullName) return alert('Full Name is required');
    if (!address1) return alert('Address 1 is required');
    if (!city) return alert('City is required');
    if (!state) return alert('State is required');
    if (!zip || zip.length < 5) return alert('Zip code must be at least 5 characters');
    if (skills.length === 0) return alert('Select at least one skill');

    const availableDays = Object.values(availability).filter(day => day.available).length;
    if (availableDays === 0) return alert('Select at least one available day');
    
    // Convert local times back to UTC for storage
    const formattedAvailability = {};
    for (const [day, dayData] of Object.entries(availability)) {
      if (dayData.available) {
        formattedAvailability[day] = {
          available: true,
          start: formatInTimeZone(new Date(`1970-01-01T${dayData.start}:00`), 'UTC', 'HH:mm'),
          end: formatInTimeZone(new Date(`1970-01-01T${dayData.end}:00`), 'UTC', 'HH:mm')
        };
      } else {
        formattedAvailability[day] = { available: false };
      }
    }

    // Send data to parent
    submitProfile({ 
      full_name: fullName, 
      address1, 
      address2, 
      city, 
      state, 
      zip_code: zip, 
      skills, 
      preferences, 
      availability: formattedAvailability 
    });
  }

  const handleCancel = (e) => {
    e.preventDefault();
    closeForm();
  }

  const handleSkillsChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSkills(value);
  }

 

  return (
  <div className='flex justify-center items-start min-h-screen bg-gray-100 w-screen py-10 pt-20'>
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

                {/* Weekly Availability */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Weekly Availability*</label>
          
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
            <div key={day} className="flex items-center justify-between mb-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
              <span className="capitalize font-medium w-24 text-gray-800">{day}</span>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={availability[day]?.available || false}
                  onChange={(e) => {
                    const newAvailability = {...availability};
                    newAvailability[day] = {
                      ...newAvailability[day],
                      available: e.target.checked,
                      start: e.target.checked ? (newAvailability[day]?.start || '09:00') : '',
                      end: e.target.checked ? (newAvailability[day]?.end || '17:00') : ''
                    };
                    setAvailability(newAvailability);
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Available</span>
              </label>

              {availability[day]?.available && (
                <div className="flex items-center space-x-3">
                  <input
                    type="time"
                    value={availability[day]?.start || '09:00'}
                    onChange={(e) => {
                      const newAvailability = {...availability};
                      newAvailability[day] = {
                        ...newAvailability[day],
                        start: e.target.value
                      };
                      setAvailability(newAvailability);
                    }}
                    className="border border-gray-300 rounded-md p-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="time"
                    value={availability[day]?.end || '17:00'}
                    onChange={(e) => {
                      const newAvailability = {...availability};
                      newAvailability[day] = {
                        ...newAvailability[day],
                        end: e.target.value
                      };
                      setAvailability(newAvailability);
                    }}
                    className="border border-gray-300 rounded-md p-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          ))}
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