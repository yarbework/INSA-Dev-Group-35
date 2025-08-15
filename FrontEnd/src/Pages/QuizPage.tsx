import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Timer } from "../components/quiz/Timer";
import { QuestionPalette } from "../components/quiz/QuestionPalette";
import { QuestionDisplay } from "../components/quiz/QuestionDisplay";
import type { Quiz as BaseQuiz } from "../components/quiz/QuizCard";

const API_URL = "http://localhost:4000/api";

type FullQuiz = BaseQuiz & {
  questions: {
    questionText: string;
    options: { text: string }[];
    correctAnswerIndex: number;
  }[];
};

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();

  // State for the quiz data and UI
  const [quiz, setQuiz] = useState<FullQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the user's progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<boolean[]>([]);

  // Fetch the full quiz data when the component mounts
  useEffect(() => {
    const fetchFullQuiz = async () => {
      try {
        const response = await fetch(`${API_URL}/exams/${quizId}`);
        if (!response.ok) throw new Error("Could not find the requested quiz.");

        const data: FullQuiz = await response.json();
        setQuiz(data);
        // Initialize state based on the fetched data
        setAnswers(Array(data.questions?.length || 0).fill(null));
        setMarkedQuestions(Array(data.questions?.length || 0).fill(false));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFullQuiz();
  }, [quizId]);

  // Handler Functions
  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  const handleQuestionSelect = (index: number) =>
    setCurrentQuestionIndex(index);
  const handleMarkToggle = () => {
    const newMarked = [...markedQuestions];
    newMarked[currentQuestionIndex] = !newMarked[currentQuestionIndex];
    setMarkedQuestions(newMarked);
  };
  const handleFinish = () => {
    const answeredCount = answers.filter((a) => a !== null).length;
    const confirmation = window.confirm(
      `You have answered ${answeredCount} out of ${quiz?.questions.length} questions. Are you sure you want to finish?`
    );
    if (confirmation) {
      console.log("Submitting quiz. Final Answers:", answers);
      alert("Quiz submitted! (Results page not yet implemented)");
      navigate("/exams");
    }
  };
  const handleTimeUp = () => {
    alert("Time's up! Your quiz will be submitted automatically.");
    handleFinish();
  };

  // Conditional Rendering
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 mt-20 text-xl">{error}</div>
    );

  if (!quiz) {
    return (
      <div className="text-center mt-20 text-xl">Quiz data is incomplete.</div>
    );
  }
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 space-y-6">
          <header className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
              {quiz.title}
            </h1>
            <Timer initialMinutes={quiz.timeLimit} onTimeUp={handleTimeUp} />
          </header>

          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            selectedAnswer={answers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
          />

          <footer className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleMarkToggle}
              className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                markedQuestions[currentQuestionIndex]
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {markedQuestions[currentQuestionIndex]
                ? "Unmark Review"
                : "Mark for Review"}
            </button>
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600"
              >
                Finish Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </footer>
        </main>

        <aside className="space-y-6 lg:mt-0">
          <QuestionPalette
            totalQuestions={quiz.questions.length}
            answers={answers}
            marked={markedQuestions}
            currentIndex={currentQuestionIndex}
            onSelect={handleQuestionSelect}
          />
        </aside>
      </div>
    </div>
  );
};

export default QuizPage;
