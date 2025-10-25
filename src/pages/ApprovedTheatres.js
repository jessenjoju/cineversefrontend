import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApprovedTheatres.css";
import { Card, Spinner } from "react-bootstrap";


const ApprovedTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedTheatres();
  }, []);

  const fetchApprovedTheatres = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/theatres/approved");
      setTheatres(res.data);
    } catch (err) {
      console.error("Error fetching approved theatres:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">✅ Approved Theatres</h2>

      {theatres.length === 0 ? (
        <p className="text-center text-muted">No approved theatres found.</p>
      ) : (
        <div className="row">
          {theatres.map((theatre) => (
            <div className="col-md-4 mb-4" key={theatre._id}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="text-primary">{theatre.name}</Card.Title>
                  <Card.Text>
                    <strong>Owner:</strong> {theatre.ownerName || "N/A"} <br />
                    <strong>Location:</strong> {theatre.location || "N/A"} <br />
                    <strong>Email:</strong> {theatre.email || "N/A"} <br />
                    <strong>Phone:</strong> {theatre.phone || "N/A"} <br />
                    <strong>Status:</strong>{" "}
                    <span className="text-success">{theatre.status}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovedTheatres;
