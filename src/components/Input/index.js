import React from 'react';
import { InputStyle, Label, ErrorField } from './styles';

const Input = ({ labelText, error, ...rest }) => (
  <>
    <Label>
      {labelText}
    </Label>
    { error
      ? <InputStyle error {...rest} />
      : <InputStyle {...rest} /> }
    { error && <ErrorField>{error}</ErrorField> }
  </>
);

export default Input;
