import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import FoodPlan from './pages/FoodPlan'
import Calendar from './pages/Calendar'
import ProtectedRoute from './components/Common/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/questionnaire" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/plano-alimentar" element={<ProtectedRoute><FoodPlan /></ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
