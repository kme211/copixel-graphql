import React, { Component } from "react";
import { graphql, gql, compose } from "react-apollo";
import PropTypes from "prop-types";
import Editor from "./Editor";

class SectionOverlay extends Component {
  static propTypes = {
    sectionSizePx: PropTypes.number.isRequired,
    pixelSize: PropTypes.number.isRequired
  };

  state = {
    pixels: null
  };

  savePixels = async pixels => {
    console.log("savePixels", this.props);
    const response = await this.props.addPixelsToSectionMutation({
      variables: {
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
      <div>
        <Editor
          neighbors={neighbors}
          x={section.x}
          y={section.y}
          sectionSizePx={this.props.sectionSizePx}
          pixelSize={this.props.pixelSize}
          savePixels={this.savePixels}
        />
      </div>
    );
  }
}

const getSectionNeighbors = gql`
  query neighbors($sectionX: Int!, $sectionY: Int!) {
    neighbors(sectionX: $sectionX, sectionY: $sectionY) {
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
  mutation addPixelsToSection($sectionId: ID!, $pixels: [PixelInput!]!) {
    addPixelsToSection(sectionId: $sectionId, pixels: $pixels) {
      status
    }
  }
`;

const sectionOverlayWithData = compose(
  graphql(getSectionNeighbors, {
    options: props => ({
      variables: {
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
