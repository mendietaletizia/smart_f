import { useState, useEffect } from 'react'
import { obtenerHistorialVentas } from '../api/historial.js'
import { descargarComprobantePDF } from '../api/comprobantes.js'
import './HistorialVentas.css'

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    estado: '',
    metodo_pago: '',
    page: 1,
    page_size: 20
  })
  const [paginacion, setPaginacion] = useState(null)
  const [estadisticas, setEstadisticas] = useState(null)

  useEffect(() => {
    cargarHistorial()
  }, [filtros])

  async function cargarHistorial() {
    setLoading(true)
    setError('')
    try {
      const data = await obtenerHistorialVentas(filtros)
      setVentas(data.ventas || [])
      setPaginacion(data.paginacion)
      setEstadisticas(data.estadisticas)
    } catch (err) {
      setError(err.message || 'Error al cargar historial')
    } finally {
      setLoading(false)
    }
  }

  function handleFiltroChange(e) {
    const { name, value } = e.target
    setFiltros(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Resetear a primera página
    }))
  }

  function cambiarPagina(page) {
    setFiltros(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="historial-container">
      <h1>Historial de Ventas</h1>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="historial-stats">
          <div className="stat-card">
            <div className="stat-label">Total Ventas</div>
            <div className="stat-value">{estadisticas.total_ventas}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Monto Total</div>
            <div className="stat-value">${estadisticas.total_monto.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completadas</div>
            <div className="stat-value">{estadisticas.ventas_completadas}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pendientes</div>
            <div className="stat-value">{estadisticas.ventas_pendientes}</div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="historial-filtros">
        <div className="filtro-group">
          <label>Fecha Desde</label>
          <input
            type="date"
            name="fecha_desde"
            value={filtros.fecha_desde}
            onChange={handleFiltroChange}
          />
        </div>
        <div className="filtro-group">
          <label>Fecha Hasta</label>
          <input
            type="date"
            name="fecha_hasta"
            value={filtros.fecha_hasta}
            onChange={handleFiltroChange}
          />
        </div>
        <div className="filtro-group">
          <label>Estado</label>
          <select
            name="estado"
            value={filtros.estado}
            onChange={handleFiltroChange}
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div className="filtro-group">
          <label>Método de Pago</label>
          <select
            name="metodo_pago"
            value={filtros.metodo_pago}
            onChange={handleFiltroChange}
          >
            <option value="">Todos</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta_credito">Tarjeta de Crédito</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <button className="btn-limpiar" onClick={() => setFiltros({
          fecha_desde: '',
          fecha_hasta: '',
          estado: '',
          metodo_pago: '',
          page: 1,
          page_size: 20
        })}>
          Limpiar Filtros
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="historial-error">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="historial-loading">
          Cargando historial...
        </div>
      )}

      {/* Tabla de Ventas */}
      {!loading && ventas.length === 0 && !error && (
        <div className="historial-empty">
          No se encontraron ventas con los filtros seleccionados.
        </div>
      )}

      {!loading && ventas.length > 0 && (
        <>
          <div className="historial-table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Método Pago</th>
                  <th>Productos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map(venta => (
                  <tr key={venta.id}>
                    <td>#{venta.id}</td>
                    <td>{formatearFecha(venta.fecha)}</td>
                    <td>
                      <div>
                        <div>{venta.cliente.nombre}</div>
                        <div className="cliente-email">{venta.cliente.email}</div>
                      </div>
                    </td>
                    <td>${venta.total.toFixed(2)}</td>
                    <td>
                      <span className={`estado-badge estado-${venta.estado}`}>
                        {venta.estado}
                      </span>
                    </td>
                    <td>{venta.metodo_pago.replace('_', ' ')}</td>
                    <td>{venta.productos_count}</td>
                    <td>
                      <div className="acciones-buttons">
                        {venta.comprobante?.existe && (
                          <button
                            className="btn-descargar"
                            onClick={() => descargarComprobantePDF(venta.id)}
                            title="Descargar Comprobante"
                          >
                            📄
                          </button>
                        )}
                        {venta.pago_online?.existe && (
                          <span className="pago-badge" title={`Pago: ${venta.pago_online.estado}`}>
                            💳
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {paginacion && paginacion.total_pages > 1 && (
            <div className="historial-paginacion">
              <button
                onClick={() => cambiarPagina(paginacion.page - 1)}
                disabled={!paginacion.has_previous}
                className="btn-pagina"
              >
                Anterior
              </button>
              <span className="paginacion-info">
                Página {paginacion.page} de {paginacion.total_pages}
              </span>
              <button
                onClick={() => cambiarPagina(paginacion.page + 1)}
                disabled={!paginacion.has_next}
                className="btn-pagina"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}


