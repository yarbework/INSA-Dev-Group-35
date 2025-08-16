import React from "react";

type PaletteProps = {
  totalQuestions: number;
  answers: (number | null)[]; //why null? Because some questions might not be answered yet
  marked: boolean[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

export const QuestionPalette: React.FC<PaletteProps> = ({
  totalQuestions,
  answers,
  marked,
  currentIndex,
  onSelect,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Questions</h3>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const isAnswered = answers[index] !== null;
          const isCurrent = index === currentIndex;
          const isMarked = marked[index];
          let classes =
            "w-10 h-10 flex items-center justify-center rounded font-semibold border-2 transition-all duration-200";
          if (isCurrent) {
            classes += "bg-blue-600 border-blue-800 text-white scale-110";
          } else if (isAnswered) {
            classes += "bg-green-200 border-green-400 text-green-800";
          } else {
            classes +=
              "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200";
          }
          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className="{classes}"
            >
              {isMarked && (
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"
                  title="Marked for Review"
                ></div>
              )}
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
