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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Rotas Protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* ETAPA 1: Dados Pessoais */}
        <Route 
          path="/questionnaire/personal" 
          element={<ProtectedRoute><Questionnaire type="personal" /></ProtectedRoute>} 
        />

        {/* ETAPA 2: Saúde e Alimentação */}
        <Route 
          path="/questionnaire/health" 
          element={<ProtectedRoute><Questionnaire type="health" /></ProtectedRoute>} 
        />

        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/plano-alimentar" element={<ProtectedRoute><FoodPlan /></ProtectedRoute>} />
        <Route path="/calendario" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App