import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import "./Home.css";
import Shows from "../Shows/Shows.js";
import FriendsList from "../FriendsList/FriendsList.js";

const Home = props => {

  return (
    <div>
      <Container fluid={true}>
        {!props.user ? <Row noGutters={true}>
          <Col sm={12} className="required_connexion">Connexion required</Col>
        </Row> : <Row noGutters={true}>
        <Col sm={1}></Col>
          <Col sm={2}><FriendsList user={props.user}/></Col>
          <Col sm={1}></Col>
          <Col sm={8}>
            <Shows user={props.user} />
          </Col>
        </Row>}
      </Container>
    </div>
  );
};

export default Home;
