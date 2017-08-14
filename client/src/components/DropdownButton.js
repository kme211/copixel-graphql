import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Icon from "./Icon";

const Wrapper = styled.div`
  position: relative;
  display: inline-block;

  .icon {
    transform: rotate(180deg);
  }
`;

const Children = styled.ul`
  position: absolute;
  z-index: 10;
  right: 0;
  top: 2.5rem;
  width: 150px;
  list-style-type: none;
  background-color: #ccc;
  color: #222;
  visibility: hidden;
  transform: scale(0.1);
  transition: transform 0.25s cubic-bezier(0.2, 2, 1, 1);
  text-align: left;
  & > li > * {
    text-align: inherit;
    width: 100%;
    padding: 0.5rem 1rem;
    cursor: pointer;
    &:hover {
      background-color: #222;
      color: white;
    }
  }
  &.open {
    visibility: visible;
    transform: scale(1);
  }
`;

class DropdownButton extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired
  };

  state = {
    open: false
  };

  toggleOpen = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  render() {
    return (
      <Wrapper>
        <button onClick={this.toggleOpen}>
          {this.props.label}
          <Icon icon="up-arrow" className="icon" />
        </button>
        <Children className={this.state.open ? "open" : "closed"}>
          {this.props.children.map((child, i) =>
            <li key={`dropdown-${this.props.label}-${i}`} onClick={this.toggleOpen}>
              {child}
            </li>
          )}
        </Children>
      </Wrapper>
    );
  }
}

export default DropdownButton;
