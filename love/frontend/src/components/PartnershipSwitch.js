import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Container, Form, Button } from "react-bootstrap";

const PartnershipSwitch = () => {
  const { partner, setPartner, loading, error, setError } = useAuth();
  const [newPartner, setNewPartner] = useState("");

  const handleSwitch = async (e) => {
    e.preventDefault();
    if (!newPartner.trim()) return;
    setError(null);
    await setPartner(newPartner.trim());
    setNewPartner("");
  };

  return (
    <Container className="mt-4" style={{ color: "#fff" }}>
      <h3>Switch Partner</h3>
      <p>
        Current partner: <strong>{partner || "None"}</strong>
      </p>
      <Form onSubmit={handleSwitch}>
        <Form.Control
          type="text"
          placeholder="Enter new partner name"
          value={newPartner}
          onChange={(e) => setNewPartner(e.target.value)}
          disabled={loading}
        />
        <Button
          variant="danger"
          type="submit"
          className="mt-2"
          disabled={loading}
        >
          Switch Partner
        </Button>
      </Form>
      {error && <p className="text-warning mt-2">{error}</p>}
    </Container>
  );
};

export default PartnershipSwitch;
