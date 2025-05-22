import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/apiService";
import ConfirmationModal from "../components/ConfirmationModal";
import "../assets/ProductDetail.css"; // For product detail specific styles
import "../assets/Login.css"; // Reusing button styles
import "../assets/Modal.css"; // For Modal styles, if not globally imported

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Assuming your backend API for fetching a single product is /inventory/products/<id>/
        // If it's different, please adjust the URL.
        const response = await api.get(`/inventory/products/${productId}/`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
        setProduct(null);
      }
      setIsLoading(false);
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleDelete = async () => {
    setIsModalOpen(false); // Close modal first
    try {
      await api.delete(`/inventory/products/delete/${productId}/`);
      navigate("/"); // Redirect to Productspage after successful deletion
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
      // Optionally, re-open modal with error or show a toast notification
    }
  };

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" }; // e.g., May 21, 2025
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="product-detail-container loading-state">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return <div className="product-detail-container error-state">{error}</div>;
  }

  if (!product) {
    return <div className="product-detail-container">Product not found.</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-detail-header">
          <p className="brand-name">{product.brand}</p>
          <h1>{product.name}</h1>
        </div>

        <div className="product-detail-section">
          <h2>Ingredients</h2>
          <p className="ingredients-list">
            {product.ingredients || "No ingredients listed."}
          </p>
        </div>

        <div className="product-detail-dates">
          <div className="date-item">
            <h3>Manufacturing Date</h3>
            <p>{formatDate(product.manufacturing_date)}</p>
          </div>
          <div className="date-item">
            <h3>Expiration Date</h3>
            <p>{formatDate(product.expiration_date)}</p>
          </div>
        </div>

        {/* Display other product fields as needed */}

        <div className="product-detail-actions">
          <button
            className="button primary-button"
            onClick={() => navigate(`/product/${productId}/edit`)}
          >
            Edit
          </button>
          <button
            className="button danger-outline-button"
            onClick={openDeleteModal}
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.brand} ${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}

export default ProductDetail;
