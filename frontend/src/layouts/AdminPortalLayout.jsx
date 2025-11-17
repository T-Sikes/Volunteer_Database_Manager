import { NavLink, Outlet } from "react-router-dom"

const AdminPortalLayout = () => {
  return (
    <div>
      <div className="h-fit w-screen flex justify-center">
        <div className="fixed top-0 z-10">
          <h1 className="text-center">Admin Portal</h1>
          <nav>
            <div className="flex justify-around">
              <NavLink to="volunteers"><span className="border-2 rounded-md p-1">Volunteers</span></NavLink>
              <NavLink to="event-management"><span className="border-2 rounded-md p-1">Event Management</span></NavLink>
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

export default AdminPortalLayout