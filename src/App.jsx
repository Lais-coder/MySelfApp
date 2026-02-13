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

// Importando o componente principal do questionário
import Questionnaire from './components/Questionnaire/index'
import AdminNoFoodPlan from './pages/AdminNoFoodPlan'
import AdminInactiveUsers from './pages/AdminInactiveUsers'
import AdminAllUsers from './pages/AdminAllUsers'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#f9f4ff',
            color: '#333',
            border: '1px solid #7c64a4',
          }
        }}
      />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Questionário Unificado (Etapa 1 + Etapa 2) */}
        <Route
          path="/questionnaire"
          element={<ProtectedRoute><Questionnaire /></ProtectedRoute>}
        />

        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/no-food-plan" element={<ProtectedRoute><AdminNoFoodPlan /></ProtectedRoute>} />
        <Route path="/admin/inactive-users" element={<ProtectedRoute><AdminInactiveUsers /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminAllUsers /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/plano-alimentar" element={<ProtectedRoute><FoodPlan /></ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App