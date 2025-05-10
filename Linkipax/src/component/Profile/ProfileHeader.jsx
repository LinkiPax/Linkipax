import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert, Container, Row, Col, Button, ProgressBar, Modal } from "react-bootstrap";
import { PencilFill, Share, CheckCircle, Camera } from "react-bootstrap-icons";
import './ProfilePageHeader.css';

const ProfileHeader = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/profile/merged-user-details/${userId}`);
        console.log("Profile Data:", data);
        setProfile(data);
        setBackgroundImage(data.backgroundImage);
        console.log(data.backgroundImage);
      } catch (error) {
        setError("Error fetching profile. Please try again.");
        console.error("Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleBackgroundChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("backgroundImage", file);
    formData.append("userId", userId);

    try {
      // Upload background image to server
      await axios.post(`http://localhost:5000/profile/user-details`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Fetch updated profile data to reflect changes
      const { data } = await axios.get(`http://localhost:5000/profile/merged-user-details/${userId}`);
      console.log("Updated Profile Data:", data);
      setBackgroundImage(`http://localhost:5000/${data.backgroundImage}`);
    } catch (error) {
      console.error("Error updating background:", error);
    }
  };
  

  if (loading) return <Spinner animation="border" variant="primary" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="text-center">{error}</Alert>;

  const shareProfile = () => {
    const shareText = `Check out ${profile.name}'s profile on Linkify!`;
    const profileURL = `http://localhost:3000/profile/${userId}`;
    
    if (navigator.share) {
      navigator.share({ title: "Linkify Profile", text: shareText, url: profileURL });
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <Container className="profile-header p-4 text-center">
      {/* Background Image with Edit Button */}
      <div
        className="background-image position-relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          height: "150px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <label className="position-absolute bg-dark text-white p-1 rounded" style={{ right: 10, bottom: 10, cursor: "pointer" }}>
          <Camera size={20} />
          <input type="file" accept="image/*" onChange={handleBackgroundChange} style={{ display: "none" }} />
        </label>
      </div>
      
      {/* Profile Image */}
      <div className="position-relative d-flex justify-content-center" style={{ marginTop: "-60px" }}>
        <img
          src={profile.profilePicture}
          alt={`Profile of ${profile.name}`}
          className="rounded-circle border border-primary"
          style={{ width: "120px", height: "120px", objectFit: "cover", borderWidth: "3px" }}
        />
        {profile.isVerified && (
          <CheckCircle className="text-primary position-absolute" size={20} style={{ bottom: 5, right: 5 }} />
        )}
      </div>

      {/* Profile Details */}
      <h2 className="mt-3 mb-1" style={{ fontSize: "1.5rem" }}>{profile.name}</h2>
      <p className="text-muted mb-1" style={{ fontSize: "1rem" }}>{profile.jobTitle}</p>
      <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>{profile.bio}</p>
      <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
        <i className="bi bi-geo-alt-fill"></i> {profile.location} | <strong>{profile.connections.length}</strong> connections
      </p>

      {/* Profile Completion */}
      <div className="mt-3 px-3">
        <ProgressBar now={profile.profileCompletion} label={`${profile.profileCompletion}%`} className="mb-2" />
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center mt-2">
        <Button variant="outline-primary" className="mx-2" onClick={shareProfile}>
          <Share /> Share
        </Button>
        <Button variant="outline-secondary" className="mx-2">
          <PencilFill /> Edit Profile
        </Button>
      </div>

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Share {profile.name}'s profile:</p>
          <Button variant="success" className="w-100 mb-2" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(profileURL)}`)}>
            Share on WhatsApp
          </Button>
          <Button variant="primary" className="w-100 mb-2" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(profileURL)}`)}>
            Share on LinkedIn
          </Button>
          <Button variant="info" className="w-100" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileURL)}`)}>
            Share on Twitter
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProfileHeader;