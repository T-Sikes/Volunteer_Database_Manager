import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventManagement from "./pages/EventManagement.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import VolunteerHistory from "./pages/VolunteerHistory.jsx";
import VolunteerMatching from "./pages/VolunteerMatching.jsx";
import NotificationSystem from "./components/NotificationSystem.jsx";
import UserLogin from "./pages/UserLogin.jsx"
import AdminPortalLayout from "./layouts/AdminPortalLayout.jsx";
import VolunteerList from "./pages/VolunteerList.jsx";
import VolunteerPortalEvents from "./pages/VolunteerPortalEvents.jsx";
import Home from "./pages/Home.jsx";
import VolunteerPortalLayout from "./layouts/VolunteerPortalLayout.jsx";
import VolunteerNotifications from "./pages/VolunteerNotifications.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <NotificationSystem />
        <Routes>
          {/* No home page for now */}
          {/* <Route path="/" element={<Home/>} /> */}
          <Route path="/volunteer-matching" element={<VolunteerMatching />} />
          <Route path="/user-login" element={<UserLogin />} />

          {/* Roots for volunteer portal */}
          <Route path="/portal/" element={<VolunteerPortalLayout />}>
            <Route path="profile" element={<UserProfile/>}/>
            <Route path="events" element={<VolunteerPortalEvents/>}/>
            <Route path="volunteer-history" element={<VolunteerHistory/>}/>
            <Route path="notifications" element={<VolunteerNotifications/>}/>
          </Route>

          {/* Routes for admin portal */}
          <Route path="/portal/admin" element={<AdminPortalLayout />}>
            <Route path="profile" element={<UserProfile/>}/>
            <Route path="event-management" element={<EventManagement/>}/>
            <Route path="volunteers" element={<VolunteerList/>}/>
            <Route path="volunteer-matching" element={<VolunteerMatching />} />
          </Route>
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;