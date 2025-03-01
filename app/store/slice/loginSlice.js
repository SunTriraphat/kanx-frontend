"use client";
import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  user: [],
  userPermission: ''
};

const loginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      console.log("Redux Login", current(state));
    },
    addPermission: (state, action) => {
      state.userPermission = action.payload;
      console.log("permission", current(state));
    },
    logoutUser(state) {
      state.user = null;
    },
  },
});

export const { addUser, logoutUser,addPermission } = loginSlice.actions;
export default loginSlice.reducer;
