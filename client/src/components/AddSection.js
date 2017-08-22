import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import PropTypes from "prop-types";
import getTimestamp from "../utils/getTimestamp";
import Icon from "./Icon";
import ModalCloseButton from "./ModalCloseButton";
import styled from "styled-components";

const StyledIcon = styled(Icon)`
  font-size: 4rem;
  display: block;
  margin: 0 auto 1rem auto;
`;

class AddSection extends Component {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    drawing: PropTypes.string.isRequired,
    onSectionAdded: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
  };
  state = {
    error: null
  };
  async componentDidMount() {
    const section = {
      x: this.props.x,
      y: this.props.y,
      drawing: this.props.drawing,
      created: getTimestamp()
    };
    try {
      const response = await this.props.mutate({
        variables: {
          section
        }
      });
      const { id, x, y } = response.data.addSection;
      this.props.onSectionAdded(x, y, id);
    } catch (e) {
      this.setState({
        error: /section already exists/i.test(e.message)
          ? "Looks like someone got to that section before you!"
          : "Something went wrong while trying to add that section."
      });
    }
  }
  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div>
          <ModalCloseButton onClick={this.props.closeModal} />
          <StyledIcon icon="emoji-upset" />
          {error}
        </div>
      );
    }
    return (
      <div>
        <StyledIcon icon="in-progress" />
        Please wait while the section is added...
      </div>
    );
  }
}

const addSectionMutation = gql`
mutation addSection($section: SectionInput!) {
  addSection(section: $section) {
    x
    y
    id
  }
}
`;

export default graphql(addSectionMutation)(AddSection);
