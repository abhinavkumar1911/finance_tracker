import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NewLogin from './LoginPage/NewLogin';
import LoginPage from './LoginPage/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/NewLogin" element={<NewLogin />} />
    </Routes>
  );
}

export default App;
