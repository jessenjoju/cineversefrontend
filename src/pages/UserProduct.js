import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProduct.css";

const UserProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bookProduct = (product) => {
    alert(`You booked: ${product.name} for ₹${product.price}`);
    // TODO: Call your order API here: PUT /:id/order
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-list-container">
      <h2>All Products</h2>

      {loading && <div className="loading">Loading products...</div>}

      {!loading && products.length === 0 && (
        <div className="no-products">No products found.</div>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">₹{product.price}</p>
            <button
              className="book-btn"
              onClick={() => bookProduct(product)}
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProduct;
