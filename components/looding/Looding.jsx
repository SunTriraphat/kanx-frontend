import React from "react";
import style from "./Looding.module.css";

function Looding({ title, subtitle }) {
  return (
    <>
      <p className="text-gray-700 text-lg font-semibold text-center">{title}</p>
      <p className="text-gray-500 text-sm text-center">{subtitle}</p>
      <div className="flex flex-row justify-center items-end space-x-4 space-y-3">
        <div className={`circle animate-circle delay0`} />
        <div className={`circle animate-circle delay1`} />
        <div className={`circle animate-circle delay2`} />
        <div className={`circle animate-circle delay3}`} />
      </div>
    </>
  );
}

export default Looding;
