import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import "./ShowManager.css";
import axios from "axios";
import ShowEpisodes from "../ShowEpisodes/ShowEpisodes.js";

const ShowManager = ({ showDetails, token, setDisplaySeasons }) => {
  const [seasonsInfos, setSeasonsInfos] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState(null);

  /**
   * Handle display between seasons and the specified season episodes
   */
  const [seasonEpisodesDisplay, setSeasonEpisodesDisplay] = useState(false);

  useEffect(() => {
    fetchSeasonPoster();
  }, [seasonEpisodes]);

  /**
   * Function to go back to the previous component (ShowDetails)
   * Whenever the user click on "back" button, setDisplaySeasons sets the value
   * of displaySeasons to false and ShowDetails is re-rendered
   */
  const previousPage = () => {
    setDisplaySeasons(false);
  };

  /**
   * Function get all seasons posters of a specific show
   */
  const fetchSeasonPoster = () => {
    axios
      .get(
        "https://api.betaseries.com/shows/seasons?key=c499f6741abe&access_token=" +
          token +
          "&id=" +
          showDetails.id
      )
      .then(res => {
        setSeasonsInfos(res.data.seasons);
      });
  };

  /**
   * Function to get all episodes of a specific season 
   * (determined by the seasonId parameter)
   * 
   * @param {int} seasonId 
   */
  const fetchSeasonEpisodes = seasonId => {
    axios
      .get(
        "https://api.betaseries.com/shows/episodes?key=c499f6741abe&access_token=" +
          token +
          "&id=" +
          showDetails.id +
          "&season=" +
          seasonId
      )
      .then(res => {
        setSeasonEpisodes(res.data.episodes);
        setSeasonEpisodesDisplay(true);
      });
  };

  return (
    <div>
      <Card>
        <Card.Title>
          <img
            className="show_manager_header"
            src={showDetails.images.show}
            alt="tv show banner"
          />
        </Card.Title>
        <Card.Body>
          {seasonsInfos !== null ? (
            seasonEpisodesDisplay === false ?
            <div>
              <div className="season_details">
                {seasonsInfos.map(function(seasonsInfo, index) {
                  return (
                    <div key={index}>
                      <div>
                        <div>
                        <p className="season_number">Season {seasonsInfo.number}</p>
                        </div>
                        <div>
                        <img
                          className="season_image"
                          src={seasonsInfo.image}
                          onClick={() =>
                            fetchSeasonEpisodes(seasonsInfo.number)
                          }
                          alt="poster of the season"
                        />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button variant="dark" onClick={() => previousPage()}>
            Back
          </Button>{" "}
              </div>
             : <ShowEpisodes setSeasonEpisodesDisplay={setSeasonEpisodesDisplay} episodes={seasonEpisodes} token={token} refetchSeasonEpisodes={fetchSeasonEpisodes}/> ) : (
              <></>
          )}
          
        </Card.Body>
      </Card>
    </div>
  );
};

export default ShowManager;
