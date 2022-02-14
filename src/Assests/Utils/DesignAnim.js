import React from "react";
import "./DesignAnim.css";
const DesignAnim = ({ text, width = 500, height = 500 }) => {
  return (
    <div className="patterns">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="polka-dots"
            x="0"
            y="0"
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <circle fill="#be9ddf" cx="25" cy="25" r="3"></circle>
          </pattern>
          <style>
            @import url("https://fonts.googleapis.com/css?
            family=Lora:400,400i,700,700i");
          </style>
        </defs>

        <text x="50%" y="60%" text-anchor="middle">
          {text}
        </text>
      </svg>
    </div>
  );
};

export default DesignAnim;
