import React from "react";

const SellersIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="#F5F5F5" />
      <path
        d="M9.1638 15.8838C9.05898 15.7788 9.00007 15.6366 9 15.4883V9H15.4883C15.6366 9.00007 15.7788 9.05898 15.8838 9.1638L22.8361 16.1162C22.9411 16.2212 23 16.3635 23 16.512C23 16.6605 22.9411 16.8028 22.8361 16.9078L16.9099 22.8361C16.8049 22.9411 16.6626 23 16.5141 23C16.3656 23 16.2233 22.9411 16.1183 22.8361L9.1638 15.8838Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.08 12.78C12.4666 12.78 12.78 12.4666 12.78 12.08C12.78 11.6934 12.4666 11.38 12.08 11.38C11.6934 11.38 11.38 11.6934 11.38 12.08C11.38 12.4666 11.6934 12.78 12.08 12.78Z"
        fill="black"
      />
    </svg>
  );
};

export default SellersIcon;
