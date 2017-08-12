import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import Inner from "./Inner";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import Toggle from "./Toggle";
import { withRouter } from "react-router";
import getTimestamp from "../utils/getTimestamp";

class AddDrawing extends Component {
  state = {
    error: null,
    name: "",
    width: 2,
    height: 1,
    public: true
  };

  onFormChange = e => {
    const value =
      e.target.value === "true"
        ? true
        : e.target.value === "false" ? false : e.target.value;
    this.setState({
      [e.target.name]: value
    });
  };

  onFormSubmit = async e => {
    e.preventDefault();
    try {
      console.log(this.state.public);
      const response = await this.props.mutate({
        variables: {
          drawing: {
            name: this.state.name,
            width: this.state.width,
            height: this.state.height,
            public: this.state.public,
            created: getTimestamp()
          }
        }
      });

      const { data: { addDrawing } } = response;
      this.props.history.push(`/drawing/${addDrawing.id}`);
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    if (this.state.error) {
      return (
        <div>
          {this.state.error.toString()}
        </div>
      );
    }
    return (
      <Inner>
        <form>
          <Input
            type="text"
            label="Name"
            id="name"
            placeholder="Any name will do..."
            onChange={this.onFormChange}
          />
          <Input
            type="number"
            label="Width"
            id="width"
            min={1}
            max={6}
            value={this.state.width}
            onChange={this.onFormChange}
          />
          <Input
            type="number"
            label="Height"
            id="height"
            min={1}
            max={6}
            value={this.state.height}
            onChange={this.onFormChange}
          />
          <Toggle
            onChange={this.onFormChange}
            value1="true"
            value2="false"
            label1="Public"
            label2="Private"
            icon1="eye"
            icon2="eye-blocked"
            name="public"
            checkedItem={this.state.public ? "true" : "false"}
          />
          <SubmitButton value="add new drawing" onClick={this.onFormSubmit} />
        </form>
      </Inner>
    );
  }
}

const addDrawingMutation = gql`
  mutation addDrawing($drawing: DrawingInput!) {
    addDrawing(drawing: $drawing) {
      id
      name
      created
    }
  }
`;

const AddDrawingWithMutation = graphql(addDrawingMutation)(
  withRouter(AddDrawing)
);

export default AddDrawingWithMutation;
