import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css"; // custom CSS for styling

const API_BASE = "http://localhost:5000/api/products"; // adjust if needed

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_BASE);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.put(`${API_BASE}/${id}/delete`);
      fetchProducts(); // refresh list
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (id) => {
    // You can redirect to your edit form with the product id
    window.location.href = `/edit-product/${id}`;
  };

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((p) => (
          <div className="product-card" key={p._id}>
            <img
              src={`http://localhost:5000/uploads/${p.image}`}
              alt={p.name}
              className="product-img"
            />
            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>
            <p className="qty">Quantity: {p.quantity}</p>

            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(p._id)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
