import React, { Component } from "react";
import Auth0Lock from "auth0-lock";
import { withRouter } from "react-router-dom";

class LoginButton extends Component {
  constructor(props) {
    super(props);

    this._lock = new Auth0Lock(
      process.env.REACT_APP_CLIENT_ID,
      process.env.REACT_APP_AUTH_DOMAIN,
      {
        auth: {
          redirectUrl: "http://localhost:7777/callback",
          responseType: "token"
        }
      }
    );
  }

  componentDidMount() {
    this._lock.on("authenticated", async authResult => {
      window.localStorage.setItem("auth0IdToken", authResult.idToken);
      window.localStorage.setItem("auth0AccessToken", authResult.accessToken);
      const { data: { user } } = await this.props.refetchUser();
      if (user)
        this.props.history.push(window.localStorage.getItem("loggedInFrom"));
      else this.props.history.push(`/signup`);
    });
  }

  _showLogin = () => {
    window.localStorage.setItem("loggedInFrom", window.location.pathname);
    this._lock.show();
  };

  render() {
    return (
      <button onClick={this._showLogin} className={this.props.className}>
        log in
      </button>
    );
  }
}

export default withRouter(LoginButton);
