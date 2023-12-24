
import React from "react";

export const NotificationBellIcon = (
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
    <g clipPath="url(#clip0_1705_10502)">
      <path
        d="M6 12C6 12.5304 6.21071 13.0391 6.58579 13.4142C6.96086 13.7893 7.46957 14 8 14C8.53043 14 9.03914 13.7893 9.41421 13.4142C9.78929 13.0391 10 12.5304 10 12"
        stroke="#5A5A5A"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M3.49992 6.5C3.49992 5.30653 3.97403 4.16193 4.81794 3.31802C5.66186 2.47411 6.80645 2 7.99992 2C9.1934 2 10.338 2.47411 11.1819 3.31802C12.0258 4.16193 12.4999 5.30653 12.4999 6.5C12.4999 8.73875 13.0187 10.5375 13.4312 11.25C13.475 11.3259 13.4981 11.4119 13.4982 11.4996C13.4982 11.5872 13.4753 11.6733 13.4316 11.7492C13.3879 11.8252 13.3251 11.8883 13.2493 11.9324C13.1735 11.9764 13.0875 11.9997 12.9999 12H2.99992C2.91241 11.9995 2.82657 11.976 2.75098 11.9319C2.67539 11.8878 2.61269 11.8246 2.56916 11.7487C2.52564 11.6728 2.5028 11.5868 2.50293 11.4992C2.50306 11.4117 2.52616 11.3258 2.56992 11.25C2.9818 10.5375 3.49992 8.73813 3.49992 6.5Z"
        stroke="#5A5A5A"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_1705_10502">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
