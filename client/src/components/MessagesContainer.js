import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import MessageList from "./MessageList";
import ScrollArea from "react-scroll";
import Icon from "./Icon";

const Wrapper = styled.div`
  height: ${props => props.height};
  overflow: hidden;
  background-color: #ECF0F1;
`;

const HeaderButton = styled.h2`
  background-color: #222;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem;
  cursor: pointer;
`;

class MessagesContainer extends Component {
  render() {
    console.log(this.props.iconRotation);
    return (
      <Wrapper show={this.props.show} height={this.props.height}>
        <HeaderButton onClick={this.props.toggleShow}>
          Messages
          {" "}
          <Icon
            style={{ transform: this.props.iconRotation }}
            icon="up-arrow"
          />
        </HeaderButton>
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
