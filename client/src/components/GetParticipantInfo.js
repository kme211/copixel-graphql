import React, { Component } from "react";
import styled from "styled-components";
import Input from "./Input";
import SubmitButton from "./SubmitButton";

const Cover = styled.div`
  position: fixed;
  top: 0; 
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
`;

const Body = styled.div`
  background: white;
  padding: 1em;
`;

const Header = styled.h2`
  font-size: 2em;
  margin: 0;
`;

class GetParticipantInfo extends Component {
  state = {
    name: "",
    validationErrors: {}
  };

  onFormChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateForm = () => {
    const { name } = this.state;
    const validationErrors = {};
    if (!name) validationErrors.name = "You must supply a name.";
    this.setState({ validationErrors });
  };

  onSubmitForm = () => {
    const { name } = this.state;
    this.props.saveParticipant({ name });
  }

  render() {
    const {
      validationErrors,
      name
    } = this.state;
    return (
      <Cover>
        <Body>
          <Header>Hi! Just need some info.</Header>
          <Input
            type="text"
            id="name"
            label="Name*"
            value={name}
            onChange={this.onFormChange}
            error={validationErrors.name}
            placeholder="Your name"/>
            <SubmitButton value="Save my info!" onClick={this.onSubmitForm} />
        </Body>
      </Cover>
    );
  }
}
export default GetParticipantInfo;
