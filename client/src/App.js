import React, { useEffect, useContext } from "react";
import { UserContext } from "./Store";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home/Home.js";
import MyNavBar from "./Components/Navbar/Navbar.js";
import Account from "./Components/Account/Account.js";
import PageNotFound from "./Components/PageNotFound/PageNotFound.js";
import Show from "./Components/ShowDetails/ShowDetails.js";

const App = () => {
  const [user, setUser] = useContext(UserContext);

  /**
   * userData contains the data inside the local storage
   * If the userData is not null (user is logged), we restore the data
   * of the userContext (accessible from all components)
   */
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("token"));
    if (userData != null) {
      setUser(userData);
    }
  }, [setUser]);

  return (
    <div>
      <Router>
        <MyNavBar />
        {user ? (
          <Switch>
            <Route exact path="/" render={() => <Home user={user} />} />
            <Route exact path="/account" render={() => <Account user={user} />}/>
            <Route exact path="/show:showName" render={() => <Show />}/>
            <Route component={PageNotFound} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/" render={() => <Home user={user} />} />
            <Route component={PageNotFound} />
          </Switch>
        )}
      </Router>
    </div>
  );
};

export default App;
