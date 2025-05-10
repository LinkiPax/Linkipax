import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment'; // Optional: for date formatting
import './EventsCard.css'; // Import custom CSS for styling

const EventsCard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get('http://localhost:5000/api/events')
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="events-card">
        <Card.Header>Upcoming Events</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item className="text-center">
            <Spinner animation="border" variant="primary" /> Loading events...
          </ListGroup.Item>
        </ListGroup>
      </Card>
    );
  }

  return (
    <Card className="events-card">
      <Card.Header>Upcoming Events</Card.Header>
      <ListGroup variant="flush">
        {error ? (
          <ListGroup.Item>
            <Alert variant="danger">{error}</Alert>
          </ListGroup.Item>
        ) : events.length ? (
          events.map((event) => (
            <ListGroup.Item key={event._id} className="event-item">
              <div className="event-content">
                <strong>{event.title}</strong>
                <br />
                <small>
                  {moment(event.date).format('MMM Do YYYY')} | {event.time}
                </small>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                href={`/events/${event._id}`}
                aria-label={`View details for ${event.title}`}
              >
                View Details
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No upcoming events.</ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default EventsCard;