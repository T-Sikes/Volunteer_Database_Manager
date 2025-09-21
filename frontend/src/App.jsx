import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import EventManagement from "./pages/EventManagement.jsx"
import UserProfile from "./pages/UserProfile.jsx"
import VolunteerHistory from "./pages/VolunteerHistory.jsx"

function App() {
  return (
    <div className='App'>
      <Router>
        {/* Everything within the <Routes> tags are the pages of our website. The path attribute for the <Route> tag specifies 
        the path, which goes after the domain name. The element attribute is the main component of that page which is stored in the "pages"
        directory of the project */}
        <Routes>
                <Route path='/event-management' element={<EventManagement/>} />
                <Route path='/profile' element={<UserProfile/>} />
                <Route path='/volunteer-history' element={<VolunteerHistory/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
