import { useState, useEffect, useRef } from 'react'
import { solicitarReporte, obtenerFiltrosInteligentes, listarReportes, descargarReporte } from '../api/reportes.js'
import './ReportesDinamicos.css'

export default function ReportesDinamicos() {
  const [texto, setTexto] = useState('')
  const [grabando, setGrabando] = useState(false)
  const [reporte, setReporte] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sugerencias, setSugerencias] = useState([])
  const [reportesLista, setReportesLista] = useState([])
  const [mostrarHistorial, setMostrarHistorial] = useState(false)
  
  const recognitionRef = useRef(null)
  const mediaRecorderRef = useRef(null)

  useEffect(() => {
    // Inicializar Web Speech API si está disponible
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'es-ES'
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setTexto(prev => prev + ' ' + transcript)
        setGrabando(false)
      }
      
      recognitionRef.current.onerror = () => {
        setGrabando(false)
        setError('Error al reconocer voz. Intenta nuevamente.')
      }
    }
    
    cargarReportes()
  }, [])

  async function cargarReportes() {
    try {
      const lista = await listarReportes()
      setReportesLista(lista)
    } catch (err) {
      console.error('Error al cargar reportes:', err)
    }
  }

  function iniciarGrabacion() {
    if (!recognitionRef.current) {
      setError('El reconocimiento de voz no está disponible en tu navegador')
      return
    }

    try {
      recognitionRef.current.start()
      setGrabando(true)
      setError('')
    } catch (err) {
      setError('Error al iniciar grabación')
      setGrabando(false)
    }
  }

  function detenerGrabacion() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setGrabando(false)
    }
  }

  async function handleSolicitarReporte() {
    if (!texto.trim()) {
      setError('Por favor ingresa una solicitud')
      return
    }

    setLoading(true)
    setError('')
    setReporte(null)

    try {
      const resultado = await solicitarReporte(texto)
      setReporte(resultado)
      
      // Obtener filtros inteligentes
      if (resultado.tipo) {
        try {
          const filtros = await obtenerFiltrosInteligentes(resultado.tipo)
          setSugerencias(filtros)
        } catch (err) {
          console.error('Error al obtener filtros:', err)
        }
      }
      
      // Recargar lista de reportes
      cargarReportes()
    } catch (err) {
      setError(err.message || 'Error al generar reporte')
    } finally {
      setLoading(false)
    }
  }

  function renderizarDatos(datos) {
    if (!datos || typeof datos !== 'object') {
      return <pre>{JSON.stringify(datos, null, 2)}</pre>
    }

    // Si tiene array de datos
    if (datos.datos && Array.isArray(datos.datos)) {
      if (datos.datos.length === 0) {
        return <p className="reporte-vacio">No hay datos para mostrar</p>
      }

      return (
        <div className="reporte-tabla-container">
          <table className="reporte-tabla">
            <thead>
              <tr>
                {Object.keys(datos.datos[0]).map(key => (
                  <th key={key}>{key.replace(/_/g, ' ').toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datos.datos.map((item, idx) => (
                <tr key={idx}>
                  {Object.values(item).map((valor, vIdx) => (
                    <td key={vIdx}>
                      {typeof valor === 'number' && valor % 1 !== 0
                        ? valor.toFixed(2)
                        : String(valor)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    // Datos estructurados
    return (
      <div className="reporte-estructurado">
        {Object.entries(datos).map(([key, value]) => (
          <div key={key} className="reporte-campo">
            <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong>
            {typeof value === 'object' ? (
              <pre>{JSON.stringify(value, null, 2)}</pre>
            ) : (
              <span>{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="reportes-container">
      <h1>Reportes Dinámicos</h1>

      {/* Panel de Solicitud */}
      <div className="reportes-solicitud">
        <div className="solicitud-header">
          <h2>Solicitar Reporte</h2>
          <button
            className="btn-historial"
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
          >
            {mostrarHistorial ? 'Ocultar' : 'Ver'} Historial
          </button>
        </div>

        <div className="solicitud-input-container">
          <textarea
            className="solicitud-texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ejemplo: Reporte de ventas del último mes agrupado por categoría en PDF"
            rows={4}
          />
          <div className="solicitud-acciones">
            <button
              className={`btn-voz ${grabando ? 'grabando' : ''}`}
              onClick={grabando ? detenerGrabacion : iniciarGrabacion}
              disabled={!recognitionRef.current}
              title={grabando ? 'Detener grabación' : 'Grabar voz'}
            >
              {grabando ? '⏹️ Detener' : '🎤 Grabar Voz'}
            </button>
            <button
              className="btn-solicitar"
              onClick={handleSolicitarReporte}
              disabled={loading || !texto.trim()}
            >
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>
          </div>
        </div>

        {error && (
          <div className="reporte-error">
            {error}
          </div>
        )}

        {/* Sugerencias de Filtros Inteligentes */}
        {sugerencias.length > 0 && (
          <div className="filtros-sugerencias">
            <h3>💡 Filtros Sugeridos</h3>
            <div className="sugerencias-lista">
              {sugerencias.map((sug, idx) => (
                <div key={idx} className="sugerencia-item">
                  <strong>{sug.filtro}:</strong> {sug.valor}
                  <span className="sugerencia-razon">{sug.razon}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Historial de Reportes */}
      {mostrarHistorial && (
        <div className="reportes-historial">
          <h3>Historial de Reportes</h3>
          {reportesLista.length === 0 ? (
            <p>No hay reportes generados</p>
          ) : (
            <div className="historial-lista">
              {reportesLista.map(repo => (
                <div key={repo.id} className="historial-item">
                  <div className="historial-info">
                    <strong>{repo.nombre}</strong>
                    <span className="historial-tipo">{repo.tipo}</span>
                    <span className="historial-fecha">
                      {new Date(repo.fecha).toLocaleString()}
                    </span>
                  </div>
                  <div className="historial-acciones">
                    <button
                      className="btn-descargar-pdf"
                      onClick={() => descargarReporte(repo.id, 'pdf')}
                    >
                      📄 PDF
                    </button>
                    <button
                      className="btn-descargar-excel"
                      onClick={() => descargarReporte(repo.id, 'excel')}
                    >
                      📊 Excel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visualización del Reporte */}
      {reporte && (
        <div className="reporte-resultado">
          <div className="reporte-header">
            <h2>{reporte.nombre || 'Reporte Generado'}</h2>
            <div className="reporte-acciones">
              <button
                className="btn-descargar-pdf"
                onClick={() => descargarReporte(reporte.id, 'pdf')}
              >
                📄 Descargar PDF
              </button>
              <button
                className="btn-descargar-excel"
                onClick={() => descargarReporte(reporte.id, 'excel')}
              >
                📊 Descargar Excel
              </button>
            </div>
          </div>

          <div className="reporte-info">
            <span className="reporte-tipo">Tipo: {reporte.tipo}</span>
            <span className="reporte-fecha">
              {new Date(reporte.fecha).toLocaleString()}
            </span>
          </div>

          <div className="reporte-datos">
            {renderizarDatos(reporte.datos)}
          </div>
        </div>
      )}
    </div>
  )
}


