import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';
import logo from '../assets/logo.png';

function NavBar() {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid">
        <NavLink className="navbar-brand d-flex align-items-center" to="/about">
          <img
            src={logo}
            alt="Logo"
            className="me-2"
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
          />
          <span>FinanceTracker</span>
        </NavLink>

        <button
          className={`navbar-toggler ${isToggled ? 'toggled' : ''}`}
          type="button"
          onClick={handleToggle}
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isToggled}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isToggled ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto text-end">

            {/* Accounts Dropdown */}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Accounts
              </span>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/BankAccounts">Bank Accounts</NavLink></li>
                <li><NavLink className="dropdown-item" to="/AccountDetails">Accounts Details</NavLink></li>
              </ul>
            </li>

            {/* Credit Cards Dropdown */}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Credit Cards
              </span>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/Creditcard">Credit cards</NavLink></li>
                <li><NavLink className="dropdown-item" to="/CreditCard_Details">Card Details</NavLink></li>
              </ul>
            </li>

            {/* Loan Dropdown */}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Loan
              </span>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/personal-loans">Personal Loans</NavLink></li>
                <li><NavLink className="dropdown-item" to="/home-loans">Home Loans</NavLink></li>
              </ul>
            </li>

            {/* Debts Dropdown */}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Other
              </span>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/utilities">Utilities</NavLink></li>
                <li><NavLink className="dropdown-item" to="/subscriptions">Subscriptions</NavLink></li>
              </ul>
            </li>

            {/* Profile & Logout */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">
                <i className="bi bi-person-circle me-1"></i>
                <span>Profile</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/">Logout</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
