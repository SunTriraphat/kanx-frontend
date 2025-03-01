"use client";
import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  showData: [
    // {
    //   brand: "",
    //   model: "",
    //   dealer_code: "",
    //   account: "",
    //   vin: "",
    //   stock: "",
    //   date_recieved: "",
    //   date_accounted_sent: "",
    //   date_accounted: "",
    //   status: "",
    //   price: "",
    //   billing: "",
    //   date_payment: "",
    //   document: "",
    // },
  ],
};

const showDataSlice = createSlice({
  name: "showData",
  initialState,
  reducers: {
    addShowData: (state, action) => {
      state.showData = action.payload;
      console.log('action.payload',action.payload);
      
      console.log("Redux", current(state));
    },
    appendShowData: (state, action) => {
      state.showData.push(action.payload);
      console.log('append');
      
    },
  },
});

export const { addShowData, appendShowData } = showDataSlice.actions;
export default showDataSlice.reducer;
