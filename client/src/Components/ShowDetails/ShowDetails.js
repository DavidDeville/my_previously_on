import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import axios from "axios";
import "./ShowDetails.css";
import ShowManager from "../ShowManager/ShowManager.js";

const ShowDetails = ({
  showInfos,
  setShowDetailsDisplay,
  userToken,
  refetchApi
}) => {
  /**
   * Check if the show is already archived or not
   */
  const [isShowArchived, setIsShowArchived] = useState(showInfos.user.archived);

  /**
   * Handle the switch between show details and show seasons, episodes
   */
  const [displaySeasons, setDisplaySeasons] = useState(false);

  useEffect(() => {
    refetchApi();
  }, [isShowArchived, showInfos]);

  const setShowInArchive = () => {
    axios
      .post("https://localhost:8000/show/archive", {
        token: userToken,
        showId: showInfos.id
      })
      .then(res => {
        setIsShowArchived(res.data.show.user.archived);
      });
  };

  const unsetShowInArchive = () => {
    axios
      .post("https://localhost:8000/show/unarchive", {
        token: userToken,
        showId: showInfos.id
      })
      .then(res => {
        setIsShowArchived(res.data.show.user.archived);
      });
  };

  const handleShowDisplay = () => {
    setShowDetailsDisplay(false);
  };

  /**
   * Function used to switch between show details and show seasons components
   */
  const handleSeasonsDisplay = () => {
    setDisplaySeasons(true);
  }

  return (
    <div>
      <Container fluid={true}>
        {displaySeasons === false ? (
          <Card>
            <Card.Title>
              <img
                className="testo"
                src={showInfos.images.show}
                alt="tv show banner"
              />
            </Card.Title>
            <Card.Body className="show_details">
              <div className="show_design">
                <b>Title</b> : {showInfos.title}
              </div>
              <br />
              <div className="show_design">
                <b>Seasons</b> : {showInfos.seasons}
              </div>
              <br />
              <div className="show_design">
                <b>Number of episodes</b> : {showInfos.episodes}
              </div>
              <br />
              <div className="show_design">
                <b>Episode Length</b> : {showInfos.length} minutes
              </div>
              <br />
              <div className="show_design">
                <b>Score</b> : {Math.round(showInfos.notes.mean)}/5 with a total
                of {showInfos.notes.total} reviews
              </div>
              <br />
              <div className="show_design">
                <b>Synopsis</b> : {showInfos.description}
              </div>
              <br />
              <>
                <div className="show_design">
                  <b>Genre(s)</b> :
                  {Object.keys(showInfos.genres).map(function(genre, index) {
                    return (
                      <div className="show_genres" key={index}>
                        {" "}
                        {genre}{" "}
                      </div>
                    );
                  })}
                </div>
              </>
              <br />
              <Button variant="dark" onClick={() => handleShowDisplay()}>
                All Shows
              </Button>{" "}
              <Button variant="dark" onClick={() => handleSeasonsDisplay()}>
                Manage your seasons
              </Button>{" "}
              {isShowArchived === false ? (
                <>
                  <Button
                    variant="outline-success"
                    onClick={() => setShowInArchive()}
                  >
                    Archive
                  </Button>{" "}
                </>
              ) : (
                <>
                  <Button
                    variant="outline-danger"
                    onClick={() => unsetShowInArchive()}
                  >
                    Cancel archived
                  </Button>{" "}
                </>
              )}
            </Card.Body>
          </Card>
        ) : (
          <ShowManager showDetails={showInfos} token={userToken} setDisplaySeasons={setDisplaySeasons} refetchApi={refetchApi}/>
        )}
      </Container>
    </div>
  );
};

export default ShowDetails;
