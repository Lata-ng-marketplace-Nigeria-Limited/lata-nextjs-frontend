
import React from "react";

export const CaretDownIcon = (
    props: React.SVGProps<SVGSVGElement> & {
    pathClass?: string;
  }
) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_187_1304)">
      <path
        d="M13 6L8 11L3 6"
        stroke="#ABABAB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_187_1304">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
