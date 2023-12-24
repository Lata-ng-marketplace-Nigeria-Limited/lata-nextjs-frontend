import React from "react";

export const MapPinIcon = ({
  pathClass,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  pathClass?: string;
}) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_2064_9317)">
      <path
        d="M7.5 7.96875C8.53553 7.96875 9.375 7.12928 9.375 6.09375C9.375 5.05822 8.53553 4.21875 7.5 4.21875C6.46447 4.21875 5.625 5.05822 5.625 6.09375C5.625 7.12928 6.46447 7.96875 7.5 7.96875Z"
        stroke="#464646"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pathClass}
      />
      <path
        d="M12.1875 6.09375C12.1875 10.3125 7.5 13.5938 7.5 13.5938C7.5 13.5938 2.8125 10.3125 2.8125 6.09375C2.8125 4.85055 3.30636 3.65826 4.18544 2.77919C5.06451 1.90011 6.2568 1.40625 7.5 1.40625C8.7432 1.40625 9.93549 1.90011 10.8146 2.77919C11.6936 3.65826 12.1875 4.85055 12.1875 6.09375Z"
        stroke="#464646"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_2064_9317">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
