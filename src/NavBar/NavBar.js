import React, { useState,useEffect } from "react";
import { NavLink ,useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';
import logo from '../assets/logo.png';
import { getAuth, signOut } from "firebase/auth";

function NavBar() {
  const [isToggled, setIsToggled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

   useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          lastLogin: currentUser.metadata.lastSignInTime,
        });
      }
    })
    return () => unsubscribe();
  }, [auth])

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to homepage or login
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow fixed-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand d-flex align-items-center" to="/DashBoard">
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


            {/*Expanse */}
            <li className="nav-item">
  <NavLink className="nav-link" to="/Expanse">Expanse</NavLink>
</li>

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
            {/*<li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Loan
              </span>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/personal-loans">Personal Loans</NavLink></li>
                <li><NavLink className="dropdown-item" to="/home-loans">Home Loans</NavLink></li>
              </ul>
            </li>*/}

            {/* Debts Dropdown */}
           {/*} <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Other
              </span>
              <ul className="dropdown-menu">
                <li><NavLink className="dropdown-item" to="/utilities">Utilities</NavLink></li>
                <li><NavLink className="dropdown-item" to="/subscriptions">Subscriptions</NavLink></li>
              </ul>
            </li> */}
 {/* Profile Dropdown */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i> Profile
              </span>
              <ul className="dropdown-menu dropdown-menu-end">
                {user ? (
                  <>
                    <li className="dropdown-item text-muted">Email: {user.email}</li>
                    <li className="dropdown-item text-muted">Last Login: <br /><small>{user.lastLogin}</small></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                  </>
                ) : (
                  <li className="dropdown-item">Not logged in</li>
                )}
              </ul>
            </li>


           {/* <li className="nav-item">
              <NavLink className="nav-link" to="/">Logout</NavLink>
            </li>*/}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
