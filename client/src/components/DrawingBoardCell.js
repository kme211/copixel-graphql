import React, { Component } from "react";
import styled from "styled-components";
import Icon from "./Icon";

const Cell = styled.div`
  color: white;
  text-align: center;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: ${props => (props.enabled ? "auto" : "none")};
  background: ${props => (props.enabled ? "#1EE494" : props.status === "COMPLETED" ? "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAN0lEQVQYV2OUO9fxnwEbEONlYMQqKcbLwPDqMxZJqATIMFSdSBKokmgSCEksEhDJJ1P/gyzHBgCtrB1QjEDWUQAAAABJRU5ErkJggg==)" : "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAANElEQVQYV2M8cPTsfwY0YGqgwcCILgESPH3hBqoETBBkAFwHsiBcAl0QLPH169f/IDPRAQCA2SN6dYifvwAAAABJRU5ErkJggg==)")};
`;

class DrawingBoardCell extends Component {
  onCellClick = () => {
    console.log("onCellClick");
    const { x, y } = this.props;
    this.props.onCellClick({
      x,
      y
    });
  };
  render() {
    const { status, enabled, size } = this.props;
    let icon = "locked";
    if(status === "COMPLETED") {
      icon = "checkmark";
    } else if(status === "IN_PROGRESS") {
      icon = "in-progress";
    } else if(enabled) {
      icon = "unlocked";
    }
    return (
      <Cell {...this.props} onClick={this.onCellClick}>
        <Icon
          icon={icon}
          size={size / 3}
        />
      </Cell>
    );
  }
}

export default DrawingBoardCell;
