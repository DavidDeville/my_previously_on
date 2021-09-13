import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./Shows.css";
import axios from "axios";
import AddShow from "../AddShow/AddShow.js";
import ShowDetails from "../ShowDetails/ShowDetails.js";

/**
 * Component Shows used to display everything related to the shows
 * that takes a user objet (props) as the token is needed to call the API
 *
 * @param {Object} user
 */
const Shows = ({ user }) => {
  /**List of values and their methods */
  const [userShows, setUserShows] = useState(null);
  const [offsetNumber, setOffsetNumber] = useState(0);
  const [numberOfResults, setNumberOfResults] = useState(1);
  const [hasShowBeenAdded, setHasShowBeenAdded] = useState(false);

  /**
   * Function related to the ShowDetails component
   */
  const [showDetailsDisplay, setShowDetailsDisplay] = useState(false);
  const [showDetails, setShowDetails] = useState(null);

  /**
   * useEffect runs on component load and fetch the API once
   * The API will be called everytime the offSetNumber value has changed
   */
  useEffect(() => {
    fetchApi();
  }, [offsetNumber, hasShowBeenAdded, showDetails, setShowDetailsDisplay]);

  /**
   * API Call to retrieve logged user's shows
   */
  const fetchApi = () => {
    axios
      .post("https://localhost:8000/user/shows", {
        token: user.token,
        offset: offsetNumber
      })
      .then(response => {
        setUserShows(response.data.userShows.shows);
        setNumberOfResults(response.data.userShowsCount);
      });
  };

  /**
   * handleOffSet handles the pagination feature
   * If the param is "inc", the offset + the number of items we want to display (10) is
   * inferior to the number of results, we increment the offset by 10. Otherwise, we decrement by 10
   *
   * @param {string} action
   */
  const handleOffset = action => {
    switch (action) {
      case "inc":
        if (offsetNumber + 10 < numberOfResults) {
          setOffsetNumber(offsetNumber + 10);
        }
        break;
      case "dec":
        if (offsetNumber > 0) {
          setOffsetNumber(offsetNumber - 10);
        }
        break;
      default:
        break;
    }
  };

  const setSelectedShow = showInfos => {
    setShowDetails(showInfos);
    setShowDetailsDisplay(true);
  };

  return (
    <div>
      <div className="main_box">
        <div className="header">MY TV SHOWS</div>
        <div className="poster_box">
          {showDetailsDisplay === false ? (
            <>
              {userShows != null ? (
                userShows.map(function(shows, index) {
                  return (
                    <img
                      className="shows_image_settings"
                      key={index}
                      src={shows.images.poster}
                      alt="show poster"
                      value={shows}
                      onClick={() => setSelectedShow(shows)}
                    />
                  );
                })
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <ShowDetails
                showInfos={showDetails}
                setShowDetailsDisplay={setShowDetailsDisplay}
                userToken={user.token}
                refetchApi={() => fetchApi()}
              />
            </>
          )}
        </div>
        {showDetailsDisplay === true ? (
          <></>
        ) : (
          <>
            <div className="pagination_box">
              {offsetNumber > 0 ? (
                <Button
                  variant="secondary"
                  className="pagination_button"
                  onClick={() => handleOffset("dec")}
                >
                  Previous
                </Button>
              ) : (
                ""
              )}
              {offsetNumber + 10 < numberOfResults ? (
                <Button
                  variant="secondary"
                  className="pagination_button"
                  onClick={() => handleOffset("inc")}
                >
                  Next
                </Button>
              ) : (
                ""
              )}
            </div>
            <AddShow
              token={user.token}
              setAdd={setHasShowBeenAdded}
              setAddSetting={hasShowBeenAdded}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Shows;
