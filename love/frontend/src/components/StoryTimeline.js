import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Container, ListGroup } from "react-bootstrap";

const StoryTimeline = () => {
  const { messages, user, partner } = useAuth();

  // Filter messages between user and partner here
  const storyMessages = messages.filter(
    (msg) =>
      (msg.sender === user && msg.receiver === partner) ||
      (msg.sender === partner && msg.receiver === user)
  );

  return (
    <Container className="mt-5" style={{ color: "#fff" }}>
      <h2>Your Love Story Timeline</h2>
      {storyMessages.length === 0 ? (
        <p>No messages yet between you and {partner || "your partner"}.</p>
      ) : (
        <ListGroup>
          {storyMessages.map((msg) => (
            <ListGroup.Item
              key={msg._id || msg.id}
              variant={msg.sender === user ? "danger" : "light"}
            >
              <strong>{msg.sender === user ? "You" : partner}:</strong>{" "}
              {msg.decrypted ? msg.content : "Encrypted message"}
              <br />
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default StoryTimeline;
