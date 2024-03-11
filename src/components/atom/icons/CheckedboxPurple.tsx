import React from "react";

const CheckedboxPurple = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}

    >
      <rect
        x="1.5"
        y="1"
        width="22"
        height="22"
        rx="2"
        fill="#5113A1"
        stroke="#5113A1"
        strokeWidth="2"
      />
      <path
        d="M6.5 12.8571L10.1522 15.8571L18.5 9"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckedboxPurple;
