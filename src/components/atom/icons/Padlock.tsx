import React from "react";

const PadlockIcon = (    props: React.SVGProps<SVGSVGElement> & { pathClass?: string }
    ) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      {...props}
    >
      <circle cx="100" cy="100" r="100" fill="#DB3030" />
      <path
        d="M99.9688 121.312C105.362 121.312 109.734 116.94 109.734 111.547C109.734 106.153 105.362 101.781 99.9688 101.781C94.5753 101.781 90.2031 106.153 90.2031 111.547C90.2031 116.94 94.5753 121.312 99.9688 121.312Z"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M99.9688 121.312V133.031"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M139.031 86.1562H60.9062C58.7489 86.1562 57 87.9051 57 90.0625V144.75C57 146.907 58.7489 148.656 60.9062 148.656H139.031C141.189 148.656 142.938 146.907 142.938 144.75V90.0625C142.938 87.9051 141.189 86.1562 139.031 86.1562Z"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M80.4375 86.1562V70.5312C80.4375 65.3512 82.4953 60.3834 86.1581 56.7206C89.8209 53.0578 94.7887 51 99.9688 51C105.149 51 110.117 53.0578 113.779 56.7206C117.442 60.3834 119.5 65.3512 119.5 70.5312V86.1562"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PadlockIcon;
