import React from "react";

export const SubscriptionIcon = (
    props: React.SVGProps<SVGSVGElement> & { pathClass?: string }
) => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_1705_10521)">
      <path
        d="M14 4H2C1.72386 4 1.5 4.22386 1.5 4.5V12.5C1.5 12.7761 1.72386 13 2 13H14C14.2761 13 14.5 12.7761 14.5 12.5V4.5C14.5 4.22386 14.2761 4 14 4Z"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M10.5 11H12.5"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M7.5 11H8.5"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M1.5 6.5H14.5"
        stroke="#292929"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_1705_10521">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
);
