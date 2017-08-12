import React from "react";
import styled, { css } from "styled-components";
import Icon from "./Icon";

const Wrapper = styled.div`
  position: relative;
  margin: 1rem 0;
`;

const Input = styled.input`display: none;`;

const labelStyles = ({ side, active }) => css`
  cursor: pointer;
  color: ${active ? "white" : "#ccc"};
  width: 60px;
  line-height: 50px;
  transition: all 0.2s ease;
  order: ${side === "left" ? 0 : 3};
`;

const Label = styled.label`${labelStyles};`;

const Switch = styled.div`
  display: flex;
  align-items: center;
  width: 150px;
  height: 50px;
  text-align: center;
  background: #222;
  transition: all 0.2s ease;
`;

const StyledIcon = styled(Icon)`
  order: 2;
`;

const Toggle = ({
  name,
  value1,
  value2,
  label1,
  label2,
  icon1,
  icon2,
  checkedItem,
  onChange
}) =>
  <Wrapper>
    <Input
      onChange={onChange}
      type="radio"
      name={name}
      id={value1}
      value={value1}
      checked={checkedItem === value1}
    />
    <Input
      onChange={onChange}
      type="radio"
      name={name}
      id={value2}
      value={value2}
      checked={checkedItem === value2}
    />
    <Switch>
      <Label side="left" htmlFor={value1} active={checkedItem === value1}>
        {label1}
      </Label>
      <Label side="right" htmlFor={value2} active={checkedItem === value2}>
        {label2}
      </Label>
      <StyledIcon
        icon={checkedItem === value1 ? icon1 : icon2}
        color="white"
        size={20}
      />
    </Switch>
  </Wrapper>;

export default Toggle;
