import React from "react";
import { gql, graphql } from "react-apollo";
import styled from "styled-components";
import Wrapper from "./DrawingDetailWrapper";
import Loader from "./Loader";
import MessagesHeaderButton from "./MessagesHeaderButton";
import NotFound from "./NotFound";

const NameWrapper = styled.div`
  font-size: 4vw;
  color: #222;
  text-align: center;
  height: calc(100% - 16rem);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MessagesWrapper = styled.div`
  height: 16rem;
  & > p {
    padding: 1rem;
  }
`;

const DrawingPreview = ({ data: { loading, error, drawing } }) => {
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Wrapper>
        {error.message}
      </Wrapper>
    );
  }

  if (!drawing) {
    return <NotFound />;
  }

  return (
    <Wrapper>
      <NameWrapper>
        {drawing.name}
      </NameWrapper>

      <MessagesWrapper>
        <MessagesHeaderButton iconRotation="rotate(180deg)" />
        <p>Loading messages...</p>
      </MessagesWrapper>
    </Wrapper>
  );
};

export const drawingQuery = gql`
  query DrawingQuery($drawingId: ID!) {
    drawing(id: $drawingId) {
      id
      name
    }
  }
`;

export default graphql(drawingQuery, {
  options: props => ({
    variables: { drawingId: props.drawingId }
  })
})(DrawingPreview);
