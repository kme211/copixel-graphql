import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import moment from "moment-timezone";
import LoadingSpinner from "./LoadingSpinner";

const DrawingLink = styled(Link)`
  display: block;
  text-decoration: none;
  margin-bottom: 0.5rem;
  color: inherit;
  & .name {
    color: #FC8A15;
    font-size: 1.25rem;
  }
  & .created {
    color: #909090;
  }
`;

const Linky = styled(Link)`
  text-decoration: none;
  color: inherit;
  border-bottom: 1px dashed #222;
`;

const DrawingsList = ({
  data: { loading, error, drawings },
  isLoggedIn,
  user
}) => {
  if (!drawings && loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <div>
        {error.message}
      </div>
    );
  }

  if (!drawings.length && !user) {
    return (
      <div>
        <h2>Shucks, there aren't any drawings to contribute to right now.</h2>
        {isLoggedIn() &&
          <p>
            You should <Linky to="/add">start one</Linky> now!
          </p>}
        {!isLoggedIn() && <p>You should log in to start one!</p>}
      </div>
    );
  }

  if (!drawings.length && user) {
    return (
      <div>
        <h2>You haven't contributed to any drawings yet.</h2>
        <p>
          Perhaps you should <Linky to="/add">start one</Linky> or{" "}
          <Linky to="/">find one to contribute to</Linky>.
        </p>
      </div>
    );
  }

  const zone = moment.tz.guess();

  return (
    <div>
      {drawings.map(ch => {
        const date = moment(ch.created).tz(zone);
        const numSectionsAvailable = ch.sectionsNotStarted;
        return (
          <div
            key={ch.id}
            className={"drawing " + (ch.id < 0 ? "optimistic" : "")}
          >
            <DrawingLink to={ch.id < 0 ? `/` : `drawing/${ch.id}`}>
              <div className="name">
                {ch.name}
              </div>
              <div className="left">
                {numSectionsAvailable} section{numSectionsAvailable > 1 && "s"}{" "}
                available
              </div>
              <div className="created">
                Started{" "}
                <abbr title={moment(date).format("LLLL")}>
                  {date.fromNow()}
                </abbr>
              </div>
            </DrawingLink>
          </div>
        );
      })}
    </div>
  );
};

DrawingsList.propTypes = {
  user: PropTypes.object,
  isLoggedIn: PropTypes.func.isRequired
};

export default DrawingsList;