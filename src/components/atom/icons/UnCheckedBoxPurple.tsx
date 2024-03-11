import React from "react";

const UnCheckedBoxPurple = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      {...props}
    >
      <rect
        x="1.5"
        y="1"
        width="22"
        height="22"
        rx="2"
        stroke="#5113A1"
        strokeWidth="2"
      />
    </svg>
  );
};

export default UnCheckedBoxPurple;
