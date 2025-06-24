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
import Account_Edit from './LandingPage/Account/Account_Edit';
import Card_Edit from './LandingPage/CreditCard/Card_Edit';
import ProfileInfo from './ProfileInfo';
import Expanse from './Expanse';
import Dashboard from './LandingPage/Dashboard';

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
          <Route path="/Account_Edit/:id" element={<Account_Edit/>}/>
          
          
          <Route path="/Creditcard" element={<Creditcard/>}/>
          <Route path='/Creditcard_details' element={<Creditcard_details/>}/>
          <Route path="/Card_Edit/:id" element={<Card_Edit/>}/>


          <Route path="/loan" element={<h2>Loan Page</h2>} />
          <Route path="/debts" element={<h2>Debts Page</h2>} />
          <Route path="/Dashboard" element={<Dashboard/>} />
          <Route path="/About" element={<About/>} />
          <Route path="/Contact" element={<Contact/>} />
          <Route path="/user-profile" element={<ProfileInfo/>} />
          <Route path="/Expanse" element={<Expanse/>} />

        </Routes>
      </div>

      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default App;
