import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X, TrendingUp, Zap, Shield, LogIn, Heart, Eye, Filter, Sparkles } from 'lucide-react'
import { listProducts } from '../api/products.js'
import { getCarrito, addToCarrito } from '../api/carrito.js'
import Carrito from '../components/Carrito.jsx'
import LoginModal from '../components/LoginModal.jsx'

export default function TiendaDashboardCSS({ user, onShowLogin, onShowRegister, onLoginSuccess, onNavigateToAdmin, onNavigateToCliente }) {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('Todos')
  const [cartCount, setCartCount] = useState(0)
  const [showCarrito, setShowCarrito] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [addingToCart, setAddingToCart] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadProductos()
    loadCartCount()
  }, [])

  async function loadProductos() {
    try {
      setLoading(true)
      setError('')
      const { items } = await listProducts()
      setProductos(items)
    } catch (e) {
      setError('No se pudo cargar el catálogo')
    } finally {
      setLoading(false)
    }
  }

  async function loadCartCount() {
    try {
      const carrito = await getCarrito()
      setCartCount(carrito.total_items)
    } catch (e) {
      setCartCount(0)
    }
  }

  async function handleAddToCart(productoId) {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    try {
      setAddingToCart(productoId)
      setError('')
      const result = await addToCarrito(productoId, 1)
      await loadCartCount()
      // Mostrar notificación de éxito
      if (result.message) {
        console.log('✅', result.message)
      }
    } catch (e) {
      console.error('Error adding to cart:', e)
      setError(e.message || 'Error al agregar al carrito')
    } finally {
      setAddingToCart(null)
    }
  }

  function handleLoginClick() {
    setShowLoginModal(true)
  }

  async function handleLoginSuccess(email, contrasena) {
    try {
      if (onLoginSuccess) {
        await onLoginSuccess(email, contrasena)
      }
      setShowLoginModal(false)
    } catch (error) {
      throw error
    }
  }

  const categories = ['Todos', ...new Set(productos.map(p => p.categoria).filter(Boolean))]
  
  const filteredProductos = productos.filter(p => {
    const matchText = (p.nombre + ' ' + (p.categoria || '')).toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = category === 'Todos' || p.categoria === category
    return matchText && matchCategory
  })

  return (
    <div className="tienda-moderna">
      {/* Header */}
      <header className="header-moderno animate-slide-down">
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo-container hover-lift">
              <div className="logo-icon shine-effect">
                <Zap className="logo-svg" />
              </div>
              <div>
                <h1 className="logo-title">SmartSales365</h1>
                <p className="logo-subtitle">Compra inteligente</p>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="search-desktop">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <Search className="search-icon" />
              </div>
            </div>

            {/* Actions */}
            <div className="header-actions">
              {/* Carrito */}
              <button
                onClick={() => setShowCarrito(true)}
                className="cart-button hover-lift"
              >
                <ShoppingCart className="cart-icon" />
                {cartCount > 0 && (
                  <span className="cart-badge animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Botones de Auth */}
              {!user ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="login-button"
                  >
                    <LogIn className="login-icon" />
                    <span>Iniciar sesión</span>
                  </button>
                  <button
                    onClick={onShowRegister}
                    className="register-button"
                  >
                    Registrarse
                  </button>
                </>
              ) : (
                <div className="user-menu">
                  <span className="user-greeting">
                    👋 Hola, {user.nombre}
                  </span>
                  {user.rol === 'Administrador' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="admin-button"
                    >
                      ⚙️ Admin
                    </button>
                  )}
                  {user.rol === 'Cliente' && (
                    <button
                      onClick={() => navigate('/cliente')}
                      className="client-button"
                    >
                      👤 Mi Cuenta
                    </button>
                  )}
                </div>
              )}

              {/* Menú móvil */}
              <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="mobile-menu-icon" /> : <Menu className="mobile-menu-icon" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="search-mobile">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-panel">
            <div className="mobile-menu-content">
              {!user ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="mobile-login-button"
                  >
                    <LogIn className="mobile-login-icon" />
                    <span className="mobile-login-text">Iniciar sesión</span>
                  </button>
                  <button
                    onClick={onShowRegister}
                    className="mobile-register-button"
                  >
                    Registrarse
                  </button>
                </>
              ) : (
                <div className="mobile-user-menu">
                  <div className="mobile-user-greeting">
                    👋 Hola, {user.nombre}
                  </div>
                  {user.rol === 'Administrador' && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="mobile-admin-button"
                    >
                      ⚙️ Panel de Administración
                    </button>
                  )}
                  {user.rol === 'Cliente' && (
                    <button
                      onClick={() => navigate('/cliente')}
                      className="mobile-client-button"
                    >
                      👤 Mi Cuenta
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Welcome Banner - Más pequeño y elegante */}
      <div className="welcome-banner animate-slide-up">
        <div className="welcome-container">
          <div className="welcome-content">
            <h2 className="welcome-title">
              ¡Bienvenido a SmartSales365! 🛍️
            </h2>
            <p className="welcome-description">
              Tu tienda inteligente de electrodomésticos con IA integrada
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="categories-section animate-fade-in">
        <div className="categories-container">
          <div className="categories-list">
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`category-button hover-lift ${
                  category === cat
                    ? 'category-button-active'
                    : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section animate-fade-in">
        <div className="products-header animate-slide-up">
          <div>
            <h3 className="products-title">
              Productos destacados
            </h3>
            <p className="products-count">
              {filteredProductos.length} productos encontrados
            </p>
          </div>
          <div className="sort-options-desktop">
            <span>Ordenar por:</span>
            <select className="sort-select">
              <option>Relevancia</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Nombre A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-message-box">
              <p className="error-message">❌ {error}</p>
            </div>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-message-box">
              <p className="empty-message">No se encontraron productos</p>
              <p className="empty-subtext">Intenta con otros términos de búsqueda</p>
            </div>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProductos.map((producto, index) => (
              <div
                key={producto.id}
                className="product-card hover-lift"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="product-image-container">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-placeholder">
                      <span className="placeholder-icon">📦</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="product-badges">
                    <span className="category-badge">
                      {producto.categoria || 'General'}
                    </span>

                    {producto.stock < 5 && (
                      <span className="stock-badge">
                        ¡Últimas unidades!
                      </span>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="product-actions">
                    <button className="action-button">
                      <Heart className="action-icon" />
                    </button>
                    <button className="action-button">
                      <Eye className="action-icon" />
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <h4 className="product-name">
                    {producto.nombre}
                  </h4>

                  <p className="product-description">
                    {producto.descripcion || 'Producto de calidad premium con garantía'}
                  </p>

                  <div className="product-price-section">
                    <div>
                      <p className="product-price">
                        Bs. {producto.precio.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="product-stock">
                        Stock: {producto.stock}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(producto.id)}
                    disabled={addingToCart === producto.id || producto.stock === 0}
                    className={`add-to-cart-button hover-lift ${
                      producto.stock === 0
                        ? 'disabled'
                        : addingToCart === producto.id
                        ? 'loading'
                        : ''
                    }`}
                  >
                    <ShoppingCart className="cart-icon" />
                    <span className="add-to-cart-text">
                      {addingToCart === producto.id
                        ? 'Agregando...'
                        : producto.stock === 0
                        ? 'Sin Stock'
                        : 'Añadir al carrito'
                      }
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-section">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-feature">
              <div className="footer-icon-wrapper purple-pink-gradient">
                <Zap className="footer-icon" />
              </div>
              <h4 className="footer-feature-title">IA Integrada</h4>
              <p className="footer-feature-description">
                Predicciones inteligentes y recomendaciones personalizadas para una experiencia de compra única
              </p>
            </div>
            <div className="footer-feature">
              <div className="footer-icon-wrapper green-emerald-gradient">
                <Shield className="footer-icon" />
              </div>
              <h4 className="footer-feature-title">Pago Seguro</h4>
              <p className="footer-feature-description">
                Procesamiento seguro con múltiples métodos de pago y protección de datos
              </p>
            </div>
            <div className="footer-feature">
              <div className="footer-icon-wrapper blue-cyan-gradient">
                <TrendingUp className="footer-icon" />
              </div>
              <h4 className="footer-feature-title">Mejores Precios</h4>
              <p className="footer-feature-description">
                Ofertas actualizadas y predicciones de precio para que siempre obtengas el mejor valor
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 SmartSales365. Todos los derechos reservados. Desarrollado con ❤️ para estudiantes universitarios.
            </p>
          </div>
        </div>
      </div>

      {/* Carrito */}
      <Carrito
        isOpen={showCarrito}
        onClose={() => setShowCarrito(false)}
      />

      {/* Modal de Login */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}