import React from "react";

const ProductIcon = ({ classname }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 32 32"
      className={classname}
    >
      <g id="SVGRepo_iconCarrier" fill="none" fillRule="evenodd">
        <path d="M0 0h32v32H0z"></path>
        <path
          fill="currentcolor"
          fillRule="nonzero"
          d="m16 0 13.856 8v16L16 32 2.144 24V8zm0 2.309L4.143 9.155v13.689L16 29.69l11.856-6.846V9.155zm6.55 8.365.94 1.766-6.502 3.455v7.77h-2v-7.769l-6.5-3.456.938-1.766 6.562 3.49z"
        ></path>
      </g>
    </svg>
  );
};

export default ProductIcon;
