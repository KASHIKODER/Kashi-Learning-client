import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
  active: number;
  setActive: (active: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];

  return (
    <div className="w-full flex flex-col gap-2 px-3 py-3 bg-white dark:bg-[#111827] rounded-xl shadow-md">
      {options.map((option, index) => {
        const isCompleted = active > index;
        const isActive = active === index;

        return (
          <div
            key={index}
            className="relative flex items-start cursor-pointer group"
            onClick={() => setActive(index)}
          >
            {/* Step Indicator */}
            <div className="relative flex flex-col items-center mt-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${isCompleted || isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gray-300 dark:bg-gray-700"
                  }`}
              >
                {isCompleted ? (
                  <IoMdCheckmark className="text-white text-lg" />
                ) : (
                  <span
                    className={`transition-colors duration-300
                      ${isActive ? "text-white" : "text-gray-600 dark:text-gray-300"}
                    `}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Connector Line */}
              {index !== options.length - 1 && (
                <div
                  className={`w-[2px] h-9 mt-[2px] transition-all duration-300
                    ${isCompleted
                      ? "bg-gradient-to-b from-blue-500 to-indigo-500"
                      : "bg-gray-300 dark:bg-gray-700"
                    }`}
                />
              )}
            </div>

            {/* Label */}
            <h5
              className={`ml-3 mt-[10px] text-[15px] font-medium leading-tight transition-all duration-300
                ${isActive
                  ? "text-blue-600 dark:text-blue-400 scale-105"
                  : "text-gray-800 dark:text-gray-200 group-hover:text-blue-500"
                }`}
            >
              {option}
            </h5>
          </div>
        );
      })}
    </div>
  );
};

export default CourseOptions;
