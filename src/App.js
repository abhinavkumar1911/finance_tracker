import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Footer from './Footer/Footer';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <NavBar />

        <div className="container my-5">
          <Routes>
            <Route path="/accounts" element={<h2>Accounts Page</h2>} />
            <Route path="/credit-cards" element={<h2>Credit Cards Page</h2>} />
            <Route path="/loan" element={<h2>Loan Page</h2>} />
            <Route path="/debts" element={<h2>Debts Page</h2>} />
            <Route path="/" element={<h2>Welcome to Finance Tracker</h2>} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
