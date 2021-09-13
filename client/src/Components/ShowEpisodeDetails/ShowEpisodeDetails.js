import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "./ShowEpisodeDetails.css";

const ShowEpisodeDetails = ({ episodeId, setEpisodeDetailsId, token }) => {
  const [episodeInfos, setEpisodeInfos] = useState(null);
  const [markedEpisode, setMarkedEpisode] = useState(false);
  const [comment, setComment] = useState("");
  const [commentHasBeenSent, setCommentHasBeenSent] = useState(false);

  useEffect(() => {
    fetchEpisodeDetails();
  }, [markedEpisode]);

  /**
   * Function to switch between the ShowEpisodeDetails component
   * and the ShowEpisodes component. Whenever the user click
   * on the "back" button, the "episodeId" value is set via
   * the setEpisodeDetailsId method, allowing the ShowEpisodes to
   * be re-rendered
   */
  const previousPage = () => {
    setEpisodeDetailsId(false);
  };

  /**
   * Fetches the episode details from betaseries and set all the infos
   * through the setEpisodeInfos method
   */
  const fetchEpisodeDetails = () => {
    axios
      .get(
        "https://api.betaseries.com/episodes/display?key=c499f6741abe&id=" +
          episodeId +
          "&access_token=" +
          token
      )
      .then(res => {
        setEpisodeInfos(res.data.episode);
      });
  };

  /**
   * Function to mark an episode as watched by the user
   * whenever the "Mark as watched" button is clicked
   *
   * @param {int} episodeId
   */
  const setEpisodeAsWatched = episodeId => {
    axios
      .post(
        "https://api.betaseries.com/episodes/watched?key=c499f6741abe&bulk=false&id=" +
          episodeId +
          "&access_token=" +
          token
      )
      .then(res => {
        setMarkedEpisode(true);
      });
  };

  /**
   * Function to unmark an episode as watched by the user
   * whenever the "Watched" button is clicked
   *
   * @param {int} episodeId
   */
  const setEpisodeAsUnwatched = episodeId => {
    axios
      .delete(
        "https://api.betaseries.com/episodes/watched?key=c499f6741abe&bulk=false&id=" +
          episodeId +
          "&access_token=" +
          token
      )
      .then(res => {
        setMarkedEpisode(true);
      });
  };

  const writeComment = event => {
    event.preventDefault();
    console.log(event.target.value);
    axios
      .post(
        "https://api.betaseries.com/comments/comment?key=c499f6741abe&type=episode&text=" +
          event.target.value +
          "&id=" +
          episodeId +
          "&access_token=" +
          token
      )
      .then(res => {
        console.log(res.data);
        setCommentHasBeenSent(true);
      });
  };

  return (
    <div>
      {episodeInfos !== null ? (
        <div>
          <div className="episode_details_design">
            Episode {episodeInfos.episode} - {episodeInfos.title}
          </div>
          <div className="episode_details_box">
            <div>
              <img
                src={
                  "https://api.betaseries.com/pictures/episodes?key=c499f6741abe&access_token=" +
                  token +
                  "&width=350&height=200&id=" +
                  episodeInfos.id
                }
                alt="episode screen"
                className="episode_img"
              />
            </div>
            <div className="episode_infos">
              <p>
                Note : {Math.round(episodeInfos.note.mean)}/5 with a total of{" "}
                {episodeInfos.note.total} reviews{" "}
              </p>
              <p>Aired on : {episodeInfos.date}</p>
              <p>Summary : {episodeInfos.description}</p>
              <div className="details_button">
                {episodeInfos.user.seen === false ? (
                  <div>
                    <Button
                      variant="success"
                      onClick={() => setEpisodeAsWatched(episodeInfos.id)}
                    >
                      Mark as watched
                    </Button>{" "}
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="secondary"
                      onClick={() => setEpisodeAsUnwatched(episodeInfos.id)}
                    >
                      Watched
                    </Button>{" "}
                  </div>
                )}
                {episodeInfos.platform_links.map(function(
                  platform_link,
                  index
                ) {
                  return (
                    <div key={index}>
                      {platform_link.platform === "Netflix" ? (
                        <div className="netflix_button">
                          <a href={platform_link.link} target="_blank">
                            <Button className="netflix_button_style">
                              Netflix
                            </Button>{" "}
                          </a>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })}
                <div className="comment_episode_form">
                  <form>
                    <label>
                      <b>Write a comment</b> :
                    </label>
                    <input
                      type="text"
                      value={comment}
                      className="search_input"
                      onChange={e => setComment(e.target.value)}
                    />
                    <input
                      type="submit"
                      value={comment}
                      onClick={event => writeComment(event)}
                      hidden
                    />
                  </form>
                  {commentHasBeenSent === false ? (
                    <></>
                  ) : (
                    <p className="sent_comment_warning">Your comment has been sent !</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Button
        variant="dark"
        className="back_button"
        onClick={() => previousPage()}
      >
        Previous Page
      </Button>{" "}
    </div>
  );
};

export default ShowEpisodeDetails;
