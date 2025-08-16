import React from "react";

type Question = {
  questionText: string;
  options: QuestionOptions[];
};

type QuestionOptions = {
  text: string;
};

type DisplayProps = {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  onAnswerSelect: (optionIndex: number) => void;
};

export const QuestionDisplay: React.FC<DisplayProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Question {questionNumber}:
        <span className="font-normal">{question.questionText}</span>
      </h2>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
              selectedAnswer === index
                ? "bg-blue-100 border-blue-500 shadow-inner"
                : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={`question-${questionNumber}`}
              checked={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
              className="h-5 w-5 flex-shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-4 text-md sm:text-lg text-gray-700">
              {option.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
