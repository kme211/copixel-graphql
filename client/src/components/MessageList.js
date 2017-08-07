import React from "react";
import styled from "styled-components";
import AddMessage from "./AddMessage";
import ScrollArea from "react-scrollbar";

const Message = styled.div`
  padding: 0.25em;
  opacity: ${props => props.optimistic ? 0.5 : 1};
`;

const Author = styled.div`
  padding: 0.25em 0;
  font-weight: 600;
`;

const Wrapper = styled.div`
  width: 100%;
  & .area {
    height: 9.75rem;
  }
`;

const MessageList = ({ messages, participant }) => {
  return (
    <Wrapper>
        <ScrollArea
            speed={0.8}
            className="area"
            contentClassName="content"
            horizontal={false}
            >
      {messages.map(message => (
        <Message
          key={message.id}
          optimistic={message.id < 0}
        >
          <Author>{message.author}</Author>
          <div>{message.text}</div>
        </Message>
      ))}
      </ScrollArea>
      <AddMessage participant={participant} />
    </Wrapper>
  );
};
export default MessageList;
