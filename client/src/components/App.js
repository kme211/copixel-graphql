import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import DrawingsListWithData from "./DrawingsListWithData";
import AddDrawing from "./AddDrawing";
import NotFound from "./NotFound";
import DrawingDetails from "./DrawingDetails";
import CreateUser from "./CreateUser";
import Inner from "./Inner";
import Header from "./Header";
import { gql, graphql } from "react-apollo";
import LoadingSpinner from "./LoadingSpinner";
import { isTokenExpired } from "../utils/jwtHelper";

const Wrapper = styled.div`
  font-family: sans-serif;
  font-size: 16px;
  *,
  & {
    box-sizing: border-box;
  }

  .mono {
    font-family: 'VT323', monospace;
    font-size: 1.25rem;
  }
`;

class App extends Component {
  logout = () => {
    window.localStorage.removeItem("auth0IdToken");
    window.location.reload();
  };
  isLoggedIn = () => {
    const token = window.localStorage.getItem("auth0IdToken");
    if (token && isTokenExpired(token)) return this.logout();
    return !!this.props.data.user;
  };

  refetchUser = () => {
    return this.props.data.refetch();
  };

  render() {
    return (
      <BrowserRouter>
        <Wrapper>
          <Header
            loading={this.props.data.loading}
            isLoggedIn={this.isLoggedIn}
            logout={this.logout}
            refetchUser={this.refetchUser}
          />
          <Inner>
            {this.props.data.loading && <LoadingSpinner />}
            {!this.props.data.loading &&
              <Switch>
                <Route exact path="/" component={DrawingsListWithData} />
                <Route
                  exact
                  path="/signup"
                  render={props => (
                    <CreateUser {...props} user={this.props.data.user} />
                  )}
                />
                <Route
                  path="/add"
                  render={props => (
                    <AddDrawing {...props} user={this.props.data.user} />
                  )}
                />
                <Route
                  path="/drawing/:drawingId"
                  render={props => (
                    <DrawingDetails {...props} user={this.props.data.user} />
                  )}
                />
                <Route component={NotFound} />
              </Switch>}

          </Inner>
        </Wrapper>
      </BrowserRouter>
    );
  }
}

export const userQuery = gql`
  query userQuery {
    user {
      _id
      username
    }
  }
`;

const AppWithData = graphql(userQuery)(App);

export default AppWithData;
