// src/LoginPage/ForgetPassword.js
import React, { useState } from "react";
import { auth } from "../Firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
      setError("");
    } catch (err) {
      console.error("Error sending reset email:", err);
      setError("Failed to send reset email. " + err.message);
      setMessage("");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2>Reset Password</h2>
          <Form onSubmit={handlePasswordReset}>
            <Form.Group className="mb-3">
              <Form.Label>Enter your email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            {message && <div className="text-success mb-3">{message}</div>}
            {error && <div className="text-danger mb-3">{error}</div>}
            <Button type="submit" variant="primary">
              Send Reset Email
            </Button>
            <Button variant="secondary" className="ms-3" onClick={() => navigate("/")}>
              Back to Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgetPassword;
