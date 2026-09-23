import React from "react";

export const Logo = ({ size = 28, className = "" }) => {
  return (
    <img
      src="/favicon.svg"
      alt="Logo"
      width={size}
      height={size}
      className={`rounded-md shrink-0 object-contain ${className}`}
    />
  );
};
