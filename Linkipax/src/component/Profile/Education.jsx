import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup, Image, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
const Education = ({ userId }) => {
  const [education, setEducation] = useState([]);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/education/${userId}`);
        setEducation(data);
      } catch (error) {
        console.error("Error fetching education:", error);
      }
    };

    fetchEducation();
  }, [userId]);

  return (
    <div className="education-section mt-4">
      <h2>Education</h2>
      {education.length > 0 ? (
        education.map((edu) => (
          <Card key={edu._id} className="mb-3">
            <Card.Body>
              <Card.Title>{edu.collegeName}</Card.Title>
              <Row className="align-items-center">
                <Col md={2}>
                  <Image src={edu.logo || "https://via.placeholder.com/100"} rounded />
                </Col>
                <Col md={10}>
                  <Card.Text>
                    <strong>Degree:</strong> {edu.degree}
                  </Card.Text>
                  <Card.Text>
                    <strong>Duration:</strong> {edu.startDate} - {edu.endDate || "Present"}
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No education data available.</p>
      )}
    </div>
  );
};

export default Education;
