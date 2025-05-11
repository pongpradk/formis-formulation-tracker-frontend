import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiService";
import FormInput from "../components/FormInput";
import "../assets/Product.css";
import "../assets/Login.css"; // Reusing button styles

function AddProduct() {
  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    ingredients: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    // Clear error for this field when user types
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = "List of ingredients is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/inventory/products/", {
        brand: formData.brand,
        name: formData.name,
        ingredients: formData.ingredients,
      });

      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
      setErrors({
        form: "Failed to add product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-container">
      <div className="product-form">
        <div className="product-header">
          <h2>Add New Product</h2>
          <p>Enter product details below</p>
        </div>

        <form onSubmit={handleSubmit} className="product-form-content">
          <FormInput
            label="Brand"
            id="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. SKIN1004"
            required
            error={errors.brand}
          />

          <FormInput
            label="Product Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Centella Ampoule"
            required
            error={errors.name}
          />

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients</label>
            <textarea
              id="ingredients"
              className="ingredients-input"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="e.g. Water, Glycerin, Butylene Glycol"
              required
            />
            {errors.ingredients && (
              <div className="error-message">{errors.ingredients}</div>
            )}
          </div>

          {errors.form && <div className="error-message">{errors.form}</div>}

          <div className="button-container">
            <button
              type="submit"
              className="button primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>

            <button
              type="button"
              className="button secondary-button"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
