// src/components/StoryTimeline.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

const StoryTimeline = () => {
  const { user, inbox, decryptMessage } = useAuth();
  const [decryptedMessages, setDecryptedMessages] = useState([]);

  useEffect(() => {
    const decryptAll = async () => {
      const results = await Promise.all(
        inbox.map((msg) => decryptMessage(msg))
      );
      setDecryptedMessages(results);
    };
    if (inbox.length > 0) decryptAll();
  }, [inbox]);

  return (
    <Container className="py-5 story-timeline-bg">
      <h2 className="text-center text-danger mb-4 ">
        💌 Our Love Story Timeline
      </h2>
      {decryptedMessages.length === 0 ? (
        <div className="d-flex justify-content-center py-5 ">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col md={8}>
            {decryptedMessages.map((msg, index) => (
              <Card
                key={index}
                className="mb-4 border-start border-5 border-danger shadow-sm fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Card.Body>
                  <Card.Title className="text-muted small ">
                    Message {inbox.length - index} from{" "}
                    <strong>{inbox[index].from}</strong>
                  </Card.Title>
                  <Card.Text style={{ fontStyle: "italic" }}>{msg}</Card.Text>
                  <div className="text-end text-muted small ">
                    {new Date(inbox[index].createdAt).toLocaleString()}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StoryTimeline;
