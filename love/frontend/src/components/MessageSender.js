import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import API from "../Api";

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess("");
    setError("");

    try {
      await API.post("/send", { message });
      setSuccess("Message sent successfully! 💌");
      setMessage("");
    } catch (err) {
      setError(err.response?.data || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="text-primary mb-4">💬 Send a Message</h3>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="messageInput" className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            required
          />
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={sending}>
            {sending ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Send Message"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SendMessage;
