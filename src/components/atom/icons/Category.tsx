import React from "react";

const CategoryIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M22 1H2C1.44772 1 1 1.44772 1 2V22C1 22.5523 1.44772 23 2 23H22C22.5523 23 23 22.5523 23 22V2C23 1.44772 22.5523 1 22 1Z"
        stroke="#5113A1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 8H8V16H16V8Z"
        stroke="#5113A1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CategoryIcon;
