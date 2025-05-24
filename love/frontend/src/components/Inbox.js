import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // const fetchMessages = async () => {
  //   try {
  //     const res = await api.get("/inbox", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setMessages(res.data);
  //   } catch (err) {
  //     setError("Failed to fetch messages.");
  //   }
  // };

  const fetchMessages = async () => {
    try {
      const res = await api.get("/inbox", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Decrypt each message using the backend /decrypt endpoint
      const decryptedMessages = await Promise.all(
        res.data.map(async (msg) => {
          try {
            const decrypted = await api.post(
              "/decrypt",
              {
                iv: msg.iv,
                authTag: msg.authTag,
                cipherText: msg.cipherText,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return {
              ...msg,
              content: decrypted.data.message,
            };
          } catch (decryptionErr) {
            return {
              ...msg,
              content: "[Decryption failed]",
            };
          }
        })
      );

      setMessages(decryptedMessages);
    } catch (err) {
      setError("Failed to fetch messages.");
    }
  };


  const sendMessage = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post(
        "/send",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");
      setSuccess("Message sent successfully!");
      fetchMessages(); 
    } catch (err) {
      setError(err.response?.data || "Failed to send message.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  //remove this line later - maybe 😉
useEffect(() => {
  if (messages.length >= 3) {
    navigate("/timeline");
  }
}, [messages, navigate]);


  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4 text-center text-danger">
            Your Romantic Inbox 💌
          </h2>

          {/* Send Message Form */}
          <Card
            className="mb-4 shadow-sm"
            style={{ backgroundColor: "#fff0f5" }}
          >
            <Card.Body>
              <Form onSubmit={sendMessage}>
                <Form.Group className="mb-3">
                  <Form.Label>Write a love note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Express your feelings..."
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>
                <Button
                  variant="danger"
                  type="submit"
                  style={{ borderRadius: "10px" }}
                >
                  Send Message
                </Button>
              </Form>
              {error && (
                <Alert className="mt-3" variant="danger">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert className="mt-3" variant="success">
                  {success}
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Messages Display */}
          {messages.length === 0 ? (
            <p className="text-muted text-center">No messages yet.</p>
          ) : (
            messages.map((msg, idx) => (
              <Card
                key={idx}
                className="mb-3 shadow-sm"
                style={{
                  backgroundColor: "#fff0f5",
                  borderLeft: "5px solid #C2185B",
                }}
              >
                <Card.Body>
                  <p>{msg.content}</p>
                  <small className="text-muted">From: {msg.from}</small>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Inbox;
