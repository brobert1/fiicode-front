import { useState } from "react";

const ChatHeader = ({ isAvatarMode, onToggleMode }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="py-4 flex justify-center items-center relative">
      <div className="flex items-center">
        <div className="relative">
          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
            <h3 className="text-secondary text-xl font-semibold">
              Mara
              <span className="text-xs text-primary ml-2">
                {isAvatarMode ? "virtual" : "text"}
              </span>
            </h3>
            <i
              className={`fa-solid fa-chevron-down ml-2 mt-2 text-secondary text-xs transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            ></i>
          </div>

          {dropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-white border border-secondary/30 rounded-md shadow-lg">
              <div
                className="px-4 py-3 text-sm text-secondary hover:bg-secondary/10 cursor-pointer flex items-center"
                onClick={() => {
                  onToggleMode();
                  setDropdownOpen(false);
                }}
              >
                {isAvatarMode ? "text" : "virtual"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
