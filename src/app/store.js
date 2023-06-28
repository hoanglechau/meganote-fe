import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import notesReducer from "../features/notes/notesSlice";
import themeReducer from "../features/theme/themeSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  // Configure the reducer, making it available to the whole app with the Provider in main.js
  reducer: {
    theme: themeReducer,
    users: usersReducer,
    notes: notesReducer,
  },
  // Redux DevTools Extension
  devTools: false,
});

setupListeners(store.dispatch);
