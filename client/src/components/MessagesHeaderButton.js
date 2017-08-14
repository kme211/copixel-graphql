import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Icon from "./Icon";

const Wrapper = styled.h2`
  background-color: #222;
  color: white;
  font-size: 1rem;
  font-weight: 300;
  padding: 1rem;
  cursor: pointer;
`;

const MessagesHeaderButton = ({ onClick, iconRotation }) => (
  <Wrapper onClick={onClick && onClick}>
    Messages{" "}
    <Icon style={{ transform: iconRotation }} icon="up-arrow" />
  </Wrapper>
);

MessagesHeaderButton.propTypes = {
  iconRotation: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default MessagesHeaderButton;
