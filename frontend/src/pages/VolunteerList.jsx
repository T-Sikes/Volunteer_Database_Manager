import React, { useEffect, useState } from 'react'

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([])

  useEffect(() => {
    fetchVolunteers()
  },[])

  const fetchVolunteers = async() => {
    try{
      const response = await fetch("http://127.0.0.1:8000/event/volunteers/")
      const data = await response.json()
      setVolunteers(data)
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className="min-h-screen min-w-screen flex justify-center">
      <div>
        <h2 className="text-2xl text-center">Volunteers</h2>
        <div className="w-2xl">
          {volunteers.map(volunteer => (
            <div key={volunteer.id} className="px-2">
              <p className="text-lg">{volunteer.name} (ID: {volunteer.id})</p>
              <hr/>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default VolunteerList