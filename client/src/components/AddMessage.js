import React from "react";
import styled from "styled-components";
import { gql, graphql } from "react-apollo";
import { drawingDetailsQuery } from "./DrawingDetails";
import { withRouter } from "react-router";
import Input from "./Input";
import getTimestamp from "../utils/getTimestamp";

const MessageInput = styled.div`margin: 0 1rem;`;

const AddMessage = ({ mutate, match, participant }) => {
  const handleKeyUp = evt => {
    if (evt.keyCode === 13) {
      console.log("addMessage");
      const created = getTimestamp();
      mutate({
        variables: {
          message: {
            drawing: match.params.drawingId,
            text: evt.target.value,
            created
          }
        },
        optimisticResponse: {
          addMessage: {
            text: evt.target.value,
            author: participant,
            created,
            id: Math.round(Math.random() * -1000000),
            __typename: "Message"
          }
        },
        update: (store, { data: { addMessage } }) => {
          console.log("update", addMessage);
          // Read the data from the cache for this query.
          const data = store.readQuery({
            query: drawingDetailsQuery,
            variables: {
              drawingId: match.params.drawingId
            }
          });

          // don't double add the message
          if (!data.drawing.messages.find(msg => msg.id === addMessage.id)) {
            // Add our Message from the mutation to the end.
            data.drawing.messages.push(addMessage);
          }
          // Write the data back to the cache.
          store.writeQuery({
            query: drawingDetailsQuery,
            variables: {
              drawingId: match.params.drawingId
            },
            data
          });
        }
      });
      evt.target.value = "";
    }
  };

  return (
    <MessageInput>
      <Input
        margin="0"
        type="text"
        placeholder="Write a message..."
        onKeyUp={handleKeyUp}
      />
    </MessageInput>
  );
};

const addMessageMutation = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
      author {
        username
      }
    }
  }
`;

const AddMessageWithMutation = graphql(addMessageMutation)(
  withRouter(AddMessage)
);

export default AddMessageWithMutation;
