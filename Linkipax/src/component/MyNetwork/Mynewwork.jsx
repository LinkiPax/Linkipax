// import React, { useEffect, useState } from "react";
// import { Button, ListGroup, Card } from "react-bootstrap";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const MyNetwork = () => {
//   const location = useLocation();
//   const { targetUserId } = location.state || {}; // Extract userId and targetUserId from state

//   const userId = localStorage.getItem("userId");
//   const [connections, setConnections] = useState([]);
//   const [connectionRequests, setConnectionRequests] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   console.log("targetUserId from localStorage:", targetUserId); // Log targetUserId to check

//   useEffect(() => {
//     if (!userId) return; // Avoid making API calls if userId is not available

//     const fetchNetwork = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `http://localhost:5000/api/user/suggestions/mynetwork?userId=${userId}`
//         );
//         console.log("response.data:", response.data); // Log response data to check
//         setConnections(response.data.connections || []);
//         setConnectionRequests(response.data.connectionRequests || []);
//       } catch (error) {
//         setError("Failed to fetch network data");
//         console.error("Error fetching network:", error); // Log error for debugging
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNetwork();
//   }, [userId]); // Dependency on userId

//   const handleAccept = async (targetUserId) => {
//     try {
//       await axios.post("http://localhost:5000/api/user/suggestions/accept", {
//         userId,
//         targetUserId,
//       });
//       setConnections((prevConnections) => [
//         ...prevConnections,
//         { _id: targetUserId },
//       ]);
//       setConnectionRequests((prevRequests) =>
//         prevRequests.filter((user) => user._id !== targetUserId)
//       );
//       alert("Connection accepted!");
//     } catch (error) {
//       alert("Failed to accept connection");
//       console.error("Error accepting connection:", error); // Log error for debugging
//     }
//   };

//   const handleDecline = async (targetUserId) => {
//     try {
//       await axios.post("http://localhost:5000/api/user/suggestions/decline", {
//         userId,
//         targetUserId,
//       });
//       setConnectionRequests((prevRequests) =>
//         prevRequests.filter((user) => user._id !== targetUserId)
//       );
//       alert("Connection declined!");
//     } catch (error) {
//       alert("Failed to decline connection");
//       console.error("Error declining connection:", error); // Log error for debugging
//     }
//   };

//   if (loading) {
//     return <div>Loading your network...</div>;
//   }

//   return (
//     <div>
//       <Card className="mb-3">
//         <Card.Header>My Network</Card.Header>
//         <ListGroup variant="flush">
//           {error && <div className="alert alert-danger">{error}</div>}

//           <h5>Connection Requests</h5>
//           {connectionRequests.length > 0 ? (
//             connectionRequests.map((user) => (
//               <ListGroup.Item key={user._id} className="d-flex align-items-center">
//                 <div>
//                   <h6>{user.name}</h6>
//                   <small>{user.jobTitle}</small>
//                 </div>
//                 <Button
//                   variant="success"
//                   className="ms-auto"
//                   onClick={() => handleAccept(user._id)}
//                 >
//                   Accept
//                 </Button>
//                 <Button
//                   variant="danger"
//                   className="ms-2"
//                   onClick={() => handleDecline(user._id)}
//                 >
//                   Decline
//                 </Button>
//               </ListGroup.Item>
//             ))
//           ) : (
//             <p className="text-muted">No connection requests</p>
//           )}

//           <h5>Connections</h5>
//           {connections.length > 0 ? (
//             connections.map((user) => (
//               <ListGroup.Item key={user._id} className="d-flex align-items-center">
//                 <div>
//                   <h6>{user.name}</h6>
//                   <small>{user.jobTitle}</small>
//                 </div>
//                 <Button variant="danger" className="ms-auto">
//                   Block
//                 </Button>
//               </ListGroup.Item>
//             ))
//           ) : (
//             <p className="text-muted">No connections</p>
//           )}
//         </ListGroup>
//       </Card>
//     </div>
//   );
// };

