import { useState } from 'react'
import { realizarCompra } from '../api/carrito.js'

export default function Checkout({ isOpen, onClose, carrito, onCompraExitosa }) {
  const [form, setForm] = useState({
    metodo_pago: 'efectivo',
    direccion_entrega: '',
    notas: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await realizarCompra(form)
      setSuccess(true)
      
      // Llamar callback de éxito después de un momento
      setTimeout(() => {
        if (onCompraExitosa) {
          onCompraExitosa(result.venta)
        }
        onClose()
      }, 2000)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    onClose()
  }

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🎉 ¡Compra Exitosa!</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="checkout-success">
            <p>✅ Tu compra ha sido procesada exitosamente</p>
            <p>📦 Los productos serán enviados a la dirección proporcionada</p>
            <p>📧 Recibirás un correo de confirmación</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Finalizar Compra</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="checkout-content">
          {/* Resumen del carrito */}
          <div className="checkout-summary">
            <h3>Resumen de tu compra</h3>
            <div className="summary-items">
              {carrito && carrito.items && carrito.items.map(item => (
                <div key={item.id} className="summary-item">
                  <span className="item-name">{item.producto_nombre}</span>
                  <span className="item-quantity">x{item.cantidad}</span>
                  <span className="item-price">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <strong>Total: ${carrito ? carrito.total_precio.toFixed(2) : '0.00'}</strong>
            </div>
          </div>

          {/* Formulario de checkout */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label>
                Método de Pago *
                <select 
                  value={form.metodo_pago} 
                  onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}
                  required
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                </select>
              </label>
            </div>

            <div className="form-group">
              <label>
                Dirección de Entrega *
                <textarea 
                  value={form.direccion_entrega} 
                  onChange={(e) => setForm({ ...form, direccion_entrega: e.target.value })}
                  placeholder="Calle, número, colonia, ciudad, código postal..."
                  rows="3"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Notas adicionales (opcional)
                <textarea 
                  value={form.notas} 
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  placeholder="Instrucciones especiales para la entrega..."
                  rows="2"
                />
              </label>
            </div>

            {error && (
              <div className="form-error">
                ❌ {error}
              </div>
            )}

            <div className="checkout-actions">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? '⏳ Procesando...' : '✅ Confirmar Compra'}
              </button>
              
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn-secondary"
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
