import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 15px",
      }}
    >
      <Container>
        <h1 className="display-3 fw-bold mb-3 text-shadow">
          Welcome to Your Love Story
        </h1>
        <p className="lead mb-4 text-shadow">
          Share your most romantic moments, send secret messages, and keep your
          love alive.
        </p>
        <div>
          <Button
            as={Link}
            to="/signup"
            variant="danger"
            size="lg"
            className="me-3"
          >
            Sign Up
          </Button>
          <Button as={Link} to="/login" variant="outline-light" size="lg">
            Login
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
