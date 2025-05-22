import React from "react";
import ProfileButton from "../features/authentication/components/ProfileButton";
import "../assets/MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <div className="profile-button-wrapper">
        <ProfileButton />
      </div>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default MainLayout;
