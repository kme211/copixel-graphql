import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import Inner from "./Inner";
import LoginButton from "./LoginButton";
import DropdownButton from "./DropdownButton";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const activeStyle = {
  color: "#9ED0E0"
};

const Wrapper = styled.div`
  background: white;
  width: 100%;
  height: 3rem;
  line-height: 1rem;
  background-color: #222;
  font-size: 1rem;
  color: #eee;

  a,
  button {
    display: inline-block;
    text-decoration: none;
    outline: none;
    border: none;
    font-size: inherit;
    font-family: inherit;
    background: transparent;
    color: white;
    margin-right: 1rem;
    cursor: pointer;
    transition: color 0.4s;
  }

  a:hover,
  button:hover {
    color: white;
  }

  a:last-child,
  button:last-child {
    margin-right: 0;
  }
`;

const Header = props => (
  <Wrapper>
    <Inner>
      <Nav>
        <Link to="/">copixel</Link>

        <div>
          <NavLink to="/gallery" activeStyle={activeStyle}>gallery</NavLink>
          {props.isLoggedIn() &&
            <NavLink to="/new" activeStyle={activeStyle}>
              new
            </NavLink>}
          {props.isLoggedIn() &&
            <NavLink to="/draw" activeStyle={activeStyle}>
              draw
            </NavLink>}
          {!props.isLoggedIn() &&
            !props.loading &&
            <LoginButton refetchUser={props.refetchUser} />}
          {props.isLoggedIn() &&
            <DropdownButton label={props.user.username}>
              <Link to="/account/drawings">my drawings</Link>
              <button onClick={props.logout}>logout</button>
            </DropdownButton>}
        </div>
      </Nav>
    </Inner>
  </Wrapper>
);

Header.propTypes = {
  user: PropTypes.object,
  isLoggedIn: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default Header;
