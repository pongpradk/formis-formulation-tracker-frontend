import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/apiService";
import "../assets/Login.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle next button click (from email to password step)
  const handleNextStep = (e) => {
    e.preventDefault();
    setIsValidatingEmail(true);

    if (!email) {
      setError("Email is required");
      setIsValidatingEmail(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsValidatingEmail(false);
      return;
    }

    setError("");
    setCurrentStep(2);
    setIsValidatingEmail(false);
  };

  // Handle back button click (from password to email step)
  const handleBackStep = () => {
    setCurrentStep(1);
    setError("");
  };

  // Handle final registration submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/accounts/user/register/", {
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>Create your account</h2>
          {currentStep === 1 ? (
            <p>Enter your email to get started</p>
          ) : (
            <p>Choose a secure password</p>
          )}
        </div>

        {currentStep === 1 ? (
          // Step 1: Email Input
          <form onSubmit={handleNextStep} className="login-step">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="your@email.com"
                autoComplete="email"
                required
                disabled={isValidatingEmail}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="button-container">
              <button
                type="submit"
                className="button primary-button"
                disabled={isValidatingEmail}
              >
                {isValidatingEmail ? "Validating..." : "Next"}
              </button>

              <Link to="/login">
                <button type="button" className="button secondary-button">
                  Already have an account? <br />
                  Log in
                </button>
              </Link>
            </div>
          </form>
        ) : (
          // Step 2: Password Input
          <form onSubmit={handleSubmit} className="login-step">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm your password"
                required
              />
            </div>

            <div
              className="form-group"
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={{ width: "auto", marginRight: "8px" }}
              />
              <label htmlFor="showPassword" style={{ fontWeight: "normal" }}>
                Show password
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-container">
              <button type="submit" className="button primary-button">
                Create account
              </button>

              <button
                type="button"
                onClick={handleBackStep}
                className="button secondary-button"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
