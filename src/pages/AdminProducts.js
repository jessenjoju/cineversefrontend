import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminProducts.css"; // 👈 import CSS here

const API_BASE = "http://localhost:5000/api";

export default function AdminProducts() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    image: null,
    price: "",
    quantity: ""
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/types`);
      setTypes(res.data);
    } catch (err) {
      console.error("❌ Error fetching types:", err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      if (form.image) formData.append("image", form.image);

      if (editId) {
        await axios.put(`${API_BASE}/products/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post(`${API_BASE}/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      alert(`Product ${editId ? "updated" : "added"} successfully!`);

      setForm({ name: "", type: "", image: null, price: "", quantity: "" });
      setEditId(null);
    } catch (err) {
      alert(err.response?.data?.error || "Error saving product");
    }
  };

  return (
    <div className="admin-products-page">
      <div className="header">
        
        <h1>Add Products</h1>
      </div>
      <div className="form-container">
        <h2>Submit a Product</h2>

        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Product Category */}
          <label>Product Category</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Please Select</option>
            {types.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Upload Image */}
          <label>Image of Product</label>
          <label className="upload-box">
            <span>Upload a File</span>
            <small>Drag and drop files here</small>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              hidden
            />
          </label>

          {/* Price */}
          <label>Product Price</label>
          <input
            type="number"
            name="price"
            placeholder="ex: $5"
            value={form.price}
            onChange={handleChange}
            required
          />

          {/* Quantity */}
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          {/* Submit */}
          <button type="submit">
            {editId ? "Update Product" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}