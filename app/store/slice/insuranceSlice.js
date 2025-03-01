"use client";
import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  insurance: [
    {
      brand: "",
      model: "",
      dealer_code: "",
      account: "",
      vin: "",
      stock: "",
      date_recieved: "",
      date_accounted_sent: "",
      date_accounted: "",
      status: "",
      price: "",
      billing: "",
      date_payment: "",
      document: "",
    },
  ],
};

const insuranceSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    addInsurance: (state, action) => {
      state.insurance = action.payload;
      console.log("ReduxInsu", current(state)); // Debugging
    },
    appendInsurance: (state, action) => {
      state.insurance.push(action.payload);
    },
  },
});

export const { addInsurance, appendInsurance } = insuranceSlice.actions;
export default insuranceSlice.reducer;
