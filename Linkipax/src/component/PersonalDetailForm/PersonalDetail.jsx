import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { Form, Button, Container } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';
import './PersonalDetails.css';  // Custom CSS file for the styling

function PersonalDetails() {
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [bio, setBio] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();  // Declare useNavigate

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      setError('User ID is missing! Redirecting to home...');
      setTimeout(() => navigate('/home'), 3000);
      return;
    }
  
    try {
      await axios.post(`http://localhost:5000/user/update-details/${userId}`, {
        name,
        profilePicture,
        bio,
        jobTitle,
        company,
      });
      navigate(`/home/${userId}`); // Redirect to home page after successful update
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };
  
  return (
    <Container className="mt-5">
      <h1 className='logo'>Linkify</h1>

      <div className="personal-details-form">
        <h2 className="text-center mb-4">Update Your Details</h2>
        <p className="text-center mb-4">Let us know more about you</p>

        <Form onSubmit={handleUpdateDetails}>
          <Form.Group controlId="name">
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>

          <Form.Group controlId="profilePicture">
            <Form.Control
              type="text"
              placeholder="Enter profile picture URL"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>

          <Form.Group controlId="bio">
            <Form.Control
              type="text"
              placeholder="Write a short bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>

          <Form.Group controlId="jobTitle">
            <Form.Control
              type="text"
              placeholder="Your job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>

          <Form.Group controlId="company">
            <Form.Control
              type="text"
              placeholder="Your company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mt-3 submit-button">
            Submit
          </Button>
        </Form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </Container>
  );
}

export default PersonalDetails;
