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
            <li className="nav-item">
              <NavLink className="nav-link" to="/accounts">Accounts</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/credit-cards">Credit Cards</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/loan">Loan</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Debts">Other</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link " to="/profile">
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
