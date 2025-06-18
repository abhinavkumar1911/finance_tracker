import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NewLogin from './LoginPage/NewLogin';
import LoginPage from './LoginPage/LoginPage';
import NavBar from './NavBar/NavBar';
import Footer from './Footer/Footer';
import LoginWithGmail from './LoginPage/LoginWithGmail';
import ForgetPassword from './LoginPage/ForgetPassword';

function App() {
  const location = useLocation();

  // List of paths where NavBar/Footer should NOT appear
  const hideLayoutOnPaths = ["/", "/LoginWithGmail", "/NewLogin","/ForgetPassword"];

  const shouldHideLayout = hideLayoutOnPaths.includes(location.pathname);

  return (
    <div className="App d-flex flex-column min-vh-100">
      {!shouldHideLayout && <NavBar />}

      <div className="container my-5">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/LoginWithGmail" element={<LoginWithGmail />} />
          <Route path="/NewLogin" element={<NewLogin />} />
          <Route path="/ForgetPassword" element={<ForgetPassword />} />
          <Route path="/accounts" element={<h2>Accounts Page</h2>} />
          <Route path="/credit-cards" element={<h2>Credit Cards Page</h2>} />
          <Route path="/loan" element={<h2>Loan Page</h2>} />
          <Route path="/debts" element={<h2>Debts Page</h2>} />
          <Route path="/dashboard" element={<h2>Welcome to Finance Tracker</h2>} />
        </Routes>
      </div>

      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default App;
