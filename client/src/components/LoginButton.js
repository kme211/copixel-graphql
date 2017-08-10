import React, { Component } from "react";
import Auth0Lock from "auth0-lock";
import { withRouter } from "react-router-dom";

class LoginButton extends Component {
  constructor(props) {
    super(props);

    this._lock = new Auth0Lock(process.env.REACT_APP_CLIENT_ID, process.env.REACT_APP_AUTH_DOMAIN);
  }

  componentDidMount() {
    this._lock.on("authenticated", authResult => {
      console.log("authenticated", authResult);
      window.localStorage.setItem("auth0IdToken", authResult.idToken);
      this.props.history.push(`/signup`);
    });
  }

  _showLogin = () => {
    this._lock.show();
  };

  render() {
    return (
      <div>
        <span onClick={this._showLogin}>
          Log in with Auth0
        </span>
      </div>
    );
  }
}

export default withRouter(LoginButton);
