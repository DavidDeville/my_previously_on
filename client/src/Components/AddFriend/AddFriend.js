import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import "./AddFriend.css";

const AddFriend = props => {
  const [searchedName, setSearchName] = useState("");
  const [foundMembers, setFoundMembers] = useState(null);
  const [noUserFound, setNoUserFound] = useState(false);

  useEffect(() => {
    if (searchedName.length >= 3) {
      fetchMemberList();
    } else {
        setFoundMembers(null);
    }
  }, [searchedName, setNoUserFound]);

  /**
   * API Call to retrieve site members
   */
  const fetchMemberList = () => {
    axios
      .get(
        "https://api.betaseries.com/members/search?key=c499f6741abe&login="+searchedName+"%&access_token="+props.user.token)
      .then(res => {
        if(res.data.users.length === 1) {
            if(res.data.users[0].in_account === true) {
                setNoUserFound(true);
                setFoundMembers(null);
            }
            else {
                setNoUserFound(false);
                setFoundMembers(res.data.users);
            }
        }
        else if(res.data.users.length < 1) {
            setNoUserFound(true);
            setFoundMembers(null);
            
        } else {
            setNoUserFound(false);
            setFoundMembers(res.data.users);
        }
      });
  };

  /**
   * Function to add a user to the friend list
   * 
   * @param {int} memberId - the ID of the user we want to add
   */
  const addUserToList = memberId => {
      axios.post("https://api.betaseries.com/friends/friend?id="+memberId+"&key=c499f6741abe&access_token="+props.user.token)
      .then(res => {
          props.isAdded(true);
      })
  }

  return (
    <div>
      <Card className="text-center">
        <Card.Header className="shows_header">ADD FRIEND</Card.Header>
        <Card.Body className="shows_display">
          <form>
            <label>Member name :</label>
            <input
              type="text"
              value={searchedName}
              className="search_input"
              onChange={e => setSearchName(e.target.value)}
            />
            <input
              type="submit"
              value="Submit"
              onClick={e => e.preventDefault()}
              hidden
            />
          </form>
          {foundMembers !== null ? (
            <div>
              <div>
              {noUserFound === false ?
              <div> Members you could add :
              {foundMembers.map(function(member, index) {
                if(member.in_account === true) {
                    return (
                      <div key={index}></div>
                    )
                }
                else {
                  return (
                      <div key={index}>{member.login} <Button variant="outline-success" onClick={() => addUserToList(member.id)}>Add to list</Button>{' '}</div>
                  )
              }
            })}</div> : <></>}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {noUserFound === true ? <div>No user found</div> : <></>}
        </Card.Body>
        <Card.Footer className="text-muted">
          <p></p>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default AddFriend;
