import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AdminProducts from '../pages/AdminProducts.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import TiendaDashboardCSS from '../pages/TiendaDashboardCSS.jsx'
import AdminDashboard from '../pages/AdminDashboard.jsx'
import HistorialVentas from '../components/HistorialVentas.jsx'
import ReportesDinamicos from '../components/ReportesDinamicos.jsx'
import '../pages/TiendaDashboard.css'
import '../pages/ClienteDashboard.css'

// Componente interno que usa useNavigate
function AppRouterContent({ user, onLogin, onLogout, message, showRegister, setShowRegister, setUser }) {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState('tienda')

  // Componente para la vista de cliente
  const ClienteDashboard = () => (
    <div className="cliente-layout">
      <div className="cliente-header">
        <h1>Mi Cuenta</h1>
        <div className="cliente-nav">
          <button
            className={currentView === 'tienda' ? 'active' : ''}
            onClick={() => setCurrentView('tienda')}
          >
            🏪 Tienda
          </button>
          <button
            className={currentView === 'cliente' ? 'active' : ''}
            onClick={() => setCurrentView('cliente')}
          >
            👤 Mi Cuenta
          </button>
          <button
            className={currentView === 'historial' ? 'active' : ''}
            onClick={() => setCurrentView('historial')}
          >
            📊 Historial
          </button>
          <button
            className={currentView === 'reportes' ? 'active' : ''}
            onClick={() => setCurrentView('reportes')}
          >
            📈 Reportes
          </button>
          <button onClick={onLogout} className="btn-logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
      <div className="cliente-content">
        {currentView === 'historial' && <HistorialVentas />}
        {currentView === 'reportes' && <ReportesDinamicos />}
        {currentView === 'cliente' && (
          <>
        <h2>Panel del Cliente</h2>
        <p>Bienvenido, {user.nombre}!</p>
        <p>Aquí podrás gestionar tu perfil, ver tu historial de compras y más.</p>
        
        {/* Estadísticas del Cliente */}
        <div className="cliente-stats">
          <div className="cliente-stat-card">
            <div className="cliente-stat-icon">
              <span>🛒</span>
            </div>
            <p className="cliente-stat-title">Compras Totales</p>
            <p className="cliente-stat-value">12</p>
          </div>
          <div className="cliente-stat-card">
            <div className="cliente-stat-icon">
              <span>💰</span>
            </div>
            <p className="cliente-stat-title">Total Gastado</p>
            <p className="cliente-stat-value">Bs. 2,450</p>
          </div>
          <div className="cliente-stat-card">
            <div className="cliente-stat-icon">
              <span>⭐</span>
            </div>
            <p className="cliente-stat-title">Puntos</p>
            <p className="cliente-stat-value">245</p>
          </div>
          <div className="cliente-stat-card">
            <div className="cliente-stat-icon">
              <span>🎁</span>
            </div>
            <p className="cliente-stat-title">Descuentos</p>
            <p className="cliente-stat-value">3</p>
          </div>
        </div>

        {/* Información del Cliente */}
        <div className="cliente-info-cards">
          <div className="cliente-info-card">
            <div className="cliente-card-header">
              <div className="cliente-card-icon">
                <span>👤</span>
              </div>
              <h3 className="cliente-card-title">Información Personal</h3>
            </div>
            <div className="cliente-card-content">
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Miembro desde:</strong> Enero 2025</p>
              <p><strong>Estado:</strong> Activo</p>
            </div>
          </div>
          <div className="cliente-info-card">
            <div className="cliente-card-header">
              <div className="cliente-card-icon">
                <span>📱</span>
              </div>
              <h3 className="cliente-card-title">Contacto</h3>
            </div>
            <div className="cliente-card-content">
              <p><strong>Teléfono:</strong> +591 70123456</p>
              <p><strong>Dirección:</strong> La Paz, Bolivia</p>
              <p><strong>Método de pago:</strong> Tarjeta de crédito</p>
              <p><strong>Preferencias:</strong> Electrodomésticos</p>
            </div>
          </div>
        </div>

        {/* Historial de Compras */}
        <div className="cliente-purchase-history">
          <div className="cliente-history-header">
            <h3 className="cliente-history-title">Historial de Compras</h3>
            <button className="cliente-history-button">
              <span>Ver todo</span>
              <span>→</span>
            </button>
          </div>
          <div className="cliente-table-container">
            <table className="cliente-history-table">
              <thead>
                <tr className="cliente-history-header-row">
                  <th className="cliente-history-header-cell">Pedido</th>
                  <th className="cliente-history-header-cell">Fecha</th>
                  <th className="cliente-history-header-cell">Productos</th>
                  <th className="cliente-history-header-cell">Total</th>
                  <th className="cliente-history-header-cell">Estado</th>
                </tr>
              </thead>
              <tbody className="cliente-history-body">
                <tr className="cliente-history-row">
                  <td className="cliente-history-cell cliente-history-cell-bold">#V-2025-001</td>
                  <td className="cliente-history-cell">27/10/2025</td>
                  <td className="cliente-history-cell">3 productos</td>
                  <td className="cliente-history-cell cliente-history-cell-bold">Bs. 1,299.00</td>
                  <td className="cliente-history-cell">
                    <span className="cliente-history-status cliente-history-status-completado">
                      Completado
                    </span>
                  </td>
                </tr>
                <tr className="cliente-history-row">
                  <td className="cliente-history-cell cliente-history-cell-bold">#V-2025-002</td>
                  <td className="cliente-history-cell">25/10/2025</td>
                  <td className="cliente-history-cell">2 productos</td>
                  <td className="cliente-history-cell cliente-history-cell-bold">Bs. 899.00</td>
                  <td className="cliente-history-cell">
                    <span className="cliente-history-status cliente-history-status-en-proceso">
                      En proceso
                    </span>
                  </td>
                </tr>
                <tr className="cliente-history-row">
                  <td className="cliente-history-cell cliente-history-cell-bold">#V-2025-003</td>
                  <td className="cliente-history-cell">22/10/2025</td>
                  <td className="cliente-history-cell">1 producto</td>
                  <td className="cliente-history-cell cliente-history-cell-bold">Bs. 599.00</td>
                  <td className="cliente-history-cell">
                    <span className="cliente-history-status cliente-history-status-completado">
                      Completado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="cliente-quick-actions">
          <button className="cliente-quick-action cliente-quick-action-primary">
            <span className="cliente-quick-action-icon">🛒</span>
            <span>Realizar Compra</span>
          </button>
          <button className="cliente-quick-action cliente-quick-action-secondary">
            <span className="cliente-quick-action-icon">📋</span>
            <span>Ver Pedidos</span>
          </button>
          <button className="cliente-quick-action cliente-quick-action-secondary">
            <span className="cliente-quick-action-icon">⚙️</span>
            <span>Configuración</span>
          </button>
          <button className="cliente-quick-action cliente-quick-action-secondary">
            <span className="cliente-quick-action-icon">💬</span>
            <span>Soporte</span>
          </button>
        </div>
          </>
        )}
        {currentView === 'tienda' && (
          <div style={{ padding: '20px' }}>
            <p>Redirigiendo a la tienda...</p>
            <button onClick={() => navigate('/')}>Ir a Tienda</button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <Routes>
      {/* Ruta principal - Tienda */}
      <Route 
        path="/" 
        element={
          <TiendaDashboardCSS 
            user={user}
            onShowLogin={() => {/* Mostrar modal de login */}}
            onShowRegister={() => navigate('/register')}
            onLoginSuccess={onLogin}
            onNavigateToAdmin={() => navigate('/admin')}
            onNavigateToCliente={() => navigate('/cliente')}
          />
        } 
      />
      
      {/* Ruta de registro */}
      <Route 
        path="/register" 
        element={
          <RegisterPage 
            onCancel={() => navigate('/')} 
            onSuccess={(newUser) => {
              // Auto-login realizado por backend. Reflejamos el estado en el frontend y vamos a Mi Cuenta.
              if (setUser) setUser(newUser)
              navigate('/cliente')
            }}
          />
        } 
      />
      
      {/* Ruta de administrador */}
      <Route 
        path="/admin" 
        element={
          user && user.rol === 'Administrador' ? (
            <AdminDashboard 
              user={user}
              onLogout={onLogout}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      {/* Ruta de historial de ventas */}
      <Route 
        path="/historial" 
        element={
          user ? (
            <HistorialVentas />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      {/* Ruta de reportes dinámicos */}
      <Route 
        path="/reportes" 
        element={
          user ? (
            <ReportesDinamicos />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      {/* Ruta de cliente */}
      <Route 
        path="/cliente" 
        element={
          user && user.rol === 'Cliente' ? (
            <ClienteDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      
      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Componente principal que envuelve con BrowserRouter
export function AppRouter({ user, onLogin, onLogout, message, showRegister, setShowRegister, setUser }) {
  return (
    <BrowserRouter>
      <AppRouterContent 
        user={user} 
        onLogin={onLogin} 
        onLogout={onLogout} 
        message={message}
        showRegister={showRegister}
        setShowRegister={setShowRegister}
        setUser={setUser}
      />
    </BrowserRouter>
  )
}
