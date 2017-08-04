import React from "react";
import styled from "styled-components";
import AddMessage from "./AddMessage";

const Message = styled.div`
  padding: 0.25em;
  opacity: ${props => props.optimistic ? 0.5 : 1};
`;

const Author = styled.div`
  padding: 0.25em 0;
  font-weight: 600;
`;

const MessageList = ({ messages, participant }) => {
  return (
    <div>
      <h2>Chat</h2>
      {messages.map(message => (
        <Message
          key={message.id}
          optimistic={message.id < 0}
        >
          <Author>{message.author}</Author>
          <div>{message.text}</div>
        </Message>
      ))}
      <AddMessage participant={participant} />
    </div>
  );
};
export default MessageList;
