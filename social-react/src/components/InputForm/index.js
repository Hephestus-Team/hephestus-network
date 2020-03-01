import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';
import ReactTooltip from 'react-tooltip';
import { Input, Label } from './styles';

const InputForm = ({ name, labelText, ...rest }) => {
    const inputRef = useRef(null);
    let tooltip = useRef(null);

    const { fieldName, defaultValue, registerField, error } = useField(name);
  
    useEffect(() => {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: 'value',
      });
    }, [fieldName, registerField]);

    useEffect(() => {
        if(error) {
            ReactTooltip.show(tooltip); 
            setTimeout(() => {
              ReactTooltip.hide(tooltip);
            }, 4000);
        }
    });

    return (
      <>
        <Label> {labelText} </Label>
        <p ref={ref => tooltip = ref} data-tip={error}></p>
        <ReactTooltip type='error' place="top"/>
        <Input ref={inputRef} defaultValue={defaultValue} {...rest} />
      </>
    );
}

export default InputForm;