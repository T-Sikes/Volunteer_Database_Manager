import {useEffect} from "react"

const VolunteerPortalEvents = () => {
    const fetchEvents = async() => {
    const token = localStorage.getItem('token')
    try{
      const response = await fetch("http://127.0.0.1:8000/event/assigned-events/",{
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json()
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])
  return (
    <div>VolunteerPortalEvents</div>
  )
}

export default VolunteerPortalEvents