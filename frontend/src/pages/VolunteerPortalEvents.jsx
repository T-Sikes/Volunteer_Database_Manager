import {useEffect} from "react"
import AxiosInstance from "../components/AxiosInstance"

const VolunteerPortalEvents = () => {
    const fetchEvents = async() => {
      try{
        const response = await AxiosInstance.get("event/assigned-events/")
        const data = response.data
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