// src/components/DropDown.js
import React, { useState, useRef, useEffect } from "react";
import "./DropDown.css";

const Dropdown = ({ buttonText, contentClass, onApply, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    setIsActive(true);
    setIsOpen(false);
    onApply?.();
  };

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className={`dropdown-btn ${isActive ? "active" : ""}`}
      >
        {buttonText}
      </button>
      {isOpen && (
        <div className={`dropdown-content ${contentClass}`}>
          {children}
          <button className="apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
