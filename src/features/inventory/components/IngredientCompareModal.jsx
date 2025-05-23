import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle, FaExchangeAlt } from "react-icons/fa";
import "../../../assets/Modal.css";
import "../../../assets/IngredientCompare.css";

function IngredientCompareModal({
  isOpen,
  onClose,
  productName,
  productBrand,
}) {
  const [newIngredients, setNewIngredients] = useState("");
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just redirect to products page
    // Later, this would process the comparison logic
    navigate("/products");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content ingredient-compare-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Compare Ingredients</h3>
          <button
            className="modal-close-button"
            onClick={onClose}
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
                required
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button secondary-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="button primary-button">
                <span className="button-content">
                  <FaExchangeAlt aria-hidden="true" />
                  <span className="button-text">Compare</span>
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
