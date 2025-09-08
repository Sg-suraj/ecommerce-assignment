import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import './HomePage.css'; // Import the grid styles

// Define our categories (you can add more to match your data)
const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Sample'];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // This useEffect hook runs whenever 'selectedCategory' changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      
      try {
        let url = '/api/items'; // Base API URL

        // If the category is NOT 'All', add the query parameter
        // This matches our backend API route
        if (selectedCategory !== 'All') {
          url += `?category=${selectedCategory}`;
        }
        
        const { data } = await axios.get(url);
        setProducts(data); // Save the fetched products to state

      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false); // Stop loading, whether success or fail
      }
    };

    fetchProducts();
  }, [selectedCategory]); // The dependency array: This hook re-runs when this value changes

  return (
    <div>
      <h1>Latest Products</h1>
      
      {/* Filter Bar */}
      <div className="filter-bar">
        <span>Filter by:</span>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Display */}
      {loading ? (
        <h2 className="loading-text">Loading...</h2>
      ) : error ? (
        <h2 className="error-text">{error}</h2>
      ) : (
        <div className="product-grid">
          {products.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;