import { cn } from "@/utils";
import React from "react";

export const UploadImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={cn(`w-[16px] h-[16px] sm:w-[32px] sm:h-[32px]`, props.className)}
  >
    <g clipPath="url(#clip0_778_8071)">
      <path
        d="M13.5 3H2.5C2.22386 3 2 3.22386 2 3.5V12.5C2 12.7761 2.22386 13 2.5 13H13.5C13.7761 13 14 12.7761 14 12.5V3.5C14 3.22386 13.7761 3 13.5 3Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 7C10.1642 7 10.5 6.66421 10.5 6.25C10.5 5.83579 10.1642 5.5 9.75 5.5C9.33579 5.5 9 5.83579 9 6.25C9 6.66421 9.33579 7 9.75 7Z"
        fill="black"
      />
      <path
        d="M9.20679 10.2501L10.8124 8.64633C10.9062 8.55263 11.0333 8.5 11.1658 8.5C11.2984 8.5 11.4255 8.55263 11.5193 8.64633L13.9999 11.1288"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 10.543L5.39625 7.14615C5.44269 7.09967 5.49783 7.06279 5.55853 7.03763C5.61923 7.01246 5.68429 6.99951 5.75 6.99951C5.81571 6.99951 5.88077 7.01246 5.94147 7.03763C6.00217 7.06279 6.05731 7.09967 6.10375 7.14615L11.9569 12.9999"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_778_8071">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
