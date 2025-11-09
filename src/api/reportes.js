// CU14-CU20: API para reportes dinámicos

export async function solicitarReporte(texto, audioData = null) {
  const body = {
    texto,
    ...(audioData && { audio: audioData, texto_transcrito: texto })
  }
  
  const res = await fetch('/api/reportes/solicitar/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  })
  const data = await res.json().catch(() => ({ success: false }))
  if (!res.ok || !data.success) throw new Error(data.message || 'Error al solicitar reporte')
  return data.reporte
}

export async function obtenerFiltrosInteligentes(tipoReporte) {
  const res = await fetch('/api/reportes/filtros-inteligentes/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ tipo_reporte: tipoReporte })
  })
  const data = await res.json().catch(() => ({ success: false }))
  if (!res.ok || !data.success) throw new Error(data.message || 'Error al obtener filtros')
  return data.sugerencias
}

export async function listarReportes() {
  const res = await fetch('/api/reportes/listar/', {
    credentials: 'include'
  })
  const data = await res.json().catch(() => ({ success: false }))
  if (!res.ok || !data.success) throw new Error(data.message || 'Error al listar reportes')
  return data.reportes
}

export function descargarReporte(reporteId, formato = 'pdf') {
  window.open(`/api/reportes/${reporteId}/descargar/?formato=${formato}`, '_blank')
}


