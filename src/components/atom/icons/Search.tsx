import React from "react";

export const SearchIcon = ({
  pathClass,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  pathClass?: string;
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1690_9790)">
      <path
        d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pathClass}
      />
      <path
        d="M10.5352 10.5352L13.9995 13.9995"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_1690_9790">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
