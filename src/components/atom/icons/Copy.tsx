
import React from "react";

export const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_662_7984)">
      <path
        d="M17.25 6.75H3.75V20.25H17.25V6.75Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 3.75H20.25V17.25"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_662_7984">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
