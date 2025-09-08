import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx'; // Make sure this import has .jsx
import './Header.css'; // Import the CSS file above

const Header = () => {
  const { userInfo, logoutHandler, cart } = useStore();
  const navigate = useNavigate();

  const onLogout = () => {
    logoutHandler(); 
    navigate('/login'); 
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-logo">
          <Link to="/">E-Commerce</Link>
        </div>

        <div className="header-links">
          <Link to="/cart">
            Cart
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>

          {userInfo ? (
            <>
              <span>Hello, {userInfo.name}</span>
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;