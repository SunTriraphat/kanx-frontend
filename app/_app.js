"use client";

import { useEffect } from "react";
import ProviderWrapper from "../app/store/providerWrapper";
import "../styles/globals.css";
import { addUser,addPermission } from "./store/slice/loginSlice";
function MyApp({ Component, pageProps }) {  

  return (
    <ProviderWrapper>
      <Component {...pageProps} />
    </ProviderWrapper>

  );
}

export default MyApp;