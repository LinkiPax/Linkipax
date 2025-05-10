import React, { useState } from 'react';
import { Card, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './CreatePostCard.css'; // Import custom CSS for styling

const CreatePostCard = ({ userId }) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePost = async () => {
    if (!content.trim()) {
      setError('Post content cannot be empty!');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const newPost = {
        content,
        mediaUrl,
        mediaType,
        createdBy: userId, // Replace with dynamic user ID
      };

      const response = await axios.post('http://localhost:5000/api/posts', newPost);

      if (response.status === 200) {
        alert('Post created successfully!');
        setContent('');
        setMediaUrl('');
        setMediaType(null);
      } else {
        throw new Error('Failed to create post: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error);
      setError('Something went wrong while creating the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaUrl(e.target.result);
      setMediaType(file.type.startsWith('image') ? 'image' : 'video');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image') || file.type.startsWith('video'))) {
      handleMediaUpload(file);
    } else {
      setError('Please upload a valid image or video file.');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('image') || file.type.startsWith('video'))) {
      handleMediaUpload(file);
    } else {
      setError('Please upload a valid image or video file.');
    }
  };

  return (
    <Card className="create-post-card">
      <Card.Body
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <InputGroup>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-label="Post content"
            className="post-input"
          />
        </InputGroup>

        {/* Media Preview */}
        {mediaUrl && (
          <div className="media-preview mt-3">
            {mediaType === 'image' ? (
              <img src={mediaUrl} alt="Post media" className="img-fluid rounded" />
            ) : (
              <video src={mediaUrl} controls className="w-100 rounded" />
            )}
          </div>
        )}

        {/* Error Message */}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        {/* Buttons */}
        <div className="mt-3 d-flex justify-content-between align-items-center">
          <div>
            <input
              type="file"
              id="media-upload"
              accept="image/*, video/*"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
            <label htmlFor="media-upload" className="btn btn-outline-primary me-2">
              Upload Media
            </label>
            <Button
              variant="link"
              onClick={() => setMediaUrl('')}
              disabled={!mediaUrl}
              className="text-muted"
            >
              Remove Media
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={handlePost}
            disabled={loading || !content.trim()}
            className="post-button"
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Posting...</span>
              </>
            ) : (
              'Post'
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CreatePostCard;