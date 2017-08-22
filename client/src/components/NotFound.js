import React from "react";
import styled from "styled-components";
import Icon from "./Icon";

const StyledIcon = styled(Icon)`
  font-size: 6rem;
  display: block;
  margin: 1rem auto;
`;

const Header = styled.h2`
  text-align: center;
`;

const NotFound = props => {
  return (
    <div>
      <StyledIcon icon="emoji-upset" />
      <Header>Sorry, but that page was not found!</Header>
    </div>
  );
};

export default NotFound;
