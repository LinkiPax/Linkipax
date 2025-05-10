import React, { useState } from "react";
import axios from "axios";
import SkillSection from "./Skill";
import { Card, Spinner, Alert, ListGroup, Button } from "react-bootstrap";

const CareerSuggestion = ({ userId }) => {
  const [skills, setSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch career suggestions based on skills
  const fetchSuggestions = async (updatedSkills) => {
    if (updatedSkills.length === 0) return; // Don't call API if no skills are provided

    try {
      setLoading(true);
      setError(null);

      const prompt = `Based on these skills: ${updatedSkills.join(
        ", "
      )}, suggest career paths and additional skills or technologies to learn.`;

      const { data } = await axios.post(`http://localhost:5000/openai/`, { prompt });
      setSuggestions(data.suggestions || []); // Ensure suggestions is always an array
    } catch (err) {
      console.error("Error fetching career suggestions:", err);
      setError("Failed to fetch career suggestions.");
    } finally {
      setLoading(false);
    }
  };

  // Callback function when skills are updated
  const handleSkillsUpdate = (updatedSkills) => {
    setSkills(updatedSkills); // Update local state for skills
    fetchSuggestions(updatedSkills); // Fetch new suggestions
  };

  return (
    <div className="career-suggestion-section">

      <div className="career-suggestions mt-4">
        <h2>Career Suggestions</h2>

        {loading && (
          <Spinner animation="border" variant="primary" />
        )}

        {error && (
          <Alert variant="danger">{error}</Alert>
        )}

        {!loading && !error && (
          <Card>
            <Card.Body>
              <Card.Title>Suggested Career Paths</Card.Title>
              <ListGroup variant="flush">
                {Array.isArray(suggestions) && suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <ListGroup.Item key={index}>
                      {suggestion}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No suggestions available.</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CareerSuggestion;
