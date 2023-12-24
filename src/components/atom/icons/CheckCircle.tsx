
import React from "react";

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="5" cy="5" r="4.5" stroke="#5113A1" />
    <g clipPath="url(#clip0_2101_25286)">
      <path
        d="M3.625 5.25L4.5 6.125L6.5 4.125"
        stroke="#5113A1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2101_25286">
        <rect width="4" height="4" fill="white" transform="translate(3 3)" />
      </clipPath>
    </defs>
  </svg>
);
