import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import Inner from "./Inner";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import Toggle from "./Toggle";
import { drawingsListQuery } from "./DrawingsListWithData";

class AddDrawing extends Component {
  state = {
    name: "",
    width: 2,
    height: 1,
    public: true
  };

  onFormChange = e => {
    const value = e.target.value === "true"
      ? true
      : e.target.value === "false" ? false : e.target.value;
    this.setState({
      [e.target.name]: value
    });
  };

  onFormSubmit = e => {
    e.preventDefault();
    this.props.mutate({
      variables: { name: this.state.name },
      optimisticResponse: {
        addDrawing: {
          name: this.state.name,
          width: +this.state.width,
          height: +this.state.height,
          public: this.state.public,
          id: Math.round(Math.random() * -1000000),
          __typename: "Drawing"
        }
      },
      update: (store, { data: { addDrawing } }) => {
        // Read the data from the cache for this query.
        const data = store.readQuery({ query: drawingsListQuery });
        // Add our drawing from the mutation to the end.
        data.drawings.push(addDrawing);
        // Write the data back to the cache.
        store.writeQuery({ query: drawingsListQuery, data });
      }
    });
  };

  render() {
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
          <SubmitButton
            value="add new drawing"
            onClick={this.onFormSubmit}
          />
        </form>
      </Inner>
    );
  }
}

const addDrawingMutation = gql`
  mutation addDrawing($name: String!) {
    addDrawing(name: $name) {
      id
      name
    }
  }
`;

const AddDrawingWithMutation = graphql(addDrawingMutation)(AddDrawing);

export default AddDrawingWithMutation;
