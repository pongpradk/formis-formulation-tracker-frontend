import React, { useState } from "react";
import {
  FaTimesCircle,
  FaExchangeAlt,
  FaCheckCircle,
  FaTimesCircle as FaXCircle,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import api from "../../../services/apiService";
import "../../../assets/Modal.css";
import "../../../assets/IngredientCompare.css";

function IngredientCompareModal({
  isOpen,
  onClose,
  productName,
  productBrand,
  productId, // Need product ID for API call
}) {
  const [newIngredients, setNewIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasCompared, setHasCompared] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newIngredients.trim()) {
      setError("Please enter ingredients to compare");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(
        `/inventory/products/${productId}/compare-ingredients/`,
        {
          ingredients: newIngredients,
        }
      );

      setComparisonResult(response.data.match);
      setHasCompared(true);
    } catch (err) {
      console.error("Error comparing ingredients:", err);
      setError(
        err.response?.data?.error ||
          "Failed to compare ingredients. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing the modal
    setNewIngredients("");
    setComparisonResult(null);
    setError(null);
    setHasCompared(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content ingredient-compare-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Compare Ingredients</h3>
          <button
            className="modal-close-button"
            onClick={handleClose}
            aria-label="Close"
          >
            <FaTimesCircle />
          </button>
        </div>
        <div className="modal-body">
          <p className="compare-intro">
            Compare{" "}
            <strong>
              {productBrand} {productName}
            </strong>{" "}
            with a new purchase to check for formula changes.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newIngredients">
                Paste ingredients from your new product:
              </label>
              <textarea
                id="newIngredients"
                className="ingredients-textarea"
                value={newIngredients}
                onChange={(e) => setNewIngredients(e.target.value)}
                placeholder="Enter or paste ingredients here..."
                rows={6}
                disabled={isLoading}
                required
              />
            </div>

            {/* Comparison Result Display */}
            {hasCompared && !error && (
              <div
                className={`comparison-result ${
                  comparisonResult ? "match" : "no-match"
                }`}
              >
                {comparisonResult ? (
                  <>
                    <FaCheckCircle className="result-icon" />
                    <p>
                      The ingredients match! This product has the same formula.
                    </p>
                  </>
                ) : (
                  <>
                    <FaXCircle className="result-icon" />
                    <p>The ingredients don't match. The formula has changed.</p>
                  </>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="comparison-error">
                <FaXCircle className="error-icon" />
                <p>{error}</p>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                className="button secondary-button"
                onClick={handleClose}
                disabled={isLoading}
              >
                Close
              </button>

              <button
                type="submit"
                className="button primary-button"
                disabled={isLoading}
              >
                <span className="button-content">
                  {isLoading ? (
                    <>
                      <ImSpinner8 className="spinner-icon" aria-hidden="true" />
                      <span className="button-text">Comparing...</span>
                    </>
                  ) : (
                    <>
                      <FaExchangeAlt aria-hidden="true" />
                      <span className="button-text">Compare</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default IngredientCompareModal;
