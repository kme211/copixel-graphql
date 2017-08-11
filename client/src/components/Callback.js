import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

const Callback = props => (
  <Redirect to={{ pathname: localStorage.getItem("loggedInFrom") }} />
);

export default Callback;
