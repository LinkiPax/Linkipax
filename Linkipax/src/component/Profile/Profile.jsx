import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Modal, Spinner, Row, Col, Alert, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import NavbarComponent from '../navbar/Navbar';
import './ProfilePage.css';
import ProfileHeader from './ProfileHeader';
import Experience from './Experience';
import Education from './Education';
import CareerSuggestion from './CareerSuggestion';
import AnalyticsDashboard from './AnalyticsDashboard';
import TrendingSection from './TrendingSection';
import SkillSection from './Skill';

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    company: "",
    jobTitle: "",
    backgroundImage: "",
    profilePicture: "",
  });
  const [posts, setPosts] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [analytics, setAnalytics] = useState({ views: 0, impressions: 0 });
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        
        const data = response.data;
        console.log(data.connections.length);
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          bio: data.bio,
          company: data.company,
          jobTitle: data.jobTitle,
          backgroundImage: data.backgroundImage || "default.jpg",
          profilePicture: data.profilePicture || "default-profile.jpg",
        });
        setPosts(data.posts || []);
        setExperiences(data.experiences || []);
        setEducation(data.education || []);
        setSkills(data.skills || []);
        setAnalytics(data.analytics || { views: 0, impressions: 0 });
      } catch (error) {
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEditProfile = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setUser({ ...user, ...formData });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving user data:", error);
      setError("Error saving profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-5">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div>
      <NavbarComponent />
      <Container fluid className="mt-3 px-3 main-content">
        <ProfileHeader user={user} formData={formData} handleEditProfile={handleEditProfile} userId={userId} />
        <Row>
          <Col md={8}>
            <Experience experiences={experiences} userId={userId} />
            <SkillSection skills={skills} userId={userId} />
            <Education education={education} userId={userId} />
            <CareerSuggestion user={user} userId={userId} />
            <AnalyticsDashboard analytics={analytics} profileId={userId} postId={posts[0]?._id} />
          </Col>

          <Col md={4}>
            <TrendingSection posts={posts} userId={userId} />
          </Col>
        </Row>
      </Container>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="company">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="jobTitle">
              <Form.Label>Job Title</Form.Label>
              <Form.Control
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="backgroundImage">
              <Form.Label>Background Image URL</Form.Label>
              <Form.Control
                type="text"
                name="backgroundImage"
                value={formData.backgroundImage}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="profilePicture">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                name="profilePicture"
                onChange={handleFileChange}
              />
              {formData.profilePicture && (
                <Image src={formData.profilePicture} roundedCircle width="100" height="100" className="mt-2" />
              )}
            </Form.Group>
            <Button variant="primary" onClick={handleSaveChanges} disabled={loading}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfilePage;