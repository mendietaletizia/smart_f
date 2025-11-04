import { useId, useRef, useState } from 'react'
import { uploadImage, validateImageFile } from '../api/images.js'

export default function ImageUpload({ onImageUploaded, currentImage = '' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentImage)
  const inputId = useId()
  const fileInputRef = useRef(null)

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    try {
      setError('')
      setUploading(true)
      
      // Validar archivo
      await validateImageFile(file)
      
      // Mostrar preview
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
      
      // Subir imagen
      const imageUrl = await uploadImage(file)
      
      // Actualizar preview con URL final
      setPreview(imageUrl)
      
      // Notificar al componente padre
      if (onImageUploaded) {
        onImageUploaded(imageUrl)
      }
      
    } catch (err) {
      setError(err.message)
      setPreview('')
    } finally {
      setUploading(false)
    }
  }

  function handleRemoveImage() {
    setPreview('')
    if (onImageUploaded) {
      onImageUploaded('')
    }
  }

  function handleButtonClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="image-upload">
      <div className="upload-section">
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          onClick={handleButtonClick}
          className={`upload-button ${uploading ? 'uploading' : ''}`}
          disabled={uploading}
        >
          {uploading ? '⏳ Subiendo...' : '📷 Subir Imagen'}
        </button>
        
        <div className="upload-info">
          <small>Formatos: JPEG, PNG, GIF, WebP</small>
          <small>Máximo: 32MB</small>
        </div>
      </div>

      {error && (
        <div className="upload-error">
          ❌ {error}
        </div>
      )}

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
          <button 
            type="button"
            onClick={handleRemoveImage}
            className="remove-image-btn"
            title="Eliminar imagen"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
