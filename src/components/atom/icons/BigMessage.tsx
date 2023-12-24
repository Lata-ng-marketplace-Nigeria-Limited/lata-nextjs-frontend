
import React from "react";

export const BigMessageIcon = (
    props: React.SVGProps<SVGSVGElement> & { pathClass?: string }
) => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_596_5143)">
      <path
        d="M35.2734 179.773C34.3631 180.539 33.2531 181.029 32.0739 181.186C30.8947 181.343 29.6952 181.16 28.6164 180.659C27.5376 180.157 26.6242 179.359 25.9836 178.356C25.343 177.354 25.0018 176.19 25 175V50C25 48.3424 25.6585 46.7527 26.8306 45.5806C28.0027 44.4085 29.5924 43.75 31.25 43.75H168.75C170.408 43.75 171.997 44.4085 173.169 45.5806C174.342 46.7527 175 48.3424 175 50V150C175 151.658 174.342 153.247 173.169 154.419C171.997 155.592 170.408 156.25 168.75 156.25H64.4531C62.9808 156.25 61.556 156.771 60.4297 157.719L35.2734 179.773Z"
        stroke="#5113A1"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M75 87.5H125"
        stroke="#5113A1"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
      <path
        d="M75 112.5H125"
        stroke="#5113A1"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.pathClass}
      />
    </g>
    <defs>
      <clipPath id="clip0_596_5143">
        <rect width="200" height="200" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
