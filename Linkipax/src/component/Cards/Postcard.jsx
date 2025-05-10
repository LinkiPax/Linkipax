// import React, { useState } from "react";
// import axios from 'axios';
// import { Card, Button, Row, Col, Form } from "react-bootstrap";
// import { FaThumbsUp, FaComment, FaShare, FaPaperPlane, FaHeart } from 'react-icons/fa';
// import { useNavigate } from "react-router-dom";
// const Postcard = ({ post }) => {
//   console.log("Postcard:", post);
//   const navigate = useNavigate(); // React Router hook for navigation
//   const {content, imageUrl, createdBy, likes = [] } =post;
//   // const { name, profilePicture, designation } = createdBy || {};
//   const { _id: userId, name, profilePicture, designation } = createdBy || {};
//   const [showCommentBox, setShowCommentBox] = useState(false);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [likeCount, setLikeCount] = useState(Array.isArray(likes) ? likes.length : 0);
//   const [liked, setLiked] = useState(Array.isArray(likes) ? likes.includes(localStorage.getItem("userId")) : false);  
//   const handleCommentClick = () => {
//     setShowCommentBox((prevState) => !prevState);
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (comment.trim()) {
//       try {
//         setLoading(true);
//         console.log("Posting comment:", comment);
//         // Simulate API request
//         // const response = await axios.post('api/comments', { postId, comment });

//         setComment("");
//         setShowCommentBox(false);
//       } catch (error) {
//         console.error("Error posting comment:", error);
//         alert("Something went wrong. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       alert("Please enter a comment");
//     }
//   };
//   const handleProfileClick = () => {
//     if (userId) {
//       navigate(`/profile-view/${userId}`);
//     } else {
//       alert("User profile not available.");
//     }
//   };
//   const toggleLike = async () => {
//     try {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         alert("User ID not found. Please log in.");
//         return;
//       }
  
//       console.log("Toggling like for post:", post._id, "by user:", userId);
  
//       const res = await axios.post(
//         `http://localhost:5000/api/posts/like/${post._id}`,
//         { userId });
//       console.log("Like API response:", res.data);
  
//       if (res.data) {
//         setLikeCount(res.data.likes);
//         setLiked(res.data.liked);
//       } else {
//         console.error("Unexpected API response format:", res);
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//       alert("An error occurred while processing your request.");
//     }
//   };
  
  
//   return (
//     <Card className="mb-4 shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
//       {/* Profile Section */}
//       <Card.Body>
//         <Row className="align-items-center">
//           <Col xs="auto">
//             <img
//               src={profilePicture || `https://ui-avatars.com/api/?name=${name}&size=50`}
//               alt="Profile"
//               className="rounded-circle"
//               style={{ width: "50px", height: "50px", objectFit: "cover" }}
//               onClick={handleProfileClick}
//             />
//           </Col>
//           <Col>
//             <h5 className="mb-0" onClick={handleProfileClick}>{name || "Unknown User"}</h5>
//             <small className="text-muted" onClick={handleProfileClick}>{designation || "No designation available"}</small>
//           </Col>
//           <Col xs="auto">
//             <Button variant="outline-primary" size="sm" onClick={handleProfileClick}>
//               View Profile
//             </Button>
//           </Col>
//         </Row>
//       </Card.Body>

//       {/* Content Section */}
//       <Card.Body>
//         <p>{content || "No content available."}</p>
//         {imageUrl && <img src={imageUrl} alt="Post Content" className="img-fluid rounded" />}
//       </Card.Body>

//       {/* Action Buttons */}
//       <Card.Footer className="d-flex justify-content-around">
//       <Button
//   variant="light"
//   className={`d-flex align-items-center gap-2 border-0 ${
//     liked ? "text-danger" : "text-secondary"
//   }`}
//   onClick={toggleLike}
// >
//   <FaHeart className={`fs-4 ${liked ? "animate__animated animate__heartBeat" : "hover-scale"}`} />
//   <span className="fw-bold">{likeCount}</span>
// </Button>
//         <Button variant="light" className="text-primary" onClick={handleCommentClick}>
//           <FaComment /> Comment
//         </Button>
//         <Button variant="light" className="text-primary">
//           <FaShare /> Repost
//         </Button>
//         <Button variant="light" className="text-primary">
//           <FaPaperPlane /> Send
//         </Button>
//       </Card.Footer>

//       {/* Comment Section */}
//       {showCommentBox && (
//         <Card.Body>
//           <Form onSubmit={handleCommentSubmit}>
//             <Form.Group controlId="comment">
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="Write a comment..."
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit" disabled={loading}>
//               {loading ? 'Posting...' : 'Post Comment'}
//             </Button>
//           </Form>
//         </Card.Body>
//       )}
//     </Card>
//   );
// };

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { FaThumbsUp, FaComment, FaShare, FaPaperPlane, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Postcard.css"; // Import custom CSS

const Postcard = ({ post }) => {
  const navigate = useNavigate();
  const { content, imageUrl, createdBy, likes = [] } = post;
  const { _id: userId, name, profilePicture, designation } = createdBy || {};
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [liked, setLiked] = useState(likes.includes(localStorage.getItem("userId")));
  const [comments, setComments] = useState([]);

  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${post._id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to fetch comments. Please try again.");
    }
  };

  // Fetch comments when the comment box is shown
  useEffect(() => {
    if (showCommentBox) {
      fetchComments();
    }
  }, [showCommentBox]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`, {
          content: comment,
          createdBy: localStorage.getItem("userId"),
        });
        setComments((prevComments) => [...prevComments, response.data]);
        setComment("");
      } catch (error) {
        console.error("Error posting comment:", error);
        alert("Failed to post comment. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a comment");
    }
  };

  // Handle like/unlike
  const toggleLike = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("User ID not found. Please log in.");
        return;
      }
      const res = await axios.post(`http://localhost:5000/api/posts/like/${post._id}`, { userId });
      setLikeCount(res.data.likes);
      setLiked(res.data.liked);
    } catch (error) {
      console.error("Error liking post:", error);
      alert("An error occurred while processing your request.");
    }
  };

  // Navigate to user profile
  const handleProfileClick = () => {
    if (userId) {
      navigate(`/profile-view/${userId}`);
    } else {
      alert("User profile not available.");
    }
  };

  return (
    <Card className="post-card">
      {/* Profile Section */}
      <Card.Body className="post-header">
        <Row className="align-items-center">
          <Col xs="auto">
            <img
              src={profilePicture || `https://ui-avatars.com/api/?name=${name}&size=50`}
              alt="Profile"
              className="profile-picture"
              onClick={handleProfileClick}
            />
          </Col>
          <Col>
            <h5 className="mb-0" onClick={handleProfileClick}>
              {name || "Unknown User"}
            </h5>
            <small className="text-muted" onClick={handleProfileClick}>
              {designation || "No designation available"}
            </small>
          </Col>
          <Col xs="auto">
            <Button variant="outline-primary" size="sm" onClick={handleProfileClick}>
              View Profile
            </Button>
          </Col>
        </Row>
      </Card.Body>

      {/* Content Section */}
      <Card.Body className="post-content">
        <p>{content || "No content available."}</p>
        {imageUrl && <img src={imageUrl} alt="Post Content" className="post-image" />}
      </Card.Body>

      {/* Action Buttons */}
      <Card.Footer className="post-footer">
        <Button
          variant="light"
          className={`like-button ${liked ? "liked" : ""}`}
          onClick={toggleLike}
        >
          <FaHeart className="icon" />
          <span className="count">{likeCount}</span>
        </Button>
        <Button
          variant="light"
          className="comment-button"
          onClick={() => setShowCommentBox(!showCommentBox)}
        >
          <FaComment className="icon" />
          <span className="button-text">Comment</span>
        </Button>
        <Button variant="light" className="share-button">
          <FaShare className="icon" />
          <span className="button-text">Repost</span>
        </Button>
        <Button variant="light" className="send-button">
          <FaPaperPlane className="icon" />
          <span className="button-text">Send</span>
        </Button>
      </Card.Footer>

      {/* Comment Section */}
      {showCommentBox && (
        <Card.Body className="comment-section">
          <Form onSubmit={handleCommentSubmit}>
            <Form.Group controlId="comment">
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading} className="submit-button">
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </Form>

          {/* Display Comments */}
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <strong>{comment.createdBy.name}: </strong>
                <span>{comment.content}</span>
              </div>
            ))}
          </div>
        </Card.Body>
      )}
    </Card>
  );
};

export default Postcard;