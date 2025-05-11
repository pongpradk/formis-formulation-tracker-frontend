import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/apiService";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "../features/authentication/utils/constants";
import "../assets/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
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

  // Handle final login submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      const response = await api.post("/accounts/token/", {
        email,
        password,
      });

      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      navigate("/");
    } catch (error) {
      setError(
        "Wrong password. Try again or click Forgot password to reset it."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>Welcome back</h2>
          {currentStep === 1 ? (
            <p>Enter your email to continue</p>
          ) : (
            <p>Enter your password to login</p>
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

              <Link to="/register">
                <button type="button" className="button secondary-button">
                  Create account
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
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                required
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="button-container">
              <button type="submit" className="button primary-button">
                Login
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

export default Login;
