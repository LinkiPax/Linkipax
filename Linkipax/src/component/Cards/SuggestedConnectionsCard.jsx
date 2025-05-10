import React, { useEffect, useState } from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SuggestedConnectionsCard.css"; // Import custom CSS

const SuggestedConnectionsCard = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const navigate = useNavigate();

  // Fetch suggestions from backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      const userId = localStorage.getItem("userId"); // Fetch from localStorage or context

      if (!userId) {
        setError("User is not logged in.");
        setLoading(false);
        return; // Exit the function if no userId is found
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/suggestions?userId=${userId}`
        );
        console.log("Suggestions:", response.data);
        setSuggestions(response.data);
      } catch (error) {
        setError("Failed to fetch suggestions. Please try again later.");
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Handle connection request
  const handleConnect = async (targetUserId) => {
    const userId = localStorage.getItem("userId"); // Logged-in userId from localStorage

    if (!userId) {
      alert("You need to log in to send a connection request.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/user/suggestions/connect`, {
        userId,
        targetUserId,
      });
      setPendingRequests([...pendingRequests, targetUserId]);
      alert("Connection request sent!");
    } catch (error) {
      console.error("Error connecting:", error);
      alert("Failed to send connection request");
    }
  };

  if (loading) {
    return (
      <Card className="suggestions-card">
        <Card.Header>People You May Know</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    );
  }

  return (
    <Card className="suggestions-card">
      <Card.Header>People You May Know</Card.Header>
      <ListGroup variant="flush" className="horizontal-scroll">
        {error && (
          <ListGroup.Item>
            <div className="alert alert-danger">{error}</div>
          </ListGroup.Item>
        )}
        {suggestions.length > 0 ? (
          suggestions.map((user) => (
            <ListGroup.Item className="suggestion-item" key={user._id}>
              <div className="d-flex flex-column align-items-center text-center">
                {/* Profile Picture */}
                <img
                  src={
                    user.profilePicture ||
                    `https://ui-avatars.com/api/?name=${user.name}&size=100`
                  }
                  alt="Profile"
                  className="profile-image mb-2"
                />
                {/* Name */}
                <h6 className="mb-1">{user.name}</h6>
                {/* Company */}
                <small className="text-muted mb-2">{user.company}</small>
                {/* Connection Button */}
                <Button
                  variant="primary"
                  size="sm"
                  className="connect-button"
                  disabled={pendingRequests.includes(user._id)}
                  onClick={() => handleConnect(user._id)}
                >
                  {pendingRequests.includes(user._id)
                    ? "Request Sent"
                    : "Connect"}
                </Button>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No suggestions available.</ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default SuggestedConnectionsCard;