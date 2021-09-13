import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { Button } from "react-bootstrap";
import "./AddShow.css";
import axios from "axios";

const AddShow = ({ token, setAdd, setAddSetting }) => {
  const [displayInput, setDisplayInput] = useState(null);
  const [submittedShow, setSubmittedShow] = useState("");
  const [apiFetchedShows, setApiFetchedShows] = useState(null);

  useEffect(() => {
    if (submittedShow.length >= 3) {
      fetchSelectedShow();
    }
  }, [submittedShow]);

  useEffect(() => {
  }, [apiFetchedShows]);

  const handleDisplayInput = () => {
    if (displayInput === null) {
      setDisplayInput(true);
    } else {
      setDisplayInput(null);
    }
  };

  /**
   * API Call to retrieve all shows available from betaseries
   */
  const fetchSelectedShow = () => {
    axios
      .post("https://localhost:8000/shows/search", {
        submittedShow: submittedShow
      })
      .then(res => {
        if (res.data.shows.length < 1) {
          setApiFetchedShows(0);
        } else {
          setApiFetchedShows(res.data.shows);
        }
      });
  };

  const handleLastValue = show => {
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (event.key === "Enter") {
      
    }
  };

  const fetchNewShow = newShow => {
    axios
      .post("https://localhost:8000/show/add", {
        showId: newShow.showId,
        userToken: token
      })
      .then(res => {
        if (setAddSetting === false) {
          setAdd(true);
        } else {
          setAdd(false);
        }
      });
  };

  return (
    <div className="add_show_button">
      {displayInput === null ? (
        <>
          <FaPlusCircle
            color="black"
            className="add_show_button"
            size="25"
            onClick={() => handleDisplayInput()}
          />
          Add a show
        </>
      ) : (
        <div>
          <FaMinusCircle
            color="black"
            className="add_show_button"
            size="25"
            onClick={() => handleDisplayInput()}
          />
          <form onKeyUp={handleSubmit}>
            <label>Show title :</label>
            <input
              type="text"
              value={submittedShow}
              onChange={e => setSubmittedShow(e.target.value)}
            />
            <input
              type="submit"
              value="Submit"
              onClick={e => e.preventDefault()}
              hidden
            />
          </form>
        </div>
      )}
      {apiFetchedShows !== null ? (
        <div>
          Shows you could add :
          <ul>
            {Object.keys(apiFetchedShows).map(function(show, index) {
              return (
                <div key={index} className="suggestion_shows">
                  <li
                    value={apiFetchedShows[show].title}
                    onClick={() =>
                      handleLastValue({
                        showTitle: apiFetchedShows[show].title,
                        showId: apiFetchedShows[show].id
                      })
                    }
                  >
                    {apiFetchedShows[show].title}
                  </li>
                  <Button
                    className="suggestion"
                    variant="outline-info"
                    onClick={() =>
                      fetchNewShow({
                        showTitle: apiFetchedShows[show].title,
                        showId: apiFetchedShows[show].id
                      })
                    }
                  >
                    Add
                  </Button>
                </div>
              );
            })}{" "}
          </ul>
        </div>
      ) : (
        <></>
      )}
      {apiFetchedShows === 0 ? <div>No title available. Please</div> : <></>}
    </div>
  );
};

export default AddShow;
