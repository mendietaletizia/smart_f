import { useEffect, useState } from 'react'
import { getCarrito, updateItemCarrito, removeFromCarrito, clearCarrito, saveForLater, applyDiscount } from '../api/carrito.js'
import Checkout from './Checkout.jsx'

export default function Carrito({ isOpen, onClose }) {
  const [carrito, setCarrito] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDiscountForm, setShowDiscountForm] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)

  async function loadCarrito() {
    try {
      setLoading(true)
      setError('')
      const data = await getCarrito()
      setCarrito(data)
    } catch (e) {
      setError('Error al cargar carrito: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadCarrito()
    }
  }, [isOpen])

  async function handleUpdateQuantity(itemId, newQuantity) {
    try {
      setLoading(true)
      await updateItemCarrito(itemId, newQuantity)
      await loadCarrito()
    } catch (e) {
      setError('Error al actualizar cantidad: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveItem(itemId) {
    try {
      setLoading(true)
      await removeFromCarrito(itemId)
      await loadCarrito()
    } catch (e) {
      setError('Error al eliminar producto: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  // CU9: Funciones de gestión avanzada
  async function handleClearCarrito() {
    if (!confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) return
    
    try {
      setLoading(true)
      await clearCarrito()
      await loadCarrito()
    } catch (e) {
      setError('Error al limpiar carrito: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveForLater(itemId) {
    try {
      setLoading(true)
      await saveForLater(itemId)
      await loadCarrito()
    } catch (e) {
      setError('Error al guardar para más tarde: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleApplyDiscount() {
    if (!discountCode.trim()) {
      setError('Por favor ingresa un código de descuento')
      return
    }
    
    try {
      setLoading(true)
      await applyDiscount(discountCode.trim())
      setDiscountCode('')
      setShowDiscountForm(false)
      await loadCarrito()
    } catch (e) {
      setError('Error al aplicar descuento: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="carrito-overlay" onClick={onClose}>
      <div className="carrito-panel" onClick={e => e.stopPropagation()}>
        <div className="carrito-header">
          <h2>🛒 Mi Carrito</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {loading && <div className="loading">Cargando carrito...</div>}
        {error && <div className="error">{error}</div>}

        {carrito && (
          <>
            <div className="carrito-summary">
              <div className="summary-item">
                <span>Total items:</span>
                <span className="total-items">{carrito.total_items}</span>
              </div>
              <div className="summary-item">
                <span>Total:</span>
                <span className="total-price">${carrito.total_precio.toFixed(2)}</span>
              </div>
            </div>

            <div className="carrito-items">
              {carrito.items.length === 0 ? (
                <div className="empty-cart">
                  <p>Tu carrito está vacío</p>
                  <p>¡Agrega algunos productos!</p>
                </div>
              ) : (
                carrito.items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      {item.producto_imagen ? (
                        <img src={item.producto_imagen} alt={item.producto_nombre} />
                      ) : (
                        <div className="placeholder-image">📦</div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.producto_nombre}</h4>
                      <p className="item-price">${item.precio_unitario.toFixed(2)} c/u</p>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                          disabled={loading || item.cantidad <= 1}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.cantidad}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                          disabled={loading}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="item-subtotal">
                        ${item.subtotal.toFixed(2)}
                      </div>
                      
                      <div className="item-actions">
                        <button 
                          onClick={() => handleSaveForLater(item.id)}
                          disabled={loading}
                          className="save-btn"
                          title="Guardar para más tarde"
                        >
                          💾
                        </button>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                          className="remove-btn"
                          title="Eliminar del carrito"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {carrito.items.length > 0 && (
              <>
                {/* CU9: Sección de gestión avanzada */}
                <div className="carrito-management">
                  <h4>Gestión del Carrito</h4>
                  
                  <div className="management-actions">
                    <button 
                      onClick={() => setShowDiscountForm(!showDiscountForm)}
                      className="btn-secondary"
                    >
                      🎟️ Aplicar Descuento
                    </button>
                    
                    <button 
                      onClick={handleClearCarrito}
                      disabled={loading}
                      className="btn-danger"
                    >
                      🗑️ Limpiar Carrito
                    </button>
                  </div>

                  {showDiscountForm && (
                    <div className="discount-form">
                      <div className="form-group">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Código de descuento (ej: DESCUENTO10)"
                          className="form-input"
                        />
                        <button 
                          onClick={handleApplyDiscount}
                          disabled={loading}
                          className="btn-primary"
                        >
                          Aplicar
                        </button>
                      </div>
                      <p className="discount-info">
                        Códigos válidos: DESCUENTO10, WELCOME10, PRIMERA10
                      </p>
                    </div>
                  )}
                </div>

                <div className="carrito-footer">
                  <button 
                    className="btn-primary btn-large"
                    onClick={() => setShowCheckout(true)}
                  >
                    🛒 Proceder al Checkout
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modal de Checkout */}
      <Checkout 
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        carrito={carrito}
        onCompraExitosa={() => {
          setShowCheckout(false)
          onClose()
        }}
      />
    </div>
  )
}
