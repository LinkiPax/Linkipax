import React, { useState, useEffect } from "react";
import { Button, Form, Badge, Spinner, Alert, ListGroup, Row, Col } from "react-bootstrap";
import axios from "axios";

const SkillSection = ({ userId, updateSkills }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Fetch skills on component mount
  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/skill/${userId}`);
        setSkills(data.skills || []);
      } catch (error) {
        setError("Error fetching skills.");
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [userId]);

  // Fetch skill suggestions as the user types
  useEffect(() => {
    if (newSkill.trim()) {
      const fetchSuggestions = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/skill/suggestions?query=${newSkill}`);
          setSkillSuggestions(data.suggestions || []);
        } catch (error) {
          console.error("Error fetching skill suggestions:", error);
        }
      };

      fetchSuggestions();
    } else {
      setSkillSuggestions([]);
    }
  }, [newSkill]);

  // Add a new skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      setError("Please enter a skill.");
      return;
    }
    if (skills.includes(newSkill.trim())) {
      setError("Skill already added.");
      return;
    }

    setIsAddingSkill(true);
    try {
      const updatedSkills = [...skills, newSkill.trim()];
      await axios.post(`http://localhost:5000/skill/${userId}`, { skills: updatedSkills });
      setSkills(updatedSkills);
      setNewSkill("");
      updateSkills(updatedSkills); // Trigger career suggestions update
      setError(null); // Reset error
    } catch (error) {
      setError("Error adding skill.");
      console.error("Error adding skill:", error);
    } finally {
      setIsAddingSkill(false);
    }
  };

  // Remove a skill
  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
      await axios.post(`http://localhost:5000/skill/${userId}`, { skills: updatedSkills });
      setSkills(updatedSkills);
      updateSkills(updatedSkills); // Trigger career suggestions update
    } catch (error) {
      setError("Error removing skill.");
      console.error("Error removing skill:", error);
    }
  };

  // Handle skill suggestion click
  const handleSuggestionClick = (suggestion) => {
    setNewSkill(suggestion);
    setSkillSuggestions([]);
  };

  return (
    <div className="skill-section p-3 border rounded">
      <h3>Skills</h3>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="mb-3">
          {skills.length === 0 ? (
            <p className="text-muted">No skills added yet.</p>
          ) : (
            <Row>
              {skills.map((skill, index) => (
                <Col key={index} xs={6} md={4} lg={3} className="mb-2">
                  <Badge pill bg="primary" className="d-flex align-items-center justify-content-between">
                    <span>{skill}</span>
                    <span
                      style={{ cursor: "pointer", marginLeft: "5px" }}
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      &times;
                    </span>
                  </Badge>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}

      {/* Add Skill Form */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        {skillSuggestions.length > 0 && (
          <ListGroup className="mt-2">
            {skillSuggestions.map((suggestion, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => handleSuggestionClick(suggestion)}
                style={{ cursor: "pointer" }}
              >
                {suggestion}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form.Group>

      <Button
        variant="primary"
        onClick={handleAddSkill}
        disabled={isAddingSkill || !newSkill.trim()}
      >
        {isAddingSkill ? <Spinner animation="border" size="sm" /> : "Add Skill"}
      </Button>
    </div>
  );
};

export default SkillSection;