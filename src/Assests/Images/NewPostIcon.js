import React from "react";

const NewPostIcon = ({
  width = "24px",
  height = "24px",
  color = "rgba(0,0,0,0.4)",
  active = false,
}) => {
  return (
    <div
      style={
        active
          ? {
              marginTop: "-4vh",
              height: { height },
              width: { width },
              borderRadius: { width },
              backgroundColor: "white",
              transition: "all 0.5s ease-in-out",
            }
          : {}
      }
    >
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="plus-circle"
        className="svg-inline--fa fa-plus-circle fa-w-16"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={width}
        height={height}
      >
        <path
          fill={active ? "crimson" : color}
          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
        ></path>
      </svg>
    </div>
  );
};

export default NewPostIcon;
