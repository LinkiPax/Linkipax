import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './AdvertisementCard.css'; // Import custom CSS for styling

// Advertisement Card
const AdvertisementCard = ({ title, description, buttonText, onButtonClick }) => {
  const handleLearnMore = () => {
    alert("Redirecting to the premium upgrade page...");
    if (onButtonClick) onButtonClick(); // Call the custom button click handler if provided
  };

  return (
    <Card className="advertisement-card">
      <Card.Body className="text-center">
        <h5 className="card-title">{title || "Upgrade to Premium"}</h5>
        <p className="card-description">
          {description || "Enjoy ad-free browsing and exclusive features!"}
        </p>
        <Button
          variant="primary"
          className="card-button"
          onClick={handleLearnMore}
          aria-label="Learn more about premium features"
        >
          {buttonText || "Learn More"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AdvertisementCard;