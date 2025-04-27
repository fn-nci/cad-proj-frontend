import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const API_BASE_URL = 'http://34.241.85.158:4000'; 

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!product) return <div className="not-found">Product not found</div>

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      
      <div className="product-info">
        <p className="price">Price: ${product.price}</p>
        <p className="availability">
          Status: {product.available ? 'Available' : 'Out of Stock'}
        </p>
        <p className="description">{product.description}</p>
      </div>

      <div className="actions">
        <button
          onClick={() => navigate(`/products/${id}/edit`)}
          className="btn edit"
        >
          Edit Product
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn delete"
        >
          {isDeleting ? 'Deleting...' : 'Delete Product'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn back"
        >
          Back to List
        </button>
      </div>
    </div>
  )
}

export default ProductDetail 