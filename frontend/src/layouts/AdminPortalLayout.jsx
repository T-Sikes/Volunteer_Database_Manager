import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { logoutUser } from "../components/UserLogin/Authentication"

const AdminPortalLayout = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate("/user-login")
  }

  return (
    <div>
      <div className="fixed top-0 z-10 bg-[#3fA2A5] w-screen">
        <p className="text-center text-white text-4xl">Admin Portal</p>
        <nav className="mt-3">
          <div className="flex justify-evenly pb-6">
            <NavLink to="profile"><span className="border-2 rounded-md p-1 text-white">Profile</span></NavLink>
            <NavLink to="volunteers"><span className="border-2 rounded-md p-1 text-white">Volunteers</span></NavLink>
            <NavLink to="event-management"><span className="border-2 rounded-md p-1 text-white">Event Management</span></NavLink>
            <NavLink to="volunteer-matching"><span className="border-2 rounded-md p-1 text-white">Volunteer Matching</span></NavLink>
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

export default AdminPortalLayout