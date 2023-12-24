
import React from "react";

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_719_6707)">
      <path
        d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
        stroke="#ABABAB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 4.5V8H11.5"
        stroke="#ABABAB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_719_6707">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
