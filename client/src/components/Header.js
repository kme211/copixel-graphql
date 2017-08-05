import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import Inner from "./Inner";

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
  box-shadow: 0px 2px 5px 0px rgba(50, 50, 50, 0.25);
  font-family: 'VT323', monospace;
  font-size: 2rem;
`;

const Header = () => (
  <Wrapper>
    <Inner>
      <Nav>
        <HomeLink to="/">copixel</HomeLink>
        <StyledNavLink to="/add" activeStyle={activeStyle}>add</StyledNavLink>
      </Nav>
    </Inner>
  </Wrapper>
)

export default Header;