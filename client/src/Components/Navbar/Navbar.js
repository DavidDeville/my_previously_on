import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import Logo from "../../Images/Logos/nav_logo.png";
import Login from "../Login/Login.js";
import { UserContext } from "../../Store";
import "./Navbar.css";

const MyNavbar = () => {
  const [user, setUser] = useContext(UserContext);

  const history = useHistory();

  const Logout = () => {
    localStorage.removeItem("token");
    setUser();
    history.push('/');
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" className="NavbarContainer">
        <Navbar.Brand  onClick={() => history.push('/')} className="title">
          <img
            alt=""
            src={Logo}
            width="40"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Previously On
        </Navbar.Brand>
        {!user ? (
          <Login/>
        ) : (
          <div>
            <div onClick={() => history.push('/account')}>{user.login}</div>
            <div onClick={() => Logout()}> Logout</div>
          </div>
        )}
      </Navbar>
    </div>
  );
};

export default MyNavbar;
