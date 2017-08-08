import React from "react";
import styled from "styled-components";
import Label from "./Label";

const Wrapper = styled.div`
  {props => props.margin ? '0 0 16px 0': margin}
  width: 100%;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  &:not([type="color"]) {
    padding: 6px;
  }
  &[type="radio"] {
    display: inline-block;
  }
`;

const ValidationError = styled.div`
  font-size: 0.75em;
  color: tomato;
`;

const TextInput = ({ type, label, id, name, margin, error, ...props }) => (
  <Wrapper margin={margin}>
    {label && <Label htmlFor={id}>{label}</Label>}
    <Input type={type} id={id} name={name || id} {...props} />
    {error && <ValidationError>{error}</ValidationError>}
  </Wrapper>
);

export default TextInput;
