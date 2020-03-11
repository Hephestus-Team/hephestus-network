import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import { Input, Label, ErrorField } from './styles';

const InputForm = ({ name, labelText, ...rest }) => {
  const inputRef = useRef(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);
  
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <>
      <Label> {labelText} </Label>
      { error ? <Input ref={inputRef} defaultValue={defaultValue} {...rest} error /> : <Input ref={inputRef} defaultValue={defaultValue} {...rest} /> }  
      { error && <ErrorField>{error}</ErrorField> }   
    </>
  );
}

export default InputForm;