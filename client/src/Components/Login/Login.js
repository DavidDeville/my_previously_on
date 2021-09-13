import React, { useState, useContext } from "react";
import { UserContext } from "../../Store";
import { Container, Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [, setUser] = useContext(UserContext);

  /**
   * Different methods to set the user nickname, the user password
   * and the possible error coming from the API call if there is any
   */
  const [nickName, setNickName] = useState("Tidav59");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const apiFetch = () => {
    axios
      .post("https://localhost:8000/login", {
        nickName: nickName,
        password: password
      })
      .then(response => {
        let userData = {
          login: response.data.user.login,
          token: response.data.token
        };
        setUser(userData);
        localStorage.setItem("token", JSON.stringify(userData));
      })
      .catch(() => {
        setError("Ce compte n'existe pas.");
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    apiFetch();
  };

  // const redirectTo = () => {
  //   window.location.href =
  //     "https://www.betaseries.com/authorize?client_id=c499f6741abe&redirect_uri=http://127.0.0.1:8000/login/";
  // };

  return (
    <div className="LoginContainer">
      <Container>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="formGroupNickName">
                <Form.Control
                  value={nickName}
                  onChange={e => setNickName(e.target.value)}
                  type="text"
                  placeholder="Enter nickname"
                  className="nickname_input"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formGroupPassword">
                <Form.Control
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter password"
                  className="password_input"
                />
              </Form.Group>
            </Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                className="button_input"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
        {error ? <div>{error}</div> : ""}
      </Container>
    </div>
  );
};

export default Login;
