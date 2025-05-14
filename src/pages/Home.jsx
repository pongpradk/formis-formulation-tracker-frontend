import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../features/inventory/components/ProductCard";
import api from "../services/apiService";
import "../assets/Home.css";
import "../assets/Login.css"; // Reusing button styles

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/inventory/products/");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-header">
          <h1>My Products</h1>
          <button className="button primary-button" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
        <div className="loading-container">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="home-header">
          <h1>My Products</h1>
          <button className="button primary-button" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>My Products</h1>
        <button className="button primary-button" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="no-products-message">
          <h3>No products found</h3>
          <p>Add your first product to start managing your collection.</p>
          <button className="button primary-button" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
