
import React from "react";

export const BalanceIcon = (props: React.SVGProps<SVGSVGElement>& { pathClass?: string }) => (
  <svg
    width="18"
    height="16"
    viewBox="0 0 18 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 2.3913V13.5217C1 13.8907 1.14658 14.2446 1.4075 14.5055C1.66842 14.7665 2.02231 14.913 2.3913 14.913H16.3043C16.4888 14.913 16.6658 14.8398 16.7962 14.7093C16.9267 14.5788 17 14.4019 17 14.2174V4.47826C17 4.29376 16.9267 4.11682 16.7962 3.98636C16.6658 3.8559 16.4888 3.78261 16.3043 3.78261H2.3913C2.02231 3.78261 1.66842 3.63602 1.4075 3.3751C1.14658 3.11418 1 2.7603 1 2.3913ZM1 2.3913C1 2.02231 1.14658 1.66842 1.4075 1.4075C1.66842 1.14658 2.02231 1 2.3913 1H14.2174"
      stroke="#292929"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.pathClass}
    />
    <path
      d="M13 10C13.5523 10 14 9.55228 14 9C14 8.44772 13.5523 8 13 8C12.4477 8 12 8.44772 12 9C12 9.55228 12.4477 10 13 10Z"
      fill="#292929"
      className={props.pathClass}
    />
  </svg>
);
