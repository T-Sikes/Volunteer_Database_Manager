import { NavLink, Outlet } from "react-router-dom"

const VolunteerPortalLayout = () => {
  return (
    <div>
      <div className="fixed top-0 z-10 bg-white w-screen">
        <h1 className="text-center">Volunteer Portal</h1>
        <nav className="mt-5">
          <div className="flex justify-around pb-2">
            <NavLink to="profile"><span className="border-2 rounded-md p-1">Profile</span></NavLink>
            <NavLink to="events"><span className="border-2 rounded-md p-1">Event Calendar</span></NavLink>
            <NavLink to="volunteer-history"><span className="border-2 rounded-md p-1">Volunteer History</span></NavLink>
            <NavLink to="notifications"><span className="border-2 rounded-md p-1">Notifications</span></NavLink>
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