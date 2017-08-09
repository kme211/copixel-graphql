import React, { Component } from "react";
import styled from "styled-components";
import DrawingPreview from "./DrawingPreview";
import NotFound from "./NotFound";
import GetParticipantInfo from "./GetParticipantInfo";
import DrawingBoard from "./DrawingBoard";
import SectionOverlay from "./SectionOverlay";
import Button from "./Button";
import Cover from "./ModalCover";
import Body from "./ModalBody";
import MessagesContainer from "./MessagesContainer";
import { gql, graphql, compose } from "react-apollo";
import getCellSize from "../utils/getOptimalCellSize";
import CompleteDrawing from "./CompleteDrawing";
import { Motion, StaggeredMotion, spring } from "react-motion";

const BoardContainer = styled.div`
position: relative;
margin: 0 auto;
${props => `
  width: ${props.width};
  height: ${props.height};
`}
overflow: hidden;
display: flex;
justify-content: center;
align-items: center;
`;

class DrawingDetails extends Component {
  state = {
    participant: null,
    currentSection: null,
    showDrawing: false,
    showMessages: true
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
    this.setState(prevState => ({
      showDrawing: !prevState.showDrawing
    }));
  };

  toggleMessages = () => {
    this.setState(prevState => ({ showMessages: !prevState.showMessages }));
  };

  initializeBoardContainer = el => {
    if (el) this.boardContainerEl = el;
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

    const drawingIsComplete =
      drawing.sections.length === drawing.width * drawing.height &&
      drawing.sections.every(s => s.status === "COMPLETED");

    const defaultStyles = new Array(drawing.width * drawing.height).fill({
      opacity: 1,
      scale: 1
    });

    return (
      <div style={{ background: "rgb(234, 234, 234)" }}>
        {!this.state.participant &&
          <GetParticipantInfo saveParticipant={this.saveParticipant} />}
        <Motion
          defaultStyle={{
            messagesHeight: this.state.showMessages ? 15 : 3,
            messagesIconRotation: this.state.showMessages ? 180 : 0
          }}
          style={{
            messagesHeight: spring(this.state.showMessages ? 15 : 3),
            messagesIconRotation: spring(this.state.showMessages ? 180 : 0)
          }}
        >
          {({ messagesHeight, messagesIconRotation }) => (
            <div>
              <BoardContainer
                width={`${getCellSize(drawing.width, drawing.height, this.boardContainerEl, 40) * drawing.width}px`}
                innerRef={this.initializeBoardContainer}
                height={`calc(100vh - ${messagesHeight + 3}rem)`}
              >
                <StaggeredMotion
                  defaultStyles={defaultStyles}
                  styles={prevInterpolatedStyles =>
                    prevInterpolatedStyles.map((_, i) => {
                      const { showDrawing } = this.state;
                      return i === 0
                        ? {
                            opacity: spring(showDrawing ? 0 : 1),
                            scale: spring(showDrawing ? 0 : 1)
                          }
                        : {
                            opacity: spring(
                              prevInterpolatedStyles[i - 1].opacity
                            ),
                            scale: spring(prevInterpolatedStyles[i - 1].scale)
                          };
                    })}
                >
                  {interpolatingStyles => (
                    <div>
                      <DrawingBoard
                        styles={interpolatingStyles}
                        width={drawing.width}
                        height={drawing.height}
                        cellSize={getCellSize(
                          drawing.width,
                          drawing.height,
                          this.boardContainerEl,
                          40
                        )}
                        sections={drawing.sections}
                        onCellClick={this.onCellClick}
                      >
                        {drawingIsComplete &&
                          <CompleteDrawing
                            drawingId={drawing.id}
                            width={drawing.width * drawing.sectionSizePx}
                            height={drawing.height * drawing.sectionSizePx}
                            pixelSize={drawing.pixelSize}
                            sectionSizePx={drawing.sectionSizePx}
                            embedWidth={
                              getCellSize(
                                drawing.width,
                                drawing.height,
                                this.boardContainerEl,
                                40
                              ) * drawing.width
                            }
                            style={{
                              zIndex: 0,
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0
                            }}
                          />}
                      </DrawingBoard>
                      {drawingIsComplete &&
                        !this.state.showDrawing &&
                        <Button onClick={this.toggleDrawing}>
                          Reveal drawing!
                        </Button>}
                    </div>
                  )}
                </StaggeredMotion>

              </BoardContainer>
              <MessagesContainer
                show={this.state.showMessages}
                height={`${messagesHeight}rem`}
                iconRotation={`rotate(${messagesIconRotation}deg)`}
                toggleShow={this.toggleMessages}
                participant={this.state.participant}
                messages={drawing.messages}
              />
            </div>
          )}
        </Motion>

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
