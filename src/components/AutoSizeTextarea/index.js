/* eslint-disable no-param-reassign */
import React from 'react';

const AutoSizeTextarea = ({ placeholder, value, onChange }) => {
  const autosize = (element) => {
    element.style.height = 'inherit';

    const computed = window.getComputedStyle(element);

    const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
      + parseInt(computed.getPropertyValue('padding-top'), 10)
      + element.scrollHeight
      + parseInt(computed.getPropertyValue('padding-bottom'), 10)
      + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    element.style.height = `${height}px`;
  };

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onInput={(e) => autosize(e.target)}
    />
  );
};

export default AutoSizeTextarea;
