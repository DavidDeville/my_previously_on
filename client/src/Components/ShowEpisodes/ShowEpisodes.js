import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./ShowEpisodes.css";
import ShowEpisodeDetails from "../ShowEpisodeDetails/ShowEpisodeDetails.js";
import axios from "axios";

const ShowEpisodes = ({
  setSeasonEpisodesDisplay,
  episodes,
  token,
  refetchSeasonEpisodes
}) => {

  /**
   * State to count how many episodes were actually watched
   * by the user
   */
  const [watchedEpisode, setWatchedEpisodes] = useState(0);

  /**
   * useState to mark all episodes as watched with the
   * setWatchedAllEpisodes method
   */
  const [watchedAllEpisodes, setWatchedAllEpisodes] = useState(false);

  /**
   * Function to get the episode ID selected by the user
   * in order to send it to the ShowEpisodeDetails Component
   */
  const [episodeDetailsId, setEpisodeDetailsId] = useState(false);

  useEffect(() => {
    refetchSeasonEpisodes(episodes[0].season);
    seenEpisodes(episodes);
  }, [episodeDetailsId]);

  useEffect(() => {
    refetchSeasonEpisodes(episodes[0].season);
  }, [watchedAllEpisodes]);

  useEffect(() => {
    seenEpisodes(episodes);
  }, [episodes]);

  /**
   * Function to go back to the previous component (ShowManager)
   * Whenever the user click on "back" button, setSeasonEpisodesDisplay sets the value
   * of seasonEpisodesDisplay to false and ShowManager is re-rendered
   */
  const previousPage = () => {
    setSeasonEpisodesDisplay(false);
  };

  /**
   * Function that will calculate how many episodes were
   * watched by the user. The value "seen" is being checked on each
   * episode and whenever "seen" is true, watchedEpisode is incremented
   *
   * @param {Object} episodes
   */
  const seenEpisodes = episodes => {
    let watchedEpisodes = 0;
    for (let i = 0; i < episodes.length; i++) {
      if (episodes[i].user.seen === true) {
        watchedEpisodes++;
      }
    }
    setWatchedEpisodes(watchedEpisodes);
    if (watchedEpisodes !== episodes.length) {
      setWatchedAllEpisodes(false);
    }
    if (watchedEpisodes == episodes.length) {
      setWatchedAllEpisodes(true);
    }
  };

  /**
   * Function to switch between the ShowEpisodes component
   * and the ShowEpisodeDetails component. Whenever the user click
   * on a specific episode, the "episodeId" value is set via
   * the setEpisodeDetailsId method, allowing the ShowEpisodeDetails to
   * be rendered
   *
   * @param {int} episodeId
   */
  const episodeDetails = episodeId => {
    setEpisodeDetailsId(episodeId);
  };

  /**
   * Function to mark all episodes of selected season as watched
   */
  const markAllEpAsWatched = () => {
    axios
      .post(
        "https://api.betaseries.com/seasons/watched?key=c499f6741abe&id=" +
          episodes[0].show.id +
          "&season=" +
          episodes[0].season +
          "&access_token=" +
          token
      )
      .then(res => {
        setWatchedAllEpisodes(true);
      });
  };

  const unmarkAllEpAsWatched = () => {
    axios
      .delete(
        "https://api.betaseries.com/seasons/watched?key=c499f6741abe&id=" +
          episodes[0].show.id +
          "&season=" +
          episodes[0].season +
          "&access_token=" +
          token
      )
      .then(res => {
        setWatchedAllEpisodes(false);
      });
  };

  return (
    <div>
      <div>
        {episodeDetailsId === false ? (
          episodes ? (
            <div>
              <div className="testooo">
                <p
                  className="episode_design_header"
                  onClick={() => setSeasonEpisodesDisplay(false)}
                >
                  WATCHED EPISODES : {watchedEpisode} / {episodes.length}{" "}
                  EPISODES
                </p>
              </div>
              <div className="episodes_box">
                {episodes.map(function(episode, index) {
                  return (
                    <div className="episode_picture" key={index}>
                      {episode.user.seen === false ? (
                        <img
                          className="episode_picture_blur"
                          onClick={() => episodeDetails(episode.id)}
                          src={
                            "https://api.betaseries.com/pictures/episodes?key=c499f6741abe&access_token=" +
                            token +
                            "&width=350&height=200&id=" +
                            episode.id
                          }
                        />
                      ) : (
                        <img
                          className="episode_picture"
                          onClick={() => episodeDetails(episode.id)}
                          src={
                            "https://api.betaseries.com/pictures/episodes?key=c499f6741abe&access_token=" +
                            token +
                            "&width=350&height=200&id=" +
                            episode.id
                          }
                        />
                      )}

                      <div className="episode_design">
                        {episode.code} - {episode.title} - {episode.date}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <Button variant="dark" onClick={() => previousPage()}>
                  Back
                </Button>{" "}
                {watchedAllEpisodes === false ? (
                  <div>
                    <Button
                      variant="outline-success"
                      onClick={() => markAllEpAsWatched()}
                    >
                      Mark all episodes as watched
                    </Button>{" "}
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="outline-danger"
                      onClick={() => unmarkAllEpAsWatched()}
                    >
                      All episodes watched
                    </Button>{" "}
                  </div>
                )}
              </div>
              <div />
            </div>
          ) : (
            <></>
          )
        ) : (
          <ShowEpisodeDetails
            episodeId={episodeDetailsId}
            setEpisodeDetailsId={setEpisodeDetailsId}
            token={token}
          />
        )}
      </div>
    </div>
  );
};

export default ShowEpisodes;
