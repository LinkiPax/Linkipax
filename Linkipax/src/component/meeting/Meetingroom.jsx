import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';
import './Meetingroom.css';

const socket = io('http://localhost:5000'); // Replace with your backend URL
const userId = localStorage.getItem('userId');
const MeetingApp = () => {
  const [meetingId, setMeetingId] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const localStream = useRef(null);
  const remoteStreams = useRef({});

  useEffect(() => {
    socket.on('user-joined', ({ id, username }) => {
      setParticipants((prev) => [...prev, { id, username }]);
    });

    socket.on('user-left', ({ id }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    });

    socket.on('receive-message', ({ username, message }) => {
      setMessages((prev) => [...prev, { username, message }]);
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('receive-message');
    };
  }, []);

  const startVideo = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post('http://localhost:5000/room/create');
      if (response.data && response.data.roomId) {
        setMeetingId(response.data.roomId);
        setError('');
      } else {
        setError('Failed to create room.');
      }
    } catch (err) {
      setError('Failed to create room.');
    }
  };

  const handleJoinMeeting = async () => {
    if (!meetingId.trim() || !username.trim()) {
      setError('Meeting ID and username are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/room/join', { meetingId, username,userId });
      if (response.data.success) {
        socket.emit('join-meeting', { meetingId, username, userId });
        setJoined(true);
        startVideo();
      } else {
        setError('Failed to join the meeting.');
      }
    } catch (err) {
      setError('Failed to join the meeting.');
    }
  };

  const handleLeaveMeeting = () => {
    socket.emit('leave-meeting', { meetingId });
    setJoined(false);
    setParticipants([]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send-message', { meetingId, username, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <Container className="mt-5 cont">
      <Row>
        <Col>
          <h2 className="text-center text-primary logo">Linkify Meeting</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {!joined ? (
            <>
              <Button variant="success" onClick={handleCreateRoom} className="me-3">
                Create Room
              </Button>

              {meetingId && (
                <Alert variant="info" className="mt-3">
                  Room created! Share this Meeting ID: <strong>{meetingId}</strong>
                </Alert>
              )}

              <Form className="form">
                <Form.Group className="mb-3">
                  <Form.Label>Meeting ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Meeting ID"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleJoinMeeting}>
                  Join Meeting
                </Button>
              </Form>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h5>Participants:</h5>
                <ul className="list-group">
                  {participants.map((participant) => (
                    <li key={participant.id} className="list-group-item">
                      {participant.username}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <video ref={localStream} autoPlay muted className="w-100 mb-3"></video>
                <div className="remote-videos">
                  {Object.values(remoteStreams.current).map((stream, index) => (
                    <video key={index} srcObject={stream} autoPlay className="w-100 mb-3"></video>
                  ))}
                </div>
              </div>

              <div className="chat mt-4">
                <h5>Chat</h5>
                <div className="chat-messages chat" > 
                  {messages.map((msg, index) => (
                    <p key={index}>
                      <strong>{msg.username}: </strong>
                     <h7>{msg.message}</h7> 
                    </p>
                  ))}
                </div>
                <Form.Control
                  type="text"
                  placeholder="Type your message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>

              <Button variant="danger" onClick={handleLeaveMeeting} className="mt-3">
                Leave Meeting
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MeetingApp; 