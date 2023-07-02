import { createSlice } from "@reduxjs/toolkit";

/**
 * @description This file is used to create a redux slice for theme feature, including actions and reducers
 */

const initialState = {
  theme: "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      return {
        theme: state.theme === "light" ? "dark" : "light",
      };
    },
  },
});

// Export the actions from the reducer
export const { toggleTheme } = themeSlice.actions;

// Export the reducer
export default themeSlice.reducer;
