import React from "react";
import { useNavigate } from "react-router-dom";
function Buttons() {
  const navigate = useNavigate();
  const buttonData = [
    { key: "Login", label: "Login", path: "/login", styleType: "secondary" },
    {
      key: "createQuiz",
      label: "Create Quize",
      path: "/CreateQuiz",
      styleType: "primary",
    },
  ] as const;

  const buttonStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-white  border-2 border-blue-600 hover:text-gray-600",
    secondary:
      "border-2 border-blue-600 text-gray-600 hover:bg-blue-700 hover:text-white",
  };

  const ButtonClass =
    "w-full md:w-auto px-5 py-2 rounded-lg font-semibold transition-colors duration-300 ";
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
      {buttonData.map((button, index) => (
        <React.Fragment key={button.key}>
          <button
            key={button.key}
            onClick={() => navigate(button.path)}
            className={`${ButtonClass} ${buttonStyles[button.styleType]}`}
          >
            {button.label}
            {/* <span className="text-gray-600 font-bold mx-2 md:block"> / </span> */}
          </button>

          {index < buttonData.length - 1 && (
            <span className="text-blue-600 font-bold mx-2 md:block hidden">
              /
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Buttons;
