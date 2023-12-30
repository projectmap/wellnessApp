import * as React from "react";
import { SVGProps } from "react";

const AddPhotoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={49}
    height={49}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle opacity={0.8} cx={24.5} cy={24.5} r={24.5} fill="#330D17" />
    <g opacity={0.4}>
      <path
        d="M31.61 16.68H17.39a.71.71 0 0 0-.71.71v14.22c0 .392.318.71.71.71h14.22a.71.71 0 0 0 .71-.71V17.39a.71.71 0 0 0-.71-.71Z"
        stroke="#000"
        strokeWidth={1.17}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m32.32 27.344-3.763-3.763a.711.711 0 0 0-1.005 0l-3.971 3.97a.71.71 0 0 1-1.006 0l-1.838-1.837a.71.71 0 0 0-1.005 0l-3.052 3.052"
        stroke="#000"
        strokeWidth={1.17}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.012 22.367a1.066 1.066 0 1 0 0-2.132 1.066 1.066 0 0 0 0 2.132Z"
        fill="#131336"
      />
    </g>
    <path
      d="M23.864 28.25h1.272v-3.114h3.114v-1.272h-3.114V20.75h-1.272v3.114H20.75v1.272h3.114v3.114Z"
      fill="#fff"
    />
  </svg>
);

export default AddPhotoIcon;
