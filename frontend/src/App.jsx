import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all our real components
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import CartPage from './pages/CartPage.jsx'; // 1. IMPORT REAL CART PAGE

const App = () => {
  return (
    <>
      <Header /> 
      <main className="container">
        <Routes>
          {/* All routes are now real */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} /> {/* 2. USE REAL CART PAGE */}
        </Routes>
      </main>
    </>
  );
};

export default App;