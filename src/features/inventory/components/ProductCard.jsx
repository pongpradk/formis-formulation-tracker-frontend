import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/ProductCard.css";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-card-content">
          <p className="product-card-brand">{product.brand}</p>
          <h3 className="product-card-name">{product.name}</h3>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
