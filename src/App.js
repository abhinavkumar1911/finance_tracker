import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NewLogin from './LoginPage/NewLogin';
import LoginPage from './LoginPage/LoginPage';
import NavBar from './NavBar/NavBar';
import Footer from './Footer/Footer';
import LoginWithGmail from './LoginPage/LoginWithGmail';
import ForgetPassword from './LoginPage/ForgetPassword';
import BankAccounts from './LandingPage/Account/BankAccounts';
import AccountDetails from './LandingPage/Account/AccountDetails';
import About from './Footer/About';
import Contact from './Footer/Contact';
import Creditcard from './LandingPage/CreditCard/Creditcard';
import Creditcard_details from './LandingPage/CreditCard/CreditCard_Details';

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
          
          <Route path="/bankAccounts" element={<BankAccounts/>}/>
          <Route path='/AccountDetails' element={<AccountDetails/>}/>
          
          
          <Route path="/Creditcard" element={<Creditcard/>}/>
          <Route path='/Creditcard_details' element={<Creditcard_details/>}/>


          <Route path="/loan" element={<h2>Loan Page</h2>} />
          <Route path="/debts" element={<h2>Debts Page</h2>} />
          <Route path="/dashboard" element={<h2>Welcome to Finance Tracker</h2>} />
          <Route path="/About" element={<About/>} />
          <Route path="/Contact" element={<Contact/>} />
        </Routes>
      </div>

      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default App;
