import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Col, Row} from "react-bootstrap";
import { Link } from "react-router-dom";
import './LoginPage.css';
//import bgimage from '../images/bg-image.jpg'

function LoginPage() {
  return (
    <div
  className="login-outer-wrapper"
  style={{
    backgroundImage: `url(/images/bg-image.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '10%' // moves it a bit to the left

  }}
>
        
      <Container className="login-wrapper d-flex flex-column justify-content-between">
       <div className="transparent-header text-center">
  <Row className="mb-4">
    <Col className="position-relative">
      <div className="circle-shape circle-top-border"></div>
      <h1 className="login-heading-small animated-login">Login</h1>
    </Col>
  </Row>

          <Row>
            <Col>
              <div className="mb-3">
                <label htmlFor="uname" className="label-left">UserName</label>
                <input
                  type="text"
                  className="form-control"
                  id="uname"
                  placeholder="Enter the User name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="pass" className="label-left">Credential</label>
                <input
                  type="password"
                  className="form-control"
                  id="pass"
                  placeholder="Enter Password"
                  required
                />
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <button className="submit">Login</button>
              <button className="reset ms-3">Cancel</button>
            </Col>
          </Row>

         <Row className="mb-4">
  <Col>
    <Link to="#" className="me-3 login-link">Login with Gmail</Link>
    <Link to="/NewLogin" className="login-link">Create New Login</Link>
  </Col>
</Row>
        </div>

        {/* Bottom-aligned row */}
        <div className="mt-auto pt-3 border-top">
          <Row className="mb-2">
            <Col className="d-flex justify-content-between align-items-center">
              <label className="m-0 d-flex align-items-center label-left">
                <input type="checkbox" className="checkbox me-2" />
                Remember Password
              </label>
              <Link to="#" className="text-decoration-none label-left">Forget Password</Link>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default LoginPage;
