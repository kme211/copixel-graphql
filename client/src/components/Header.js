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

const StyledNavLink = styled(NavLink)`
    text-decoration: none;
    display: block;
    transition: all 0.4s;
    border: 1px solid transparent;
    color: inherit;
`;

const HomeLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const activeStyle = {
  border: "1px solid #FC8A15",
  background: "#FC8A15",
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
`;

const Header = props => (
  <Wrapper>
    <Inner>
      <Nav>
        <HomeLink to="/">copixel</HomeLink>
        {!props.isLoggedIn() &&
          <LoginButton/>}
        {props.isLoggedIn() && <button onClick={props.logout}>Logout</button>}
        {props.isLoggedIn() &&
          <StyledNavLink to="/add" activeStyle={activeStyle}>
            add
          </StyledNavLink>}
      </Nav>
    </Inner>
  </Wrapper>
);

Header.propTypes = {
  isLoggedIn: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default Header;
