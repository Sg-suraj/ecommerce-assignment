import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import './CartPage.css'; // Import the new styles

const CartPage = () => {
  // Get all the state and handlers from our global context
  const { cart, removeFromCartHandler, addToCartHandler } = useStore();

  // Calculate the subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  // Get total item count
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // We need this function to get the correct product ID, since our local cart
  // and DB cart might store the ID differently (item._id vs item.product)
  const getItemId = (item) => {
    return item.product || item._id;
  };

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          Your cart is empty. <Link to="/">Go Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {cart.map((item) => (
              <div className="cart-item" key={getItemId(item)}>
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <Link to={`/`} className="cart-item-title">{item.name}</Link>
                  <p className="cart-item-price">Price: ${item.price.toFixed(2)}</p>
                  <p className="cart-item-qty">Quantity: {item.quantity}</p>
                  {/* Note: A better UI would have a quantity selector dropdown,
                      which would call addToCartHandler with the *new* quantity.
                      For this assignment, we just provide the remove button. */}
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCartHandler(getItemId(item))}
                >
                  &times; {/* This is a "times" (X) symbol */}
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="cart-subtotal">
              Subtotal ({totalItems} items): ${subtotal.toFixed(2)}
            </h2>
            <button className="btn btn-primary" disabled={cart.length === 0}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;