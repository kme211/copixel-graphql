import React from "react";
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
    color: #FC8A15;
    display: block;
    transition: all 0.4s;
    border: 1px solid transparent;
`;

const HomeLink = styled(Link)`
    text-decoration: none;
    color: #FC8A15;
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
`;

const clientId = process.env.CLIENT_ID;
const domain = process.env.DOMAIN;

const Header = (props) => (
  <Wrapper>
    <Inner>
      <Nav>
        <HomeLink to="/">copixel</HomeLink>
        {!props.isLoggedIn && <LoginButton clientId={clientId} domain={domain}  />}
        {props.isLoggedIn && <StyledNavLink to="/add" activeStyle={activeStyle}>add</StyledNavLink>}
      </Nav>
    </Inner>
  </Wrapper>
)

export default Header;