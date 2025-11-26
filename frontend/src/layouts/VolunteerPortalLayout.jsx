import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { logoutUser } from "../components/UserLogin/Authentication"

const VolunteerPortalLayout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate("/user-login")
  }

  return (
    <div>
      <div className="fixed top-0 z-10 bg-[#3fA2A5] w-screen">
        <p className="text-center text-white text-4xl">Volunteer Portal</p>
        <nav className="mt-4">
          <div className="flex justify-evenly pb-6">
            <NavLink to="profile"><span className="border-2 rounded-md p-1 text-white">Profile</span></NavLink>
            <NavLink to="events"><span className="border-2 rounded-md p-1 text-white">Event Calendar</span></NavLink>
            <NavLink to="volunteer-history"><span className="border-2 rounded-md p-1 text-white">Volunteer History</span></NavLink>
            <NavLink to="notifications"><span className="border-2 rounded-md p-1 text-white">Notifications</span></NavLink>
            <span onClick={handleLogout} className="cursor-pointer"><span className="border-2 rounded-md p-1 text-white">Logout</span></span>
          </div>
        </nav>
      </div>

      <main>
        <div className="mt-32">
          <Outlet/>
        </div>
      </main>
    </div>
  )
}

export default VolunteerPortalLayout
