import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import flatten from "lodash/flatten";
import compact from "lodash/compact";

const Message = styled.div`
  padding: 0.25em 0;
  opacity: ${props => (props.optimistic ? 0.5 : 1)};
`;

const Wrapper = styled.div`margin: 0.5rem 1rem;`;

const DT = styled.div`
  margin: 0.5rem 0;
  color: #4d4d4d;
  text-align: center;
  font-size: 0.75rem;
`;

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
    const zone = moment.tz.guess();

    let messagesWithDates = this.props.messages.map((m, i, arr) => {
      const date = moment(m.created).tz(zone);
      const prevDate = i > 0 ? arr[i - 1].created : null;
      let includeDate = true;
      if (prevDate)
        includeDate = moment(m.created).isAfter(moment(prevDate), "minute");
      return [
        includeDate
          ? <DT key={`dt-${m.id}`}>
              {moment(date).tz(zone).format("lll")}
            </DT>
          : null,
        <div key={m.id}>
          <Author>{m.author.username}</Author>: {m.text}
        </div>
      ];
    });

    messagesWithDates = compact(flatten(messagesWithDates));
    return (
      <Wrapper>
        {!this.props.messages.length && <Message>No messages yet!</Message>}
        {messagesWithDates.length && messagesWithDates}
      </Wrapper>
    );
  }
}

MessageList.contextTypes = {
  scrollArea: PropTypes.object
};

export default MessageList;
