import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
import './ProductCard.css'; // Import the new styles

// This component receives a single 'item' object as a prop
const ProductCard = ({ item }) => {
  // Get the 'addToCartHandler' from our global context
  const { addToCartHandler } = useStore();

  const handleAddToCart = () => {
    // Call the context function, adding 1 of this item
    addToCartHandler(item, 1);
    // We could add a toast notification here, but we'll keep it simple
    console.log(`Added ${item.name} to cart`);
  };

  return (
    <div className="product-card">
      {/* We will make this link functional in a later step if we add product details page */}
      {/* <Link to={`/product/${item._id}`}> */}
        <img src={item.imageUrl} alt={item.name} className="product-image" />
      {/* </Link> */}

      <div className="product-body">
        <p className="product-category">{item.category}</p>
        {/* <Link to={`/product/${item._id}`} className="product-title"> */}
          <h3 className="product-title">{item.name}</h3>
        {/* </Link> */}
        <p className="product-description">{item.description}</p>
        
        <div className="product-footer">
          <span className="product-price">${item.price.toFixed(2)}</span>
          <button onClick={handleAddToCart} className="btn btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;