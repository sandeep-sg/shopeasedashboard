import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isThemeDark: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isThemeDark = !state.isThemeDark;
      localStorage.setItem("theme", state.isThemeDark ? "dark" : "light");
    },
    setTheme: (state, action) => {
      state.isThemeDark = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleTheme,setTheme } = themeSlice.actions;

export default themeSlice.reducer;
