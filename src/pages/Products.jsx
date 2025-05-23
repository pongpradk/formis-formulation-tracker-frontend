import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../features/inventory/components/ProductCard";
import api from "../services/apiService";
import "../assets/Products.css";
import { FaPlus } from "react-icons/fa"; // Import plus icon

function Products() {
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
      <div className="products-container">
        <div className="products-header">
          <button
            className="add-product-btn"
            onClick={handleAddProduct}
            aria-label="Add product"
          >
            <FaPlus />
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
      <div className="products-container">
        <div className="products-header">
          <button
            className="add-product-btn"
            onClick={handleAddProduct}
            aria-label="Add product"
          >
            <FaPlus />
          </button>
        </div>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <button
          className="add-product-btn"
          onClick={handleAddProduct}
          aria-label="Add product"
        >
          <FaPlus />
        </button>
      </div>

      {products.length === 0 ? (
        <div className="no-products-message">
          <h3>No products found</h3>
          <p>Add your first product to start managing your collection.</p>
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

export default Products;
