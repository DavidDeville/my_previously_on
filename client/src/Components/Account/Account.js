import React from "react";

const Account = props => {
  return (
    <div>
      <h1>Bienvenue sur votre compte</h1>
      <p>{props.user.login}</p>
    </div>
  );
};

export default Account;
