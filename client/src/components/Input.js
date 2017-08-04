import React from "react";
import styled from "styled-components";
import Label from "./Label";

const Wrapper = styled.div`
  margin-bottom: 16px;
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


const TextInput = ({ type, label, id, name, error, ...props }) => (
  <Wrapper>
    {label && <Label htmlFor={id}>{label}</Label>}
    <Input type={type} id={id} name={name || id} {...props} />
    {error && <ValidationError>{error}</ValidationError>}
  </Wrapper>
);

export default TextInput;