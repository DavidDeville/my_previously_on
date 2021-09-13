import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

const BlockedUsers = (props) => {

  //const [userFriends, setUserFriends] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState();
  const [unblocked, setUnblocked] = useState(false);

  useEffect(() => {
    fetchBlockedList();
  }, [props, unblocked]);

  /**
   * API Call to retrieve blocked users
  */
 const fetchBlockedList = () => {
    axios.get("https://api.betaseries.com/friends/list?key=c499f6741abe&blocked=true&access_token="+props.user.token)
    .then(res => {
      setBlockedUsers(res.data.users);
    });
  }

  const unblockUser = userId => {
      axios.delete("https://api.betaseries.com/friends/block?id="+userId+"&key=c499f6741abe&access_token="+props.user.token)
      .then(res => {
        setUnblocked(true);
      });
  }

  return (
    <div>
      <Card className="text-center">
        <Card.Header className="shows_header">BLOCKED LIST</Card.Header>
        <Card.Body className="shows_display">
          <div className="shows_body">
            {blockedUsers ? blockedUsers.map(function(blockedUser, index) {
              return (<div key={index}>
                {blockedUser.login} <Button variant="outline-warning" onClick={() => unblockUser(blockedUser.id)}>Unblock</Button>{' '}
                </div>
              )
            }) : <></>}
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          <p></p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default BlockedUsers;
