import React, { Component } from "react";
import styled from "styled-components";
import MessageList from "./MessageList";
import DrawingPreview from "./DrawingPreview";
import NotFound from "./NotFound";
import GetParticipantInfo from "./GetParticipantInfo";
import DrawingBoard from "./DrawingBoard";
import SectionOverlay from "./SectionOverlay";
import Cover from "./ModalCover";
import Body from "./ModalBody";
import { gql, graphql, compose } from "react-apollo";

const Chat = styled.div`
  display: flex;
  justify-content: space-between;
`;

class DrawingDetails extends Component {
  state = {
    participant: null,
    currentSection: null
  };

  componentWillMount() {
    // Subscribe to messages
    this.props.data.subscribeToMore({
      document: messagesSubscription,
      variables: {
        drawingId: this.props.match.params.drawingId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newMessage = subscriptionData.data.messageAdded;

        // don't double add the message
        if (!prev.drawing.messages.find(msg => msg.id === newMessage.id)) {
          return Object.assign({}, prev, {
            drawing: Object.assign({}, prev.drawing, {
              messages: [...prev.drawing.messages, newMessage]
            })
          });
        } else {
          return prev;
        }
      }
    });

    // Subscribe to sections
    this.props.data.subscribeToMore({
      document: sectionsSubscription,
      variables: {
        drawingId: this.props.match.params.drawingId
      },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('section updated!!!!')
        if (!subscriptionData.data) {
          return prev;
        }

        const sectionUpdated = subscriptionData.data.sectionUpdated;
        console.log('sectionUpdated', sectionUpdated)

        return Object.assign({}, prev, {
          drawing: Object.assign({}, prev.drawing, {
            sections: [
              ...prev.drawing.sections.filter(s => s.id !== sectionUpdated.id),
              sectionUpdated
            ]
          })
        });
      }
    });
  }

  saveParticipant = participant => {
    console.log("saveParticipant", participant);
    this.setState({
      participant
    });
  };

  onCellClick = async ({ x, y }) => {
    console.log("onCellClick", x, y, this.state.participant.name);
    const { data: { addSection } } = await this.props.addSectionMutation({
      variables: {
        section: {
          drawingId: this.props.match.params.drawingId,
          x,
          y,
          creator: this.state.participant.name
        }
      }
    });
    console.log('sectionId', addSection.id)
    this.setState({ currentSection: { x, y, id: addSection.id } });
  };

  onSectionSave = () => {
    this.setState({currentSection: null });
  }

  render() {
    const { data: { loading, error, drawing }, match } = this.props;

    if (!this.state.participant) {
      return <GetParticipantInfo saveParticipant={this.saveParticipant} />;
    }

    if (loading) {
      return <DrawingPreview drawingId={match.params.drawingId} />;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    if (drawing === null) {
      return <NotFound />;
    }

    console.log("drawing", drawing);

    return (
      <div>
        <div>
          {drawing.name}
        </div>
        <DrawingBoard
          width={drawing.width}
          height={drawing.height}
          sections={drawing.sections}
          onCellClick={this.onCellClick}
        />
        <Chat>
          <MessageList
            messages={drawing.messages}
            participant={this.state.participant}
          />
        </Chat>
        {this.state.currentSection &&
          <Cover>
            <Body>
          <SectionOverlay
            creator={this.state.participant.name}
            section={this.state.currentSection}
            sectionSizePx={drawing.sectionSizePx}
            pixelSize={drawing.pixelSize}
            drawingId={match.params.drawingId}
            onSectionSave={this.onSectionSave}
          />
            </Body>
          </Cover>}
      </div>
    );
  }
}

export const drawingDetailsQuery = gql`
  query DrawingDetailsQuery($drawingId : ID!) {
    drawing(id: $drawingId) {
      id
      name
      width
      height
      sectionSizePx
      pixelSize
      sections {
        id
        x
        y
        status
      }
      messages {
        id
        text
        author 
      }
    }
  }
`;

const messagesSubscription = gql`
  subscription messageAdded($drawingId: ID!) {
    messageAdded(drawingId: $drawingId) {
      id
      text
      author
    }
  }
`;

const sectionsSubscription = gql`
  subscription sectionUpdated($drawingId: ID!) {
    sectionUpdated(drawingId: $drawingId) {
      id
      x
      y
      status
    }
  }
`;

const addSectionMutation = gql`
  mutation addSection($section: SectionInput!) {
    addSection(section: $section) {
      x
      y
      id
    }
  }
`;

export default compose(
  graphql(drawingDetailsQuery, {
    options: props => ({
      variables: { drawingId: props.match.params.drawingId }
    })
  }),
  graphql(addSectionMutation, {
    name: "addSectionMutation"
  })
)(DrawingDetails);
