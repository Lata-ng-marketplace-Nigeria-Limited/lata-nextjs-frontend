import React from "react";

export const SavedIcon = ({
  pathClass,
  ...props
}: React.SVGProps<SVGSVGElement> & { pathClass?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1705_10472)">
      <path
        d="M12 14L8 11.5L4 14V3C4 2.86739 4.05268 2.74021 4.14645 2.64645C4.24021 2.55268 4.36739 2.5 4.5 2.5H11.5C11.6326 2.5 11.7598 2.55268 11.8536 2.64645C11.9473 2.74021 12 2.86739 12 3V14Z"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pathClass}
      />
      <path
        d="M12 11L7.99937 8.5L4 11"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_1705_10472">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
