import React, { useState } from "react";
import LoginPage from "./Login";
import Signup from "./Signup";
import "./App.css";

function Header({ onCartClick, onLoginSuccess, loggedInUser }) {
  const isAdmin = loggedInUser?.role === "admin"; // Check if logged-in user is admin
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showSignupPage, setShowSignupPage] = useState(false);
  

  // Handle login button click
  const handleLoginClick = () => {
    setShowLoginPage(true);
    setShowSignupPage(false);
  };

  // Handle signup button click
  const handleSignupClick = () => {
    setShowSignupPage(true);
    setShowLoginPage(false);
  };

  // Handle logout
  const handleLogoutClick = () => {
    onLoginSuccess(null); // Clear user session
    setShowLoginPage(false);
    setShowSignupPage(false);
  };

  // Close login/signup pages
  const handleClosePages = () => {
    setShowLoginPage(false);
    setShowSignupPage(false);
  };



  // Handle product form submission
  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    console.log("Product added:", editingProduct);
    setEditingProduct(null);
  };

  return (
    <header>
      {/* Header Title */}
      <div className="header" style={{ background: "red" }}>
        <h1>Healthy Fruit Store</h1>
      </div>

      {/* Navigation Section */}
      <div className="loginlogo">
        {loggedInUser ? (
          <>
            <span>Welcome, {loggedInUser.name} - {loggedInUser.role}</span>
            <button onClick={handleLogoutClick}>Logout</button>
           
          </>
        ) : (
          <>
            <button className="fas fa-user-plus" onClick={handleLoginClick}>Login</button>
            <button className="fas fa-sign-in-alt" onClick={handleSignupClick}>Sign-Up</button>
          </>
        )}
        <button className="fas fa-shopping-cart" onClick={onCartClick}>Cart</button>
      </div>

      {/* Conditional Rendering for Login and Signup Pages */}
      {showLoginPage && <LoginPage onLoginSuccess={onLoginSuccess} onCloseButtonClick={handleClosePages} />}
      {showSignupPage && <Signup onCloseButtonClick={handleClosePages} />}

      
    </header>
  );
}

export default Header;