import React from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect } from "react-router-dom";
import { graphql, gql } from "react-apollo";
import Button from "./Button";
import Input from "./Input";
import Inner from "./Inner";

class CreateUser extends React.Component {
  static propTypes = {
    createUser: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };

  state = {
    email: "",
    username: ""
  };

  onFormChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  createUser = async () => {
    // TODO: Add validation
    const variables = {
      email: this.state.email,
      username: this.state.username
    };

    try {
      await this.props.createUserMutation({ variables });
      this.props.history.replace("/");
    } catch (e) {
      console.error(e);
      this.props.history.replace("/");
    }
  };

  render() {
    // redirect if user is logged in or did not finish Auth0 Lock dialog
    if (
      this.props.user ||
      window.localStorage.getItem("auth0IdToken") === null
    ) {
      console.warn("not a new user or already logged in");
      return (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      );
    }

    return (
      <Inner>
        <Input
          type="email"
          value={this.state.email}
          placeholder="Email"
          id="email"
          label="Email"
          onChange={this.onFormChange}
        />
        <Input
          type="text"
          value={this.state.username}
          placeholder="Username"
          id="username"
          label="Username"
          onChange={this.onFormChange}
        />

        {this.state.username &&
          this.state.email &&
          <Button onClick={this.createUser}>Sign up</Button>}
      </Inner>
    );
  }
}

const createUser = gql`
  mutation ($username: String!, $email: String!){
    createUser(username: $username, email: $email) {
      _id
      username
    }
  }
`;

export default graphql(createUser, {
    name: "createUser"
  })(withRouter(CreateUser));
