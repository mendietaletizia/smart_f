import './App.css'
import { useState } from 'react'
import { useAuth } from './hooks/useAuth.js'
import { AppRouter } from './routers/AppRouter.jsx'

function App() {
  const { user, loading, message, login, logout } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  
  if (loading) return <div className="card">Cargando...</div>
  
  return (
    <AppRouter 
      user={user} 
      onLogin={login} 
      onLogout={logout} 
      message={message}
      showRegister={showRegister}
      setShowRegister={setShowRegister}
    />
  )
}

export default App
