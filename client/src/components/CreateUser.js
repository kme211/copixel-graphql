import React from "react";
import { withRouter, Redirect } from "react-router-dom";
import { graphql, gql } from "react-apollo";
import Button from "./Button";
import Input from "./Input";

class CreateUser extends React.Component {
  static propTypes = {
    createUser: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired
  };

  state = {
    email: "",
    username: ""
  };

  onFormChange = e => {
    this.setState({
      [e.target.name]: value
    });
  };

  createUser = async () => {
    // TODO: Add validation
    const variables = {
      email: this.state.email,
      name: this.state.name
    };

    try {
      const response = await this.props.createUser({ variables });
      this.props.history.replace("/");
    } catch (e) {
      console.error(e);
      this.props.history.replace("/");
    }
  };

  render() {
    if (this.props.data.loading) {
      return <div>Loading</div>;
    }

    // redirect if user is logged in or did not finish Auth0 Lock dialog
    if (
      this.props.data.user ||
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
      <div>
        <div style={{ maxWidth: 400 }}>
          <Input
            value={this.state.email}
            placeholder="Email"
            id="Email"
            onChange={this.onFormChange}
          />
          <Input
            value={this.state.name}
            placeholder="Username"
            id="username"
            onChange={this.onFormChange}
          />

          {this.state.name &&
            <button onClick={this.createUser}>Sign up</button>}
        </div>
      </div>
    );
  }
}

const createUser = gql`
  mutation ($username: String!, $email: String!){
    createUser(authProvider: {auth0: {idToken: $idToken}}, name: $name, emailAddress: $emailAddress, emailSubscription: $emailSubscription) {
      id
    }
  }
`;

const userQuery = gql`
  query {
    user {
      id
    }
  }
`;

export default graphql(createUser, { name: "createUser" })(
  graphql(userQuery)(withRouter(CreateUser))
);
