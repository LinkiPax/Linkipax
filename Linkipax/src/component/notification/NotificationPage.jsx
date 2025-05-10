import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Tab, Tabs, ListGroup, Form, Badge, Spinner, Modal } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [socket, setSocket] = useState(null);
  const [newNotification, setNewNotification] = useState({ userId: "", notificationText: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // Fetch Notifications
  const fetchNotifications = useCallback(async (filter = "all") => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/notification/${filter}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      });
      setNotifications(response.data.notifications || []);
    } catch (err) {
      setError("Failed to fetch notifications. Please try again.");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark Notification as Read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:5000/notification/mark-as-read/${notificationId}`,{}, // Empty body for PATCH request
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          withCredentials: true, // Include credentials (cookies)
        });
      fetchNotifications(activeTab); // Refresh the current tab
    } catch (err) {
      setError("Failed to mark notification as read.");
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark All Notifications as Read
  const markAllAsRead = async () => {
    try {
      const notificationIds = notifications
        .filter((notification) => notification.status === "unread")
        .map((notification) => notification._id);

      await axios.patch("http://localhost:5000/notification/mark-as-read", {
        notificationIds,
      });

      fetchNotifications(activeTab); // Refresh the current tab
    } catch (err) {
      setError("Failed to mark all notifications as read.");
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Clear All Notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete("http://localhost:5000/notification/clear-all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setNotifications([]); // Clear notifications in the UI
      setShowClearModal(false); // Close the modal
    } catch (err) {
      setError("Failed to clear notifications.");
      console.error("Error clearing notifications:", err);
    }
  };

  // Handle New Notifications from Socket
  useEffect(() => {
    const socketConnection = io("http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(socketConnection);

    socketConnection.on("new_notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]); // Add to the top
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Fetch Notifications on Tab Change
  useEffect(() => {
    fetchNotifications(activeTab);
  }, [activeTab, fetchNotifications]);

  // Count Unread Notifications
  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h3>Notifications</h3>
          <Badge bg="danger" className="ms-2">
            {unreadCount} Unread
          </Badge>
        </Col>
      </Row>

      {/* Error Message */}
      {error && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}

      {/* Notification Actions */}
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={markAllAsRead} className="me-2">
            Mark All as Read
          </Button>
          <Button variant="outline-danger" onClick={() => setShowClearModal(true)}>
            Clear All Notifications
          </Button>
        </Col>
      </Row>

      {/* Notification Tabs */}
      <Row>
        <Col>
          <Tabs
            id="notification-tabs"
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
            className="mb-3"
          >
            <Tab eventKey="all" title="All">
              <NotificationList
                notifications={notifications}
                markAsRead={markAsRead}
                loading={loading}
              />
            </Tab>
            <Tab eventKey="read" title="Read">
              <NotificationList
                notifications={notifications.filter((n) => n.status === "read")}
                markAsRead={markAsRead}
                loading={loading}
              />
            </Tab>
            <Tab eventKey="unread" title="Unread">
              <NotificationList
                notifications={notifications.filter((n) => n.status === "unread")}
                markAsRead={markAsRead}
                loading={loading}
              />
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Clear All Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Clear All Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to clear all notifications? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearAllNotifications}>
            Clear All
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Notification List Component
const NotificationList = ({ notifications, markAsRead, loading }) => {
  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <ListGroup>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <ListGroup.Item
            key={notification._id}
            className={notification.status === "read" ? "bg-light" : ""}
          >
            <Row>
              <Col xs={8}>
                <strong>{notification.notification}</strong>
                <div className="small text-muted">
                  {new Date(notification.date).toLocaleString()}
                </div>
              </Col>
              <Col xs={4} className="text-end">
                {notification.status === "unread" && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => markAsRead(notification._id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </Col>
            </Row>
          </ListGroup.Item>
        ))
      ) : (
        <p className="text-muted text-center">No notifications available.</p>
      )}
    </ListGroup>
  );
};

export default NotificationPage;