import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, ListGroup, Button, Form, Col, Row, Alert, Spinner, Modal } from "react-bootstrap";

const Experience = ({ userId }) => {
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    company: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editExperience, setEditExperience] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/experience/${userId}`);
        setExperiences(data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        setError("Failed to load experiences.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [userId]);

  const handleAddExperience = async () => {
    if (!newExperience.company || !newExperience.jobTitle || !newExperience.startDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (newExperience.endDate && newExperience.endDate < newExperience.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`http://localhost:5000/experience/${userId}`, newExperience);
      setExperiences([...experiences, data]);
      setNewExperience({ company: "", jobTitle: "", startDate: "", endDate: "", description: "" });
      setSuccessMessage("Experience added successfully!");
      setError(null);
    } catch (error) {
      console.error("Error adding experience:", error);
      setError("Failed to add new experience.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditExperience = (experience) => {
    setEditExperience(experience);
    setShowEditModal(true);
  };

  const handleUpdateExperience = async () => {
    if (!editExperience.company || !editExperience.jobTitle || !editExperience.startDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (editExperience.endDate && editExperience.endDate < editExperience.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `http://localhost:5000/experience/${editExperience._id}`,
        editExperience
      );
      setExperiences(experiences.map((exp) => (exp._id === data._id ? data : exp)));
      setShowEditModal(false);
      setSuccessMessage("Experience updated successfully!");
      setError(null);
    } catch (error) {
      console.error("Error updating experience:", error);
      setError("Failed to update experience.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/experience/${id}`);
      setExperiences(experiences.filter((exp) => exp._id !== id));
      setSuccessMessage("Experience deleted successfully!");
      setError(null);
    } catch (error) {
      console.error("Error deleting experience:", error);
      setError("Failed to delete experience.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="experience-section mt-4">
      <h2>Experience</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : experiences.length > 0 ? (
        experiences.map((exp) => (
          <Card key={exp._id} className="mb-3">
            <Card.Body>
              <Card.Title>{exp.company}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{exp.jobTitle}</Card.Subtitle>
              <Card.Text>
                <strong>Duration:</strong> {exp.startDate} - {exp.endDate || "Present"}
              </Card.Text>
              <Card.Text>
                <strong>Description:</strong> {exp.description}
              </Card.Text>
              <Button variant="primary" onClick={() => handleEditExperience(exp)}>
                Edit
              </Button>{" "}
              <Button variant="danger" onClick={() => handleDeleteExperience(exp._id)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No experiences found.</p>
      )}

      <div className="mt-4">
        <h3>Add Experience</h3>
        <Form>
          <Form.Group controlId="company">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter company name"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="jobTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter job title"
              value={newExperience.jobTitle}
              onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
              required
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newExperience.endDate}
                  onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Describe your experience"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleAddExperience} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Add Experience"}
          </Button>
        </Form>
      </div>

      {/* Edit Experience Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editCompany">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                value={editExperience?.company || ""}
                onChange={(e) => setEditExperience({ ...editExperience, company: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="editJobTitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter job title"
                value={editExperience?.jobTitle || ""}
                onChange={(e) => setEditExperience({ ...editExperience, jobTitle: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group controlId="editStartDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editExperience?.startDate || ""}
                    onChange={(e) => setEditExperience({ ...editExperience, startDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="editEndDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editExperience?.endDate || ""}
                    onChange={(e) => setEditExperience({ ...editExperience, endDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="editDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your experience"
                value={editExperience?.description || ""}
                onChange={(e) => setEditExperience({ ...editExperience, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateExperience} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Experience;