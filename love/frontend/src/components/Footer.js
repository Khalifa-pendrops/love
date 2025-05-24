import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#8B0000",
        color: "#fff",
        padding: "20px 0",
        textAlign: "center",
        marginTop: "auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Container>
        <p className="mb-1" style={{ fontSize: "1.2rem" }}>
          💕 Made with love for lovers 💕
        </p>
        <small style={{ opacity: 0.8 }}>
          Your Love Story &copy; {new Date().getFullYear()}
        </small>
      </Container>
    </footer>
  );
};

export default Footer;
