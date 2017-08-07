import React, { Component } from "react";
import styled from "styled-components";
import MessageList from "./MessageList";
import DrawingPreview from "./DrawingPreview";
import NotFound from "./NotFound";
import GetParticipantInfo from "./GetParticipantInfo";
import DrawingBoard from "./DrawingBoard";
import SectionOverlay from "./SectionOverlay";
import Button from "./Button";
import Cover from "./ModalCover";
import Body from "./ModalBody";
import Canvas from "./Canvas";
import { gql, graphql, compose } from "react-apollo";
import getCellSize from "../utils/getOptimalCellSize";
import { Motion, StaggeredMotion, spring } from "react-motion";

const Chat = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BoardContainer = styled.div`
position: relative;
margin: 0 auto;
${props => `
  width: ${props.width}px;
`}
`;

const Prompt = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  font-size: 2rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  font-family: 'VT323', monospace;
`;

class DrawingDetails extends Component {
  state = {
    participant: null,
    currentSection: null,
    showDrawing: false
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
        if (!subscriptionData.data) {
          return prev;
        }

        const sectionUpdated = subscriptionData.data.sectionUpdated;

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
    this.setState({
      participant
    });
  };

  onCellClick = async ({ x, y }) => {
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
    this.setState({ currentSection: { x, y, id: addSection.id } });
  };

  onSectionSave = () => {
    this.setState({ currentSection: null });
  };

  toggleDrawing = () => {
    console.log("showDrawing");
    this.setState(prevState => ({
      showDrawing: !prevState.showDrawing
    }));
  };

  render() {
    const { data: { loading, error, drawing }, match } = this.props;

    if (loading) {
      return <DrawingPreview drawingId={match.params.drawingId} />;
    }
    if (error) {
      return (
        <p>
          {error.message}
        </p>
      );
    }
    if (!drawing) {
      return <NotFound />;
    }

    const cellSize = getCellSize(drawing.width, drawing.height);
    const drawingIsComplete =
      drawing.sections.length === drawing.width * drawing.height &&
      drawing.sections.every(s => s.status === "COMPLETED");
    let finalPixels = {};
    if (drawingIsComplete) {
      const pixelsArr = drawing.sections
        .map(s => s.pixels)
        .reduce((a, b) => a.concat(b));
      for (let px of pixelsArr) {
        finalPixels[`${px.x},${px.y}`] = px.color;
      }
    }

    const defaultStyles = new Array(drawing.width * drawing.height).fill({
      opacity: 1,
      scale: 1
    });

    return (
      <div>
        {!this.state.participant &&
          <GetParticipantInfo saveParticipant={this.saveParticipant} />}
        <div>
          {drawing.name}
        </div>
        <BoardContainer width={cellSize * drawing.width}>
          <StaggeredMotion
            defaultStyles={defaultStyles}
            styles={prevInterpolatedStyles =>
              prevInterpolatedStyles.map((_, i) => {
                const {showDrawing} = this.state;
                return i === 0
                  ? { opacity: spring(showDrawing ? 0 : 1), scale: spring(showDrawing ? 0 : 1) }
                  : { opacity: spring(prevInterpolatedStyles[i - 1].opacity), scale: spring(prevInterpolatedStyles[i - 1].scale) };
              })}
          >
            {interpolatingStyles =>
              <DrawingBoard
                styles={interpolatingStyles}
                width={drawing.width}
                height={drawing.height}
                cellSize={cellSize}
                sections={drawing.sections}
                onCellClick={this.onCellClick}
              />}
          </StaggeredMotion>

          {drawingIsComplete &&
            <div>
              <Canvas
                isStatic
                embed
                style={{
                  zIndex: -1,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  margin: "0 auto"
                }}
                embedWidth={cellSize * drawing.width}
                width={drawing.width * drawing.sectionSizePx}
                height={drawing.height * drawing.sectionSizePx}
                pixelSize={drawing.pixelSize}
                sectionSizePx={drawing.sectionSizePx}
                pixels={finalPixels}
              />
              {!this.state.showDrawing && <Button onClick={this.toggleDrawing}>Reveal drawing!</Button>}
            </div>}
        </BoardContainer>
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
  query DrawingDetailsQuery($drawingId: ID!) {
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
        pixels {
          color
          x
          y
        }
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
      pixels {
        x
        y
        color
      }
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
