import { configureStore } from '@reduxjs/toolkit'
import adminTask from './counter/adminTask'
import memberCounter from './counter/memberCounter'

const persistedState = localStorage.getItem('reduxState')
  ? JSON.parse(localStorage.getItem('reduxState'))
  : {};

const rootReducer = {
  adminTask: adminTask,
  memberCounter: memberCounter,
};

// Create the store
const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState, // Load persisted state
});

// Subscribe to store updates and persist state to Local Storage
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('reduxState', JSON.stringify(state));
});

export default store;