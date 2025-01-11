import React from "react";

const Button = ({ text, type = "button", onClick, className = "btn" }) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
