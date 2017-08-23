import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import Inner from "./Inner";
import LoginButton from "./LoginButton";
import DropdownButton from "./DropdownButton";

const StyledInner = styled(Inner)`
  padding: 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const activeStyle = {
  color: "#9ED0E0",
  background: "#333"
};

const Wrapper = styled.div`
  background: white;
  width: 100%;
  height: 3rem;
  line-height: 1rem;
  background-color: #222;
  font-size: 1rem;
  color: #eee;

  & a, .menu-item {
    padding: 1rem;
    line-height: 1;
    display: block;
    text-decoration: none;
    outline: none;
    border: none;
    font-size: inherit;
    font-family: inherit;
    background: transparent;
    color: white;
    cursor: pointer;
    transition: color 0.4s;
  }

  & a:hover, .menu-item:hover {
    background: #333;
  }

  & .menu > .items {
    display: none;
  }

  & .menu.isOpen > .items {
    display: block;
    position: absolute;
    top: 3rem;
    background: #2b2b2b;
    width: 100%;
    left: 0;

    & .menu-item {
      padding: 0.5rem 1rem;
    }
  }

  @media (min-width: 360px) {
    & .menu-btn {
      display: none;
    }
    & .items {
      display: block !important;
    }
    & .menu .menu-item {
      display: inline-block;
    }
  }
`;

class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    isLoggedIn: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  };

  state = {
    menuVisible: false
  };

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
  }

  onWindowResize = () => {
    if (!this.state.menuVisible) return;
    if (window.innerWidth > 360) this.setState({ menuVisible: false });
  };

  toggleMenuVisibility = () => {
    this.setState(prevState => ({ menuVisible: !prevState.menuVisible }));
  };

  render() {
    const isLoggedIn = this.props.isLoggedIn();
    const menuClassName = `menu  ${this.state.menuVisible && "isOpen"}`;
    return (
      <Wrapper>
        <StyledInner>
          <Nav>
            <Link to="/">copixel</Link>

            <div className={menuClassName}>
              <div className="menu-btn" onClick={this.toggleMenuVisibility}>
                menu
              </div>
              <div className="items">
                <NavLink
                  className="menu-item"
                  to="/gallery"
                  activeStyle={activeStyle}
                >
                  gallery
                </NavLink>
                {isLoggedIn &&
                  <NavLink
                    className="menu-item"
                    to="/new"
                    activeStyle={activeStyle}
                  >
                    new
                  </NavLink>}
                {isLoggedIn &&
                  <NavLink
                    className="menu-item"
                    to="/draw"
                    activeStyle={activeStyle}
                  >
                    draw
                  </NavLink>}
                {!isLoggedIn &&
                  !this.props.loading &&
                  <LoginButton
                    className="menu-item"
                    refetchUser={this.props.refetchUser}
                  />}
                {isLoggedIn &&
                  <DropdownButton
                    className="menu-item"
                    label={this.props.user.username}
                  >
                    <NavLink
                      to="/account/drawings"
                      className="menu-item"
                      activeStyle={activeStyle}
                    >
                      my drawings
                    </NavLink>
                    <button onClick={this.props.logout} className="menu-item">
                      logout
                    </button>
                  </DropdownButton>}
              </div>
            </div>
          </Nav>
        </StyledInner>
      </Wrapper>
    );
  }
}

export default Header;
