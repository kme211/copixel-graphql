import React, { Component } from "react";
import styled from "styled-components";
import { graphql, gql, compose } from "react-apollo";
import Cover from "./Cover";
import Editor from "./Editor";

const Body = styled.div`
  background: white;
  padding: 1em;
`;

class SectionOverlay extends Component {
  state = {
    pixels: null
  };

  savePixels = async pixels => {
    console.log("savePixels", this.props);
    const response = await this.props.addPixelsToSectionMutation({
      variables: {
        drawingId: this.props.drawingId,
        sectionId: this.props.section.id,
        pixels
      }
    });
    console.log("pixels saved to section", response);
    this.props.onSectionSave();
  };

  render() {
    console.log("SectionOverlay this.props", this.props);

    const { data: { loading, error, neighbors }, section } = this.props;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>GraphQL Error: {error.message}</div>;
    console.log("SectionOverlay data", this.props.data);
    return (
      <Cover>
        <Body>
          <Editor
            neighbors={neighbors}
            x={section.x}
            y={section.y}
            sectionSizePx={this.props.sectionSizePx}
            pixelSize={this.props.pixelSize}
            savePixels={this.savePixels}
          />
        </Body>
      </Cover>
    );
  }
}

const getSectionNeighbors = gql`
  query neighbors($drawingId: ID!, $sectionX: Int!, $sectionY: Int!) {
    neighbors(drawingId: $drawingId, sectionX: $sectionX, sectionY: $sectionY) {
      x
      y
      relativePosition
      pixels {
        x
        y
        color
      }
    }
  }
`;

const addPixelsToSectionMutation = gql`
  mutation addPixelsToSection($drawingId: ID!, $sectionId: ID!, $pixels: [PixelInput!]!) {
    addPixelsToSection(drawingId: $drawingId, sectionId: $sectionId, pixels: $pixels) {
      status
    }
  }
`;

const sectionOverlayWithData = compose(
  graphql(getSectionNeighbors, {
    options: props => ({
      variables: {
        drawingId: props.drawingId,
        sectionX: props.section.x,
        sectionY: props.section.y
      }
    })
  }),
  graphql(addPixelsToSectionMutation, {
    name: "addPixelsToSectionMutation"
  })
)(SectionOverlay);

export default sectionOverlayWithData;
