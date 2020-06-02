/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
import React, { useEffect, useRef } from 'react';
import autosize from 'autosize';

import { TextareaContainer } from './styles';

const AutoSizeTextarea = (props) => {
  const textareaRef = useRef();

  useEffect(() => {
    autosize(textareaRef.current);
  }, []);

  return (
    <TextareaContainer
      {...props}
      ref={textareaRef}
      rows={1}
    />
  );
};

export default AutoSizeTextarea;
