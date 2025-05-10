import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, ListGroup, Spinner } from "react-bootstrap";

const MessagesList = () => {
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // Fetch user data to get connections
      axios
        .get(`http://localhost:5000/user/${userId}`)
        .then((response) => {
          const connectionIds = response.data.connections;

          // Fetch details for all connections
          const fetchConnectionsData = connectionIds.map((id) =>
            axios.get(`http://localhost:5000/user/${id}`)
          );

          // Wait for all connection data to be fetched
          Promise.all(fetchConnectionsData)
            .then((connectionResponses) => {
              setConnections(connectionResponses.map((res) => res.data)); // Store user data for connections
              setLoading(false); // Stop loading when data is fetched
            })
            .catch((err) => {
              console.error("Error fetching connection data:", err);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleChatOpen = (connectionId) => {
    navigate(`/messages/chat/${connectionId}`);
  };

  return (
    <div>
      <h4>Your Chats</h4>
      <Form.Control
        type="text"
        placeholder="Search connections..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <Spinner animation="border" role="status" />
      ) : (
        <ListGroup>
          {connections
            .filter((connection) =>
              connection.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((connection) => (
              <ListGroup.Item
                key={connection._id}
                onClick={() => handleChatOpen(connection._id)}
                style={{ cursor: "pointer" }}
              >
                {/* Display Profile Picture and Username */}
                <img
                  src={connection.profilePicture}
                  alt={connection.username}
                  style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }}
                />
                <strong>{connection.username}</strong>
              </ListGroup.Item>
            ))}
        </ListGroup>
      )}
    </div>
  );
};

export default MessagesList;
