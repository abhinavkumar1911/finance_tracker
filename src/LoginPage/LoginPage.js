import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import './LoginPage.css';
import { auth } from "../Firebase"; // Ensure this exports the firebase auth instance
import { signInWithEmailAndPassword } from "firebase/auth";


function LoginPage() {
  const navigate = useNavigate();

  // Local state for login inputs and error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  //const [rememberpassword,setRememberPassword]=useState("")
  

  const handleLogin = async () => {
  if (!email || !password) {
    setError("Please fill in both email and password.")
    return
  }

  try {
    //await signInWithEmailAndPassword(auth, email, password);
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("User ID:", userCredential.user.uid);
    /*if (rememberpassword){
      localStorage.setItem("saveEmial.",email)
      localStorage.setItem("SavePassword.",password)
    }
      else {
        localStorage.removeItem("RemoveEmial.",email)
        localStorage.removeItem("RemovePassword.",password)
      }}
*/
    
    navigate("/Dashboard");
  } catch (err) {
     console.error("Firebase auth error:", err)
    setError(" Login failed: " + err.message);
  }
}

  return (
    <div
      className="login-outer-wrapper">
      <Container className="login-wrapper d-flex flex-column justify-content-between">
        <div className="transparent-header text-center">
          <Row className="mb-4">
            <Col className="position-relative">
              <div className="circle-shape circle-top-border"></div>
              <h1 className="login-heading-small animated-login">Login</h1>
            </Col>
          </Row>
<form
autoComplete="off"
onSubmit={(e)=>{e.preventDefault();
  handleLogin() }
}>
          <Row>
            <Col>
              <div className="mb-3">
                <label htmlFor="email" className="label-left">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                   autoComplete="email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="pass" className="label-left">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="pass"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                   autoComplete="current-password"
                  required
                />
              </div>

              {error && <div className="text-danger mb-3">{error}</div>}
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <button className="submit" onClick={handleLogin}>Login</button>
              <button className="reset ms-3" onClick={() => { setEmail(""); setPassword(""); setError(""); }}>Cancel</button>
            </Col>
          </Row>
          </form>

          <Row className="mb-4">
            <Col>
              <Link to="/LoginWithGmail" className="me-3 login-link">Login with Gmail</Link>
              <Link to="/NewLogin" className="login-link">Create New Login</Link>
            </Col>
          </Row>
        </div>

        {/* Bottom-aligned row */}
        <div className="mt-auto pt-3 border-top">
          <Row className="mb-2">
            <Col className="d-flex justify-content-between align-items-center">
              <label className="m-0 d-flex align-items-center label-left">
                <input type="checkbox" className="checkbox me-2"  />
                {/*checked={rememberpassword}
                //onChange={() => setRememberPassword(!rememberpassword)}*/}
                Remember Password
              </label>
              <Link to="/ForgetPassword" className="text-decoration-none label-left">Forget Password</Link>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;
