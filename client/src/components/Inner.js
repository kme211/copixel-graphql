import styled from "styled-components";

const Inner = styled.div`
  max-width: 800px;
  padding: 1rem;
  margin: ${props => props.sceneBody ? '75px auto 0 auto' : '0 auto'};
  @media all and (max-width: 800px) {
    margin: ${props => props.sceneBody ? '52px auto 0 auto' : '0 auto'};
  }
`;

export default Inner;