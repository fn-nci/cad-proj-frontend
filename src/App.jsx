import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import ProductDetail from './components/ProductDetail'
import './index.css'

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products/new" className="nav-link">Add Product</Link>
        </nav>
        
        <main className="container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App 