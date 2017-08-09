import React from "react";
import styled from "styled-components";
import AddMessage from "./AddMessage";
import ScrollArea from "react-scrollbar";
import PropTypes from "prop-types";

const Message = styled.div`
  padding: 0.25em;
  opacity: ${props => (props.optimistic ? 0.5 : 1)};
`;

const Author = styled.span`
  font-weight: 600;

`;

const Wrapper = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  & .area {
    height: 9rem;
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
          <Message key={message.id} optimistic={message.id < 0}>

            <div><Author>{message.author}</Author>: {message.text}</div>
          </Message>
        ))}
      </ScrollArea>
      <AddMessage participant={participant} />
    </Wrapper>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  participant: PropTypes.object.isRequired
};

export default MessageList;
