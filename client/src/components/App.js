import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import Callback from "./Callback";
import DrawingsListWithData from "./DrawingsListWithData";
import UserDrawings from "./UserDrawings";
import AddDrawing from "./AddDrawing";
import Gallery from "./Gallery";
import NotFound from "./NotFound";
import DrawingDetails from "./DrawingDetails";
import CompleteDrawing from "./CompleteDrawing";
import CreateUser from "./CreateUser";
import Inner from "./Inner";
import Header from "./Header";
import { gql, graphql } from "react-apollo";
import Loader from "./Loader";
import { isTokenExpired } from "../utils/jwtHelper";

const Wrapper = styled.div`
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  height: 100%;
  *,
  & {
    box-sizing: border-box;
  }

  p {
    margin: 0.5rem 0;
  }
`;

const StyledInner = styled(Inner)`
  height: calc(100% - 3rem);
`;

class App extends Component {
  logout = () => {
    console.warn("logout");
    window.localStorage.removeItem("auth0IdToken");
    window.location.reload();
  };
  isLoggedIn = () => {
    const token = window.localStorage.getItem("auth0IdToken");
    if (token && isTokenExpired(token)) {
      console.warn("your token is expired and you will be logged out");
      return this.logout();
    }

    if (!this.props.data.user) {
      console.warn("no user data");
    }
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
            user={this.props.data.user}
            refetchUser={this.refetchUser}
          />
          <StyledInner>
            {this.props.data.loading && <Loader />}
            {!this.props.data.loading &&
              <Switch>
                <Route exact path="/" component={Gallery} />
                <Route exact path="/gallery" component={Gallery} />
                <Route
                  exact
                  path="/draw"
                  render={props => (
                    <DrawingsListWithData
                      {...props}
                      isLoggedIn={this.isLoggedIn}
                    />
                  )}
                />
                <Route
                  exact
                  path="/account/drawings"
                  render={props => (
                    <UserDrawings
                      {...props}
                      isLoggedIn={this.isLoggedIn}
                      user={this.props.data.user}
                    />
                  )}
                />
                <Route exact path="/callback" component={Callback} />
                <Route
                  exact
                  path="/signup"
                  render={props => (
                    <CreateUser
                      {...props}
                      user={this.props.data.user}
                      refetchUser={this.refetchUser}
                    />
                  )}
                />
                <Route
                  path="/new"
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
                <Route
                  path="/canvas/:drawingId" render={props => (
                    <CompleteDrawing {...props} drawingId={props.match.params.drawingId}/>
                  )}/>
                <Route component={NotFound} />
              </Switch>}
          </StyledInner>
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
