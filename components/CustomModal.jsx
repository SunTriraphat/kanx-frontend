import React from "react";

export default function CustomModal({
  isOpen,
  onClose,
  children,
  size = "md", // sm, md, lg, xl
  color = "white", // Tailwind color classes (e.g., bg-gray-100, bg-blue-500)
  footer = null, // JSX for footer content
}) {
  // Define size classes
  const sizeClasses = {
    sm: "w-72",
    md: "w-2/4",
    lg: "w-3/4",
    xl: "max-full",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`${sizeClasses[size]} bg-${color} p-6 rounded-lg shadow-lg relative`}
        
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {/* Modal content */}
        <div className="mb-4 max-h-[400px] overflow-y-auto overflow-x-auto whitespace-nowrap">
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="mt-4 border-t pt-4">{footer}</div>}
      </div>
    </div>
  );
}