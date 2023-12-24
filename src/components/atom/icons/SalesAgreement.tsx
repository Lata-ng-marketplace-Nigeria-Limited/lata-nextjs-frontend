
import React from "react";

export const SalesAgreementIcon = (
    props: React.SVGProps<SVGSVGElement> & { pathClass?: string }
) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1705_10557)">
      <path
        d="M2 3.5H14V12C14 12.1326 13.9473 12.2598 13.8536 12.3536C13.7598 12.4473 13.6326 12.5 13.5 12.5H2.5C2.36739 12.5 2.24021 12.4473 2.14645 12.3536C2.05268 12.2598 2 12.1326 2 12V3.5Z"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M2 6.5H14"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M2 9.5H14"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M5.5 6.5V12.5"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_1705_10557">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
