import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrashAlt,
  FaCalendarAlt,
  FaExchangeAlt,
} from "react-icons/fa";
import api from "../services/apiService";
import ConfirmationModal from "../components/ConfirmationModal";
import IngredientCompareModal from "../features/inventory/components/IngredientCompareModal";
import "../assets/ProductDetail.css"; // For product detail specific styles

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

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
    setIsDeleteModalOpen(false); // Close modal first
    try {
      await api.delete(`/inventory/products/delete/${productId}/`);
      navigate("/products"); // Redirect to Products page after successful deletion
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
      // Optionally, re-open modal with error or show a toast notification
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const openCompareModal = () => {
    setIsCompareModalOpen(true);
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" }; // e.g., May 21, 2025
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div className="loading-state">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!product) {
    return <div className="error-state">Product not found.</div>;
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
            <h3>
              <FaCalendarAlt aria-hidden="true" />
              <span>Manufacturing Date</span>
            </h3>
            <p>{formatDate(product.manufacturing_date)}</p>
          </div>
          <div className="date-item">
            <h3>
              <FaCalendarAlt aria-hidden="true" />
              <span>Expiration Date</span>
            </h3>
            <p>{formatDate(product.expiration_date)}</p>
          </div>
        </div>

        {/* Display other product fields as needed */}

        <div className="product-detail-actions">
          <button
            className="button secondary-button compare-button"
            onClick={openCompareModal}
          >
            <span className="button-content">
              <FaExchangeAlt aria-hidden="true" /> <span>Compare</span>
            </span>
          </button>
          <button
            className="button primary-button edit-button"
            onClick={() => navigate(`/product/${productId}/edit`)}
          >
            <span className="button-content">
              <FaEdit aria-hidden="true" /> <span>Edit</span>
            </span>
          </button>
          <button
            className="button danger-outline-button delete-button"
            onClick={openDeleteModal}
          >
            <span className="button-content">
              <FaTrashAlt aria-hidden="true" /> <span>Delete</span>
            </span>
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.brand} ${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />

      <IngredientCompareModal
        isOpen={isCompareModalOpen}
        onClose={closeCompareModal}
        productName={product.name}
        productBrand={product.brand}
        productId={productId}
      />
    </div>
  );
}

export default ProductDetail;
