import React from "react";
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';
import logo from '../assets/logo.png'; // adjust path based on your file location

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            className="me-2"
            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
          />
          <span>FinanceTracker</span>
        </NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
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
              <NavLink className="nav-link" to="/debts">Debts</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
