import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import createEncryptor from 'redux-persist-transform-encrypt';

import rootReducer from './reducers';

/* const encryptor = createEncryptor({
  secretKey: 'hephestus-network',
  onError(error) {
    console.log(error);
  },
}); */

const persistConfig = {
  key: 'hephestus-network',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
