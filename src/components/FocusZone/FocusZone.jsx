import React from "react";

const FocusZone = ({ pose }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "220px",
        top: "140px",
        width: "200px",
        height: "200px",
        border: "4px solid lime",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        transition: "border 0.3s ease-in-out",
        zIndex: 5,
      }}
    />
  );
};

export default FocusZone;
