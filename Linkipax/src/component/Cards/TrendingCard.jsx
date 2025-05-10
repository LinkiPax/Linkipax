import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TrendingTopicsCard.css'; // Import custom CSS

const TrendingTopicsCard = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleTopicClick = (topic) => {
    navigate(`/search?topic=${topic.title}`); // Use topic.title if the API sends objects
  };

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trending-topics'); // Adjust the endpoint
        setTopics(response.data);
      } catch (err) {
        setError('Failed to load trending topics.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  return (
    <Card className="trending-topics-card">
      <Card.Header>Trending Topics</Card.Header>
      <ListGroup variant="flush">
        {loading ? (
          <ListGroup.Item className="text-center">
            <Spinner animation="border" size="sm" /> Loading topics...
          </ListGroup.Item>
        ) : error ? (
          <ListGroup.Item className="text-danger">{error}</ListGroup.Item>
        ) : topics.length > 0 ? (
          topics.map((topic, index) => (
            <ListGroup.Item
              key={index}
              onClick={() => handleTopicClick(topic)}
              className="topic-item"
            >
              <span className="hashtag">#</span>
              <span className="topic-title">{topic.title}</span> {/* Replace topic.title with the actual property */}
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No trending topics found.</ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default TrendingTopicsCard;