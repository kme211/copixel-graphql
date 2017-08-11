import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import Inner from "./Inner";
import LoginButton from "./LoginButton";

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const activeStyle = {
  color: "white"
};

const Wrapper = styled.div`
  background: white;
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  background-color: #222;
  font-family: 'VT323', monospace;
  font-size: 2rem;
  color: #FC8A15;

  a,
  button {
    display: inline-block;
    text-decoration: none;
    outline: none;
    border: none;
    font-size: inherit;
    font-family: inherit;
    background: transparent;
    color: inherit;
    margin-right: 1rem;
    cursor: pointer;
    transition: color 0.4s;
  }

  a:hover, button:hover {
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
          {props.isLoggedIn() &&
            <NavLink to="/add" activeStyle={activeStyle}>
              add
            </NavLink>}
          {!props.isLoggedIn() &&
            !props.loading &&
            <LoginButton refetchUser={props.refetchUser} />}
          {props.isLoggedIn() && <button onClick={props.logout}>logout</button>}
        </div>
      </Nav>
    </Inner>
  </Wrapper>
);

Header.propTypes = {
  isLoggedIn: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default Header;
