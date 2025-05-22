import React from "react";
import { Link } from "react-router-dom";
import ProfileButton from "../features/authentication/components/ProfileButton";
import "../assets/MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <div className="main-header">
        <div className="logo">
          <Link to="/">
            <h1>Formis</h1>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/products" className="nav-link">
            My Products
          </Link>
        </div>
        <div className="profile-button-wrapper">
          <ProfileButton />
        </div>
      </div>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default MainLayout;
