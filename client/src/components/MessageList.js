import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import flatten from "lodash/flatten";
import compact from "lodash/compact";
import { getPrettyDate, isDateAfter } from "../utils/dateUtils";
import getUserMentionRegex from "../utils/getUserMentionRegex";

const Message = styled.div`
  padding: 0.25em 0;
  opacity: ${props => (props.optimistic ? 0.5 : 1)};
`;

const Wrapper = styled.div`margin: 0.5rem 1rem;`;

const Mention = styled.span`background-color: #f7c873;`;

const DT = styled.div`
  margin: 0.5rem 0;
  color: #4d4d4d;
  text-align: center;
  font-size: 0.75rem;
`;

const Author = styled.span`
  font-weight: 600;
  margin-right: 0.25rem;
`;

class MessageList extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
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
      this.context.scrollArea.scrollBottom();
    } catch (e) {
      window.setTimeout(() => this.scrollToBottom(), 50);
    }
  };

  render() {
    if (!this.props.user)
      return (
        <Wrapper>
          <Message>You must be logged in to see messages</Message>
        </Wrapper>
      );

    const regex = getUserMentionRegex(this.props.user.username);

    let messagesWithDates = this.props.messages.map((m, i, arr) => {
      const prevDate = i > 0 ? arr[i - 1].created : null;
      let includeDate = true;
      if (prevDate) includeDate = isDateAfter(m.crated, prevDate, "minute");
      return [
        includeDate
          ? <DT key={`dt-${m.id}`}>
              {getPrettyDate(m.created, "long")}
            </DT>
          : null,
        <Message key={m.id}>
          <Author>
            {m.author.username}:
          </Author>
          {flatten(
            m.text.split(" ").map((word, n) => {
              const result = regex.exec(word);
              if (result)
                return [
                  <Mention key={`mention-${n}-${m.id}`}>
                    {result[1]}
                  </Mention>,
                  result[2] ? result[2] + " " : " "
                ];
              return [word, " "];
            })
          )}
        </Message>
      ];
    });

    messagesWithDates = compact(flatten(messagesWithDates));

    return (
      <Wrapper>
        {!this.props.messages.length && <Message>No messages yet!</Message>}
        {messagesWithDates.length > 0 && messagesWithDates}
      </Wrapper>
    );
  }
}

MessageList.contextTypes = {
  scrollArea: PropTypes.object
};

export default MessageList;
