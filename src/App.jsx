import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import FoodPlan from './pages/FoodPlan'
import Calendar from './pages/Calendar'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plano-alimentar" element={<FoodPlan />} />
        <Route path="/calendario" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