// export default MyNetwork;
import React, { useEffect, useState } from "react";
import { Button, ListGroup, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./MyNetwork.css"; // Import custom CSS

const MyNetwork = () => {
  const location = useLocation();
  const { targetUserId } = location.state || {}; // Extract userId and targetUserId from state

  const userId = localStorage.getItem("userId");
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("targetUserId from localStorage:", targetUserId); // Log targetUserId to check

  useEffect(() => {
    if (!userId) return; // Avoid making API calls if userId is not available

    const fetchNetwork = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/user/suggestions/mynetwork?userId=${userId}`
        );
        console.log("response.data:", response.data); // Log response data to check
        setConnections(response.data.connections || []);
        setConnectionRequests(response.data.connectionRequests || []);
      } catch (error) {
        setError("Failed to fetch network data");
        console.error("Error fetching network:", error); // Log error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchNetwork();
  }, [userId]); // Dependency on userId

  const handleAccept = async (targetUserId) => {
    try {
      await axios.post("http://localhost:5000/api/user/suggestions/accept", {
        userId,
        targetUserId,
      });
      setConnections((prevConnections) => [
        ...prevConnections,
        { _id: targetUserId },
      ]);
      setConnectionRequests((prevRequests) =>
        prevRequests.filter((user) => user._id !== targetUserId)
      );
      alert("Connection accepted!");
    } catch (error) {
      alert("Failed to accept connection");
      console.error("Error accepting connection:", error); // Log error for debugging
    }
  };

  const handleDecline = async (targetUserId) => {
    try {
      await axios.post("http://localhost:5000/api/user/suggestions/decline", {
        userId,
        targetUserId,
      });
      setConnectionRequests((prevRequests) =>
        prevRequests.filter((user) => user._id !== targetUserId)
      );
      alert("Connection declined!");
    } catch (error) {
      alert("Failed to decline connection");
      console.error("Error declining connection:", error); // Log error for debugging
    }
  };

  const handleBlock = async (targetUserId) => {
    try {
      await axios.post("http://localhost:5000/api/user/suggestions/block", {
        userId,
        targetUserId,
      });
      setConnections((prevConnections) =>
        prevConnections.filter((user) => user._id !== targetUserId)
      );
      alert("User blocked!");
    } catch (error) {
      alert("Failed to block user");
      console.error("Error blocking user:", error); // Log error for debugging
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="my-network-container">
      <Card className="mb-3">
        <Card.Header>
          <h4>My Network</h4>
        </Card.Header>
        <ListGroup variant="flush">
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Connection Requests */}
          <h5 className="mt-3 ms-3">Connection Requests</h5>
          <div className="horizontal-scroll">
            {connectionRequests.length > 0 ? (
              connectionRequests.map((user) => (
                <ListGroup.Item key={user._id} className="network-item">
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
                    {/* Job Title and Company */}
                    <small className="text-muted mb-2">
                      {user.jobTitle} at {user.company}
                    </small>
                    {/* Buttons */}
                    <div className="d-flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAccept(user._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDecline(user._id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-muted ms-3">No connection requests</p>
            )}
          </div>

          {/* Connections */}
          <h5 className="mt-3 ms-3">Connections</h5>
          <div className="horizontal-scroll">
            {connections.length > 0 ? (
              connections.map((user) => (
                <ListGroup.Item key={user._id} className="network-item">
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
                    {/* Job Title and Company */}
                    <small className="text-muted mb-2">
                      {user.jobTitle} at {user.company}
                    </small>
                    {/* Buttons */}
                    <div className="d-flex gap-2">
                      <Button variant="primary" size="sm">
                        Message
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleBlock(user._id)}
                      >
                        Block
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-muted ms-3">No connections</p>
            )}
          </div>
        </ListGroup>
      </Card>
    </div>
  );
};

export default MyNetwork;