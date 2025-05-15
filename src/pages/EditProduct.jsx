import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/apiService";
import FormInput from "../components/FormInput";
import "../assets/AddProduct.css";
import "../assets/Login.css"; // Reusing button styles

function EditProduct() {
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    ingredients: "",
    manufacturing_date: "",
    expiration_date: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/inventory/products/${productId}/`);

        // Format dates for form input (HTML date inputs require YYYY-MM-DD)
        const product = response.data;
        setFormData({
          brand: product.brand,
          name: product.name,
          ingredients: product.ingredients,
          manufacturing_date: product.manufacturing_date || "",
          expiration_date: product.expiration_date || "",
        });
        setLoadError(null);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoadError("Failed to load product data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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

    // Manufacturing date is now optional

    // Expiration date is now optional, but if both dates are provided, validate them
    if (
      formData.manufacturing_date &&
      formData.expiration_date &&
      new Date(formData.expiration_date) <=
        new Date(formData.manufacturing_date)
    ) {
      newErrors.expiration_date =
        "Expiration date must be after manufacturing date";
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
      await api.put(`/inventory/products/update/${productId}/`, {
        brand: formData.brand,
        name: formData.name,
        ingredients: formData.ingredients,
        manufacturing_date: formData.manufacturing_date || null,
        expiration_date: formData.expiration_date || null,
      });

      // Redirect to product detail page on success
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors({
        form: "Failed to update product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="product-container">
        <div className="product-form">
          <div className="product-header">
            <h2>Edit Product</h2>
            <p>Loading product data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="product-container">
        <div className="product-form">
          <div className="product-header">
            <h2>Error</h2>
            <p>{loadError}</p>
          </div>
          <div className="button-container">
            <button
              className="button secondary-button"
              onClick={() => navigate(`/product/${productId}`)}
            >
              Back to Product
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
      <div className="product-form">
        <div className="product-header">
          <h2>Edit Product</h2>
          <p>Update product details below</p>
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

          <div className="date-fields-container">
            <div className="date-field">
              <label className="date-label" htmlFor="manufacturing_date">
                Manufacturing Date
              </label>
              <div className="optional-text">(optional)</div>
              <input
                type="date"
                id="manufacturing_date"
                value={formData.manufacturing_date}
                onChange={handleChange}
                max={today}
              />
              {errors.manufacturing_date && (
                <div className="error-message">{errors.manufacturing_date}</div>
              )}
            </div>

            <div className="date-field">
              <label className="date-label" htmlFor="expiration_date">
                Expiration Date
              </label>
              <div className="optional-text">(optional)</div>
              <input
                type="date"
                id="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                min={formData.manufacturing_date || today}
              />
              {errors.expiration_date && (
                <div className="error-message">{errors.expiration_date}</div>
              )}
            </div>
          </div>

          {errors.form && <div className="error-message">{errors.form}</div>}

          <div className="button-container">
            <button
              type="submit"
              className="button primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="button secondary-button"
              onClick={handleCancel}
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

export default EditProduct;
