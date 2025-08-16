import React from "react";

// This is the main type definition for a Quiz, shared across the app.
export type Quiz = {
  _id: string; // MongoDB uses _id by default
  title: string;
  subject: string;
  questionCount: number;
  author: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number; // in minutes
  privacy: "public" | "private";
  password?: string;
  questions?: any[]; // The full questions array is optional here
};

type QuizCardProps = {
  quiz: Quiz;
  onStart: () => void;
};

// Helper function to get color-coded styles based on difficulty
const getDifficultyStyles = (difficulty: "Easy" | "Medium" | "Hard") => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Hard":
      return "bg-red-100 text-red-800";
  }
};

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <div className="p-6 flex-grow">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            {quiz.subject}
          </p>
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full ${getDifficultyStyles(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty}
          </span>
        </div>

        {/* Card Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 truncate">
          {quiz.title}
        </h3>

        {/* Card Meta Info */}
        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
          <div
            className="flex items-center space-x-1.5"
            title="Number of questions"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{quiz.questionCount} Questions</span>
          </div>
          <div className="flex items-center space-x-1.5" title="Time limit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{quiz.timeLimit} min</span>
          </div>
          {quiz.privacy === "private" && (
            <div
              className="flex items-center space-x-1.5 text-yellow-600 font-semibold"
              title="This quiz is private"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Private</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onStart}
          className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};
