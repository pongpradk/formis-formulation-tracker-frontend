import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../assets/Home.css";
import { ACCESS_TOKEN } from "../features/authentication/utils/constants";
import MainLayout from "../components/MainLayout";
import ProfileButton from "../features/authentication/components/ProfileButton";

function HomeContent({ isAuthenticated }) {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Track Your Product Formulas With Confidence
          </h1>
          <p className="hero-subtitle">
            Compare ingredients, track expiration dates, and ensure formula
            consistency for your skincare, makeup, and supplements.
          </p>
          <div className="cta-buttons">
            {isAuthenticated ? (
              <button
                className="cta-button primary"
                onClick={() => navigate("/add-product")}
              >
                Add Your First Product
              </button>
            ) : (
              <button
                className="cta-button primary"
                onClick={() => navigate("/register")}
              >
                Get Started - It's Free
              </button>
            )}
            <button
              className="cta-button secondary"
              onClick={() => {
                const featuresSection =
                  document.getElementById("features-section");
                featuresSection.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image">
          {/* Placeholder for hero image */}
          <div className="hero-image-placeholder"></div>
        </div>
      </section>

      <section className="features-section" id="features-section">
        <h2 className="section-title">Why Choose Formis</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Comparison</h3>
            <p>
              Compare ingredients in less than a minute, no manual typing
              needed.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Expiration Reminders</h3>
            <p>Get timely notifications before your products expire.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Formula Verification</h3>
            <p>
              Ensure your repurchased products maintain the same formula
              quality.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Ingredient Analysis</h3>
            <p>Track common ingredients across your product collection.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Add Your Products</h3>
            <p>
              Upload photos or manually add your skincare, makeup, and
              supplements.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Record Ingredients</h3>
            <p>Store the formula details and expiration dates securely.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Compare When Needed</h3>
            <p>
              Quickly check if your new purchase matches the original formula.
            </p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Formis</h2>
            <p>Your formula tracking companion</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li>
                  <Link to="/">About Us</Link>
                </li>
                <li>
                  <Link to="/">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Legal</h3>
              <ul>
                <li>
                  <Link to="/">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Formis. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

function Home() {
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN);

  // If user is authenticated, use MainLayout
  if (isAuthenticated) {
    return (
      <MainLayout>
        <HomeContent isAuthenticated={true} />
      </MainLayout>
    );
  }

  // If not authenticated, use custom home layout
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <Link to="/">
            <h1>Formis</h1>
          </Link>
        </div>
        <nav className="nav-buttons">
          <Link to="/login" className="nav-button login-btn">
            Log In
          </Link>
          <Link to="/register" className="nav-button signup-btn">
            Sign Up
          </Link>
        </nav>
      </header>

      <HomeContent isAuthenticated={false} />
    </div>
  );
}

export default Home;
