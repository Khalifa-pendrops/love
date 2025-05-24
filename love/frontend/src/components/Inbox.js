import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import API from "../Api";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [decryptedMessages, setDecryptedMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get("/inbox");
        setMessages(res.data);
      } catch (err) {
        setError(err.response?.data || "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDecrypt = async (messageId, payload) => {
    try {
      const res = await API.post("/decrypt", {
        iv: payload.iv,
        authTag: payload.authTag,
        cipherText: payload.cipherText,
      });

      setDecryptedMessages((prev) => ({
        ...prev,
        [messageId]: res.data.message,
      }));
    } catch (err) {
      alert("Decryption failed.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h3 className="text-primary mb-4">📥 Your Inbox</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {messages.length === 0 ? (
        <Alert variant="info">You have no messages.</Alert>
      ) : (
        messages.map((msg) => (
          <Card key={msg._id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">
                From: {msg.from}
              </Card.Subtitle>

              {decryptedMessages[msg._id] ? (
                <Card.Text className="text-dark">
                  {decryptedMessages[msg._id]}
                </Card.Text>
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    handleDecrypt(msg._id, {
                      iv: msg.iv,
                      authTag: msg.authTag,
                      cipherText: msg.cipherText,
                    })
                  }
                >
                  Decrypt Message
                </Button>
              )}

              <div className="mt-2 small text-muted">
                Sent: {new Date(msg.createdAt).toLocaleString()}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Inbox;
