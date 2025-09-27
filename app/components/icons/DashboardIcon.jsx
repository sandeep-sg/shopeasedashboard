import React from 'react'

const DashboardIcon = ({classname}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      className={classname}
    >
      <path fill="none" stroke="none" d="M0 0h24v24H0z"></path>
      <path
        stroke="none"
        d="M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z"
      ></path>
    </svg>
  );
}

export default DashboardIcon