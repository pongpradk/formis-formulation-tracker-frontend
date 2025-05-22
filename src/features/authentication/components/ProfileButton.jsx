import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/apiService";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants";
import "../../../assets/ProfileButton.css";

function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      // Call the backend logout API
      await api.post("/accounts/logout/", {
        refresh: refreshToken,
      });

      // Clear tokens from localStorage
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if the API call fails, clear tokens and redirect for security
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      navigate("/login");
    }
  };

  return (
    <div className="profile-button-container" ref={dropdownRef}>
      <button
        className="profile-button"
        onClick={toggleDropdown}
        aria-label="User profile"
        disabled={isLoggingOut}
      >
        <div className="profile-initials">
          {/* You could use user initials here if you have user data */}
          {/* <span>U</span> */}
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <ul>
            <li>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="logout-button"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
