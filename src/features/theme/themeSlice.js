import { createSlice } from "@reduxjs/toolkit";

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
