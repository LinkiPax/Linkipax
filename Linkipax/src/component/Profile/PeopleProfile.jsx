import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Badge, Alert, ProgressBar, ListGroup } from "react-bootstrap";

const PeopleProfile = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [profileData, setProfileData] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    // Fetch user profile data
    axios
      .get(`http://localhost:5000/user/${userId}`)
      .then((response) => {
        setProfileData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data.");
      })
      .finally(() => {
        setLoading(false);
      });

    // Check connection status
    axios
      .get(`http://localhost:5000/connections/status/${localStorage.getItem("userId")}/${userId}`)
      .then((response) => {
        setConnectionStatus(response.data.status);
      })
      .catch((error) => {
        console.error("Error fetching connection status:", error);
      });
  }, [userId]);

  const sendConnectionRequest = () => {
    axios
      .post("http://localhost:5000/connections/request", {
        senderId: localStorage.getItem("userId"),
        receiverId: userId,
      })
      .then(() => {
        setConnectionStatus("pending");
      })
      .catch((error) => {
        console.error("Error sending connection request:", error);
        setError("Failed to send connection request.");
      });
  };

  const acceptConnectionRequest = () => {
    axios
      .post("http://localhost:5000/connections/accept", {
        senderId: userId,
        receiverId: localStorage.getItem("userId"),
      })
      .then(() => {
        setConnectionStatus("connected");
      })
      .catch((error) => {
        console.error("Error accepting connection request:", error);
        setError("Failed to accept connection request.");
      });
  };

  const withdrawConnectionRequest = () => {
    axios
      .post("http://localhost:5000/connections/withdraw", {
        senderId: localStorage.getItem("userId"),
        receiverId: userId,
      })
      .then(() => {
        setConnectionStatus("none");
      })
      .catch((error) => {
        console.error("Error withdrawing connection request:", error);
        setError("Failed to withdraw connection request.");
      });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const {
    name = "Unknown User",
    jobTitle = "No job title provided",
    location = "Location not specified",
    bio = "No bio available",
    profilePicture = "https://via.placeholder.com/150",
    skills = [],
    experience = [],
    education = [],
    socialLinks = {},
    profileCompletion = 75, // Example profile completeness percentage
  } = profileData;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4} className="text-center">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="rounded-circle img-fluid"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                </Col>
                <Col md={8}>
                  <h3 className="text-primary">{name}</h3>
                  <p className="text-muted mb-1">{jobTitle}</p>
                  <p className="mb-1">
                    <Badge bg="secondary">{location}</Badge>
                  </p>
                  <p className="text-muted">{bio}</p>
                  <div className="mt-3">
                    {connectionStatus === "none" && (
                      <Button variant="primary" onClick={sendConnectionRequest}>
                        Connect
                      </Button>
                    )}
                    {connectionStatus === "pending" && (
                      <Button variant="secondary" disabled>
                        Request Sent
                      </Button>
                    )}
                    {connectionStatus === "connected" && (
                      <Button variant="success" onClick={() => alert("Send Message")}>
                        Message
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Profile Completeness */}
          <Card className="mt-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Profile Strength: {profileCompletion}%</span>
                <Button variant="link" size="sm">
                  Complete Profile
                </Button>
              </div>
              <ProgressBar now={profileCompletion} label={`${profileCompletion}%`} className="mt-2" />
            </Card.Body>
          </Card>

          {/* Skills Section */}
          {skills.length > 0 && (
            <Card className="mt-3 shadow-sm">
              <Card.Body>
                <h5>Skills</h5>
                <div className="d-flex flex-wrap">
                  {skills.map((skill, index) => (
                    <Badge key={index} pill bg="primary" className="me-2 mb-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <Card className="mt-3 shadow-sm">
              <Card.Body>
                <h5>Experience</h5>
                <ListGroup variant="flush">
                  {experience.map((exp, index) => (
                    <ListGroup.Item key={index}>
                      <strong>{exp.title}</strong> at {exp.company}
                      <br />
                      <small className="text-muted">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <Card className="mt-3 shadow-sm">
              <Card.Body>
                <h5>Education</h5>
                <ListGroup variant="flush">
                  {education.map((edu, index) => (
                    <ListGroup.Item key={index}>
                      <strong>{edu.degree}</strong> at {edu.institution}
                      <br />
                      <small className="text-muted">
                        {edu.startDate} - {edu.endDate || "Present"}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {/* Social Links */}
          {Object.keys(socialLinks).length > 0 && (
            <Card className="mt-3 shadow-sm">
              <Card.Body>
                <h5>Social Links</h5>
                <div className="d-flex flex-wrap">
                  {Object.entries(socialLinks).map(([key, link]) => (
                    <a
                      key={key}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm me-2 mb-2"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PeopleProfile;