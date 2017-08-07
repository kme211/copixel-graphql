import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import MessageList from "./MessageList";
import Motion, { spring } from "react-motion";
import ScrollArea from "react-scroll";
import Icon from "./Icon";

const Wrapper = styled.div`
  height: ${props => props.show ? '15rem' : '3rem'};
  transition: height 0.4s linear;
  overflow: hidden;
  & .header {
    font-size: 1rem;
    font-weight: 600;
    margin: 1rem 0;
  }
`;

class MessagesContainer extends Component {
  render() {

    return (
      <Wrapper show={this.props.show}>
        <h2 className="header" onClick={this.props.toggleShow}>Messages <Icon icon="up-arrow"/></h2>
        <MessageList
          messages={this.props.messages}
          participant={this.props.participant}
        />
      </Wrapper>
    );
  }
}

MessagesContainer.propTypes = {
  toggleShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  messages: PropTypes.array.isRequired,
  participant: PropTypes.string.isRequired
};

export default MessagesContainer;
