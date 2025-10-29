import { useState } from 'react'
import Register from '../components/Register.jsx'

export default function RegisterPage({ onCancel, onSuccess }) {
  const [showSuccess, setShowSuccess] = useState(false)

  function handleRegisterSuccess(user) {
    setShowSuccess(true)
    // Llamar callback de éxito después de 2 segundos
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(user)
      }
    }, 2000)
  }

  function handleCancel() {
    if (onCancel) {
      onCancel()
    }
  }

  if (showSuccess) {
    return (
      <div className="register-form">
        <div className="form-header">
          <h2>🎉 ¡Cuenta Creada!</h2>
          <p>Tu cuenta de cliente ha sido creada exitosamente.</p>
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="shop">
      <div className="card" style={{ background: '#f0f9ff', border: '2px solid #0ea5e9', marginBottom: 24 }}>
        <h1>🛒 SmartSales365</h1>
        <p>Regístrate para acceder a todas las funcionalidades de nuestra tienda</p>
      </div>
      
      <Register 
        onSuccess={handleRegisterSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
