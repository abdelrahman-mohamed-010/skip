"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomDropdownProps {
  onSort: (direction: "newest" | "oldest") => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ onSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("newest");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (value: "newest" | "oldest") => {
    setSelectedOption(value);
    onSort(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition-all duration-200"
      >
        <span className="text-gray-700 font-medium">
          Sort by:{" "}
          {selectedOption === "newest" ? "Newest First" : "Oldest First"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 ml-2 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 animate-fadeIn">
          <div
            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${
              selectedOption === "newest"
                ? "text-accent font-medium"
                : "text-gray-700"
            }`}
            onClick={() => handleOptionSelect("newest")}
          >
            Newest First
          </div>
          <div
            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${
              selectedOption === "oldest"
                ? "text-accent font-medium"
                : "text-gray-700"
            }`}
            onClick={() => handleOptionSelect("oldest")}
          >
            Oldest First
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
