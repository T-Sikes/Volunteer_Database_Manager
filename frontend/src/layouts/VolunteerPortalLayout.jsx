import { NavLink, Outlet } from "react-router-dom"

const VolunteerPortalLayout = () => {
  return (
    <div>
      <div className="h-fit w-screen flex justify-center">
        <div className="fixed top-0 z-5 bg-white w-screen">
          <h1 className="text-center">Volunteer Portal</h1>
          <nav>
            <div className="flex justify-around">
              <NavLink to="profile"><span className="border-2 rounded-md p-1">Profile</span></NavLink>
              <NavLink to="events"><span className="border-2 rounded-md p-1">Your Events</span></NavLink>
              <NavLink to="volunteer-history"><span className="border-2 rounded-md p-1">Volunteer History</span></NavLink>
            </div>
          </nav>
        </div>
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