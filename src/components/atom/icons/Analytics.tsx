import React from "react";

const AnalyticsIcon = (
  props: React.SVGProps<SVGSVGElement> & { pathClass?: string }
) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2887_19010)">
        <path
          d="M6 4H13.5"
          stroke="#292929"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 8H13.5"
          stroke="#292929"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 12H13.5"
          stroke="#292929"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 4H3.5"
          stroke="#292929"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 8H3.5"
          stroke="#292929"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 12H3.5"
          stroke="#292929"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2887_19010">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default AnalyticsIcon;
