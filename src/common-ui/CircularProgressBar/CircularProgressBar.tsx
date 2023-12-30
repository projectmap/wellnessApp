import React from 'react';

interface ICircularProgressbar {
  children: React.ReactNode;
  strokeWidth: number;
  circleOneStroke: string;
  circleTwoStroke: string;
  progress: number;
}

const CircularProgressBar = (props: ICircularProgressbar) => {
  const { progress, strokeWidth, circleOneStroke, children, circleTwoStroke } = props;
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <svg className="CircularProgressBar" width="185" height="185">
      <circle
        className="CircularProgressBar__background"
        cx="92.5"
        cy="92.5"
        r={radius}
        strokeWidth={strokeWidth}
        stroke={circleOneStroke}
      />
      <circle
        className="CircularProgressBar__progress"
        cx="92.5"
        cy="92.5"
        r={radius}
        strokeWidth={strokeWidth}
        stroke={circleTwoStroke}
        strokeDasharray={circumference}
        strokeDashoffset={progressOffset}
      />
      <foreignObject x="15" y="15" width="160" height="160" color="white">
        {children}
      </foreignObject>
    </svg>
  );
};

export default CircularProgressBar;
