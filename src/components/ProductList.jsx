import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


const API_BASE_URL = 'http://34.241.85.158:4000'; 

function ProductList() {
  const [products, setProducts] = useState([])
  const [filterAvailable, setFilterAvailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on availability
  const filteredProducts = filterAvailable
    ? products.filter(product => product.available)
    : products

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="product-list">
      <h1>Products</h1>
      
      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.checked)}
          />
          Show only available products
        </label>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p className="price">${product.price}</p>
            <p className="description">{product.description}</p>
            <p className="availability">
              {product.available ? 'Available' : 'Out of Stock'}
            </p>
            <div className="actions">
              <Link to={`/products/${product.id}`} className="btn view">
                View Details
              </Link>
              <Link to={`/products/${product.id}/edit`} className="btn edit">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList 