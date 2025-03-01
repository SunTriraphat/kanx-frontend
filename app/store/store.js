// store/store.js
"use client";

import { configureStore } from "@reduxjs/toolkit";
import insuranceSlice from "./slice/insuranceSlice";
import showDataReducer from "./slice/showDataSlice";
import loginSlice from "./slice/loginSlice";

export const store = configureStore({
  reducer: {
    insurance: insuranceSlice,
    showData: showDataReducer,
    user: loginSlice,
  },
});
