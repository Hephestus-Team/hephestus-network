import React from 'react';

const PersistContext = React.createContext();

export const PersistProvider = PersistContext.Provider;
export const PersistConsumer = PersistContext.Consumer;

export default PersistContext;
