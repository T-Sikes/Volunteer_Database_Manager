import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EventManagementForm from "./pages/EventManagementForm.jsx"

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
                <Route path='/event-management' element={<EventManagementForm/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
