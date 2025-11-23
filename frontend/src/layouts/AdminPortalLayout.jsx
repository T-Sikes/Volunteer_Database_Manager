import { NavLink, Outlet } from "react-router-dom"

const AdminPortalLayout = () => {
  return (
    <div>
      <div className="fixed top-0 z-5 bg-white w-screen">
        <h1 className="text-center">Admin Portal</h1>
        <nav className="mt-5">
          <div className="flex justify-around pb-2">
            <NavLink to="volunteers"><span className="border-2 rounded-md p-1">Volunteers</span></NavLink>
            <NavLink to="event-management"><span className="border-2 rounded-md p-1">Event Management</span></NavLink>
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