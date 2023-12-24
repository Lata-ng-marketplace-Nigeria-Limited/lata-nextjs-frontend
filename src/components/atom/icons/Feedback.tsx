import React from "react";


export const FeedbackIcon = (props: React.SVGProps<SVGSVGElement> & { pathClass?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1705_10511)">
      <path
        d="M11 6.5V8.5H5"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M6.5 7L5 8.5L6.5 10"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M13.5 3H2.5C2.22386 3 2 3.22386 2 3.5V12.5C2 12.7761 2.22386 13 2.5 13H13.5C13.7761 13 14 12.7761 14 12.5V3.5C14 3.22386 13.7761 3 13.5 3Z"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_1705_10511">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
