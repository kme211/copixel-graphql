import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ScrollArea from "react-scrollbar";
import AddMessage from "./AddMessage";
import MessageList from "./MessageList";
import Icon from "./Icon";

const Wrapper = styled.div`
  height: ${props => props.height};
  overflow: hidden;
  background-color: #ecf0f1;
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
  state = { userIsScrolling: false };

  onUserScroll = value => {
    // react-scrollbar executes this function
    // at the start, before user has scrolled
    // so check for top position in the value
    // before setting the state
    console.log(
      value.containerHeight,
      value.topPosition,
      value.containerHeight - value.topPosition
    );
    if (
      value.hasOwnProperty("topPosition") &&
      value.hasOwnProperty("containerHeight")
    ) {
      const closeToBottom = value.containerHeight - value.topPosition <= 40;
      console.log("closeToBottom", closeToBottom);
      this.setState({
        userIsScrolling: closeToBottom ? false : true
      });
    }
  };

  render() {
    return (
      <Wrapper show={this.props.show} height={this.props.height}>
        <HeaderButton onClick={this.props.toggleShow}>
          Messages{" "}
          <Icon
            style={{ transform: this.props.iconRotation }}
            icon="up-arrow"
          />
        </HeaderButton>

        <div>
          <ScrollArea
            speed={0.8}
            className="area"
            contentClassName="content"
            horizontal={false}
            onScroll={this.onUserScroll}
          >
            <MessageList
              userIsScrolling={this.state.userIsScrolling}
              messages={this.props.messages}
              participant={this.props.participant}
            />
          </ScrollArea>
          <AddMessage participant={this.props.participant} />
        </div>
      </Wrapper>
    );
  }
}

MessagesContainer.propTypes = {
  toggleShow: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  messages: PropTypes.array.isRequired,
  participant: PropTypes.object.isRequired
};

export default MessagesContainer;
