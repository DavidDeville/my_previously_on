import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import BlockedUsers from "../BlockedUsers/BlockedUsers.js";
import AddFriend from "../AddFriend/AddFriend.js";
import "./FriendsList.css";

const FriendsList = props => {
  const [userFriends, setUserFriends] = useState(null);
  const [userBeenAdded, setUserBeenAdded] = useState(false);
  const [friendRequests, setFriendRequest] = useState(null);

  useEffect(() => {
    fetchFriendList();
    fetchBlockedList();
    getFriendsRequest();
  }, [userBeenAdded]);

  useEffect(() => {
    if(userBeenAdded === true) {
      fetchFriendList();
      setUserBeenAdded(false);
    }
  }, [userBeenAdded])

  useEffect(() => {
    getFriendsRequest();
  }, [])

  /**
   * API Call to retrieve logged user friend list
   */
  const fetchFriendList = () => {
    axios
      .get(
        "https://api.betaseries.com/friends/list?key=c499f6741abe&access_token=" +
          props.user.token
      )
      .then(res => {
        setUserFriends(res.data.users);
      });
  };

  /**
   * API Call to retrieve blocked users
   */
  const fetchBlockedList = () => {
    axios
      .get(
        "https://api.betaseries.com/friends/list?key=c499f6741abe&blocked=true&access_token=" +
          props.user.token
      )
      .then(res => {
      });
  };

  const blockFriend = friendsId => {
    axios
      .post(
        "https://api.betaseries.com/friends/block?id=" +
          friendsId +
          "&key=c499f6741abe&access_token=" +
          props.user.token
      )
      .then(res => {
        fetchFriendList();
      });
  };

  const deleteFriend = friendsId => {
    axios
      .delete(
        "https://api.betaseries.com/friends/friend?id="+friendsId+"&key=c499f6741abe&access_token="+props.user.token)
      .then(res => {
        setUserBeenAdded(false);
        fetchFriendList();
      });
  };

  const getFriendsRequest = () => {
    axios.get("https://api.betaseries.com/friends/requests?key=c499f6741abe&received=true&access_token="+props.user.token)
    .then(res => {
      setFriendRequest(res.data.users);
    })
  }

  /**
   * Function to add a user to the friend list
   * 
   * @param {int} memberId - the ID of the user we want to add
   */
  const addUserToList = memberId => {
    axios.post("https://api.betaseries.com/friends/friend?id="+memberId+"&key=c499f6741abe&access_token="+props.user.token)
    .then(res => {
        setUserBeenAdded(true);
    })
}

  return (
    <div className="friendsMenu">
      <AddFriend user={props.user} isAdded={setUserBeenAdded}/>
      <Card className="text-center">
        <Card.Header className="shows_header">FRIENDS LIST</Card.Header>
        <Card.Body className="shows_display">
          <div className="shows_body">
            {userFriends ? (
              userFriends.map(function(friend, index) {
                return (
                  <div key={index}>
                    {friend.login}{" "}
                    <Button
                      variant="outline-warning"
                      onClick={() => blockFriend(friend.id)}
                    >
                      Block
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      onClick={() => deleteFriend(friend.id)}
                    >
                      Delete
                    </Button>{" "}
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
          {friendRequests !== null ? <div>
            Demandes d'ajout d'amis en attente :
            {friendRequests.map(function(friendRequest, index) {
              return(
                <div key={index}>
                  <div>{friendRequest.login} 
                    <Button variant="outline-success" onClick={() => addUserToList(friendRequest.id)}>Accepter</Button>{' '}
                    <Button variant="outline-danger" onClick={() => blockFriend(friendRequest.id)}>Refuser</Button>{' '}
                  </div>
                </div>
              )
            })}
          </div> : <></>}
        </Card.Body>
        <Card.Footer className="text-muted">
          <p></p>
        </Card.Footer>
      </Card>

      <BlockedUsers user={props.user} />
    </div>
  );
};

export default FriendsList;
