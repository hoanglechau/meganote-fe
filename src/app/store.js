import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "../features/notes/notesSlice";
import themeReducer from "../features/theme/themeSlice";
import usersReducer from "../features/users/usersSlice";

/**
 * @description This file is used to create a redux store for the whole app
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */

export const store = configureStore({
  // Configure the reducer, making it available to the whole app with the Provider in main.js
  reducer: {
    theme: themeReducer,
    users: usersReducer,
    notes: notesReducer,
  },
  // Disable Redux DevTools Extension
  devTools: false,
});
