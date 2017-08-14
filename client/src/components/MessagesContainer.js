import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ScrollArea from "react-scrollbar";
import AddMessage from "./AddMessage";
import MessageList from "./MessageList";
import HeaderButton from "./MessagesHeaderButton";

const Wrapper = styled.div`
  height: ${props => props.height};
  overflow: hidden;
`;

class MessagesContainer extends Component {
  state = { userIsScrolling: false };

  onUserScroll = value => {
    // react-scrollbar executes this function
    // at the start, before user has scrolled
    // so check for top position in the value
    // before setting the state
    console.log(
      value.realHeight,
      value.topPosition,
      value.realHeight - value.topPosition - value.topPosition
    );
    if (
      value.hasOwnProperty("topPosition") &&
      value.hasOwnProperty("realHeight") &&
      value.hasOwnProperty("containerHeight")
    ) {
      const closeToBottom =
        value.realHeight - value.topPosition - value.containerHeight <=
        value.containerHeight / 2;
      console.log("closeToBottom", closeToBottom);
      this.setState({
        userIsScrolling: closeToBottom ? false : true
      });
    }
  };

  render() {
    return (
      <Wrapper show={this.props.show} height={this.props.height}>
        <HeaderButton onClick={this.props.toggleShow} iconRotation={this.props.iconRotation}/>
        <div>
          <ScrollArea
            speed={0.8}
            className="area"
            contentClassName="content"
            horizontal={false}
            onScroll={this.onUserScroll}
          >
            <MessageList
              user={this.props.participant}
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
  participant: PropTypes.object.isRequired,
  iconRotation: PropTypes.string.isRequired
};

export default MessagesContainer;
