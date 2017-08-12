import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Message = styled.div`
  padding: 0.25em 0;
  opacity: ${props => (props.optimistic ? 0.5 : 1)};
`;

const Wrapper = styled.div`margin: 0.5rem 1rem;`;

const Author = styled.span`font-weight: 600;`;

class MessageList extends Component {
  static propTypes = {
    userIsScrolling: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    participant: PropTypes.object.isRequired
  };

  componentDidUpdate(prevProps) {
    if (prevProps.messages.length < this.props.messages.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    if (this.props.userIsScrolling) return;
    try {
      console.log("Attempting to scroll to bottom");
      this.context.scrollArea.scrollBottom();
    } catch (e) {
      console.log("Scroll to bottom did not working trying again 50ms");
      window.setTimeout(() => this.scrollToBottom(), 50);
    }
  };

  render() {
    return (
      <Wrapper>
        {!this.props.messages.length && <Message>No messages yet!</Message>}
        {this.props.messages.map(message =>
          <Message key={message.id} optimistic={message.id < 0}>
            <div>
              <Author>{message.author.username}</Author>: {message.text}
            </div>
          </Message>
        )}
      </Wrapper>
    );
  }
}

MessageList.contextTypes = {
  scrollArea: PropTypes.object
};

export default MessageList;
