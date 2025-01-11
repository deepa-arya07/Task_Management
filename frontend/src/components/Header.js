import React from "react";
import "./Header.css"; // Import any specific styles if needed

const Header = ({ title }) => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
