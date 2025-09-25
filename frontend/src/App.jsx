import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventManagement from "./pages/EventManagement.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import VolunteerHistory from "./pages/VolunteerHistory.jsx";
import VolunteerMatching from "./pages/VolunteerMatching.jsx";
import NotificationPage from "./pages/Notification.jsx";
import NotificationSystem from "./components/NotificationSystem.jsx";
import UserLogin from "./pages/UserLogin.jsx"

function App() {
  return (
    <div className="App">
      <Router>
        <NotificationSystem />
        <Routes>
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/volunteer-history" element={<VolunteerHistory />} />
          <Route path="/volunteer-matching" element={<VolunteerMatching />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path='/user-login' element={<UserLogin/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;