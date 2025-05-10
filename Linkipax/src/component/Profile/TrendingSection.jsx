import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Card, Row, Col, Button } from 'react-bootstrap';
import './TrendingSection.css'; // Create and style this CSS file for the section

const TrendingSection = () => {
  const [googleTrends, setGoogleTrends] = useState([]);
  const [githubTrends, setGithubTrends] = useState([]);
  const [newsTrends, setNewsTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visibleTrends, setVisibleTrends] = useState(5); // Number of visible trends per category

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        setLoading(true);
        setError(false);

        // Fetch all trending data
        const response = await axios.get('http://localhost:5000/external/trending');
        setGoogleTrends(response.data.googleTrends || []);
        setGithubTrends(response.data.githubTrends || []);
        setNewsTrends(response.data.newsTrends || []);
      } catch (error) {
        console.error('Error fetching trending data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  const handleShowMore = () => {
    setVisibleTrends((prev) => prev + 5); // Show 5 more trends
  };

  if (loading) {
    return (
      <div className="trending-section-loading text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading trending data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="trending-section-error">
        Failed to load trending data. Please try again later.
      </Alert>
    );
  }

  return (
    <div className="trending-section p-3">
      <h2 className="mb-4">Trending</h2>

      {/* Google Trends */}
      <div className="trending-category mb-4">
        <h3 className="mb-3">🔥 Google Trends</h3>
        {googleTrends.length > 0 ? (
          <Row>
            {googleTrends.slice(0, visibleTrends).map((trend, index) => (
              <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <a
                        href={`https://trends.google.com${trend.exploreLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {trend.query}
                      </a>
                    </Card.Title>
                    <Card.Text>
                      <small className="text-muted">
                        Searches: {trend.traffic || 'N/A'}
                      </small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No Google trends available.</p>
        )}
        {googleTrends.length > visibleTrends && (
          <Button variant="outline-primary" onClick={handleShowMore}>
            Show More
          </Button>
        )}
      </div>

      {/* GitHub Trends */}
      <div className="trending-category mb-4">
        <h3 className="mb-3">🚀 GitHub Trends</h3>
        {githubTrends.length > 0 ? (
          <Row>
            {githubTrends.slice(0, visibleTrends).map((repo, index) => (
              <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                    </Card.Title>
                    <Card.Text>
                      <small className="text-muted">
                        Language: {repo.language || 'Unknown'} | ⭐ {repo.stars}
                      </small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No GitHub trends available.</p>
        )}
        {githubTrends.length > visibleTrends && (
          <Button variant="outline-primary" onClick={handleShowMore}>
            Show More
          </Button>
        )}
      </div>

      {/* News Trends */}
      <div className="trending-category mb-4">
        <h3 className="mb-3">📰 News Trends</h3>
        {newsTrends.length > 0 ? (
          <Row>
            {newsTrends.slice(0, visibleTrends).map((article, index) => (
              <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </a>
                    </Card.Title>
                    <Card.Text>
                      <small className="text-muted">
                        Source: {article.source || 'Unknown'}
                      </small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No news trends available.</p>
        )}
        {newsTrends.length > visibleTrends && (
          <Button variant="outline-primary" onClick={handleShowMore}>
            Show More
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrendingSection;