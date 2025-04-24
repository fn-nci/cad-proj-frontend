import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'

function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    available: true
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Fetch product data if editing
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/products/${id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch product')
          }
          const data = await response.json()
          setProduct(data)
        } catch (err) {
          console.error('Error:', err)
        }
      }
      fetchProduct()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!product.name) newErrors.name = 'Name is required'
    if (!product.description) newErrors.description = 'Description is required'
    if (!product.price || isNaN(product.price) || product.price <= 0) {
      newErrors.price = 'Valid price is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const url = id 
        ? `${API_BASE_URL}/products/${id}`
        : `${API_BASE_URL}/products`
      
      const method = id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      })

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      navigate('/')
    } catch (err) {
      console.error('Error:', err)
      setErrors({ submit: 'Failed to save product. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="product-form">
      <h1>{id ? 'Edit Product' : 'Add New Product'}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="available"
              checked={product.available}
              onChange={handleChange}
            />
            Available
          </label>
        </div>

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  )
}

export default ProductForm 