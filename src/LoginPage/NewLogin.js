import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./NewLogin.css";
import { db } from "../Firebase";
import { collection,addDoc } from "firebase/firestore";

function NewLogin() {
  const navigate = useNavigate();

  // Form state
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const passwordFormat = /^(?=.*\d).{6,}$/;
  const nameFormat = /^[A-Za-z\s]{3,}$/;
  const usernameFormat = /^[a-zA-Z0-9]{4,}$/;

  const isFutureDate = (dateStr) => {
    const inputDate = new Date(dateStr);
    const today = new Date();
    return inputDate > today;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Validations
    if (!nameFormat.test(fullName)) {
      setError("Full Name must contain only letters and be at least 3 characters.");
      setMessage("");
      return;
    }

    if (!usernameFormat.test(username)) {
      setError("Username must be alphanumeric and at least 4 characters long.");
      setMessage("");
      return;
    }

    if (!dob || isFutureDate(dob)) {
      setError("Date of Birth must not be empty or a future date.");
      setMessage("");
      return;
    }

    if (!passwordFormat.test(password)) {
      setError("Password must be at least 6 characters long and contain a number.");
      setMessage("");
      return;
    }

    if (password !== rePassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }
    //save in firebase 
    try{
            await addDoc(collection(db,"users"),{
        fullName,
        dob,
        username,
        password,
        createdAt: new Date().toISOString(),
    }),
    setMessage("Data save in Firebase")
    setError("")
}
catch{
    setError("Failed to save data try again")
    setMessage("Firebase error:", err)
}
    }

    

    setError("");
    setMessage("✅ Account saved!");
    // Further logic (e.g., Firebase save) goes here
  };

  const handleReset = () => {
    setFullName("");
    setDob("");
    setUsername("");
    setPassword("");
    setRePassword("");
    setError("");
    setMessage("🔄 Form reset!");
  };

  return (
    <div
      className="login-outer-wrapper"
      style={{
        backgroundImage: `url(/images/bg-image.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: "10%",
      }}
    >
      <Container className="login-wrapper d-flex flex-column justify-content-between">
        <div className="transparent-header text-center">
         <Row className="mb-4">
  <Col className="position-relative d-flex justify-content-between align-items-center">
    <div
      className="circle-shape circle-top-border d-flex align-items-center justify-content-center back-circle"
      title="Click to go back"
      onClick={() => navigate("/")}
    >
      ⬅
    </div>
    {/* You can include the title if needed */}
    {/* <h1 className="login-heading-small animated-login m-0">Login</h1> */}
  </Col>
</Row>
          <form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <div className="mb-3">
                  <label htmlFor="Fname" className="label-left">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Fname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="date-picker" className="label-left">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date-picker"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="label-left">User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="pass" className="label-left">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="pass"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="re-pass" className="label-left">Re-Enter Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="re-pass"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="text-danger mb-3">{error}</div>}
                {message && <div className="text-success mb-3">{message}</div>}
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <button type="submit" className="submit">Create</button>
                <button type="button" className="reset ms-3" onClick={handleReset}>Reset</button>
              </Col>
            </Row>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default NewLogin;
