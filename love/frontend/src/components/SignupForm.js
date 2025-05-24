import React, { useState } from "react";
import API from "../Api";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await API.post("/signup", { email, password, partnerEmail });
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data || err.meessage || "Signup failed");
      console.error("Signup error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Signup failed (no details available)";

      setError(errorMessage);

      console.error("Full error object:", {
        config: err.config,
        response: err.response,
        stack: err.stack,
      });
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Row>
        <Col>
          <Card
            style={{
              width: "350px",
              backgroundColor: "#fce4ec",
              borderRadius: "15px",
              boxShadow: "0 0 15px rgba(219, 112, 147, 0.7)",
            }}
          >
            <Card.Body>
              <Card.Title
                className="text-center mb-4"
                style={{ color: "#C2185B" }}
              >
                Create Your Love Account
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="signupEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="signupPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="partnerEmail">
                  <Form.Label>Partner's Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Your partner's email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    required
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Button
                  variant="danger"
                  type="submit"
                  className="w-100"
                  style={{ borderRadius: "10px" }}
                >
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
