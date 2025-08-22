import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Timer } from "../Components/quiz/Timer";
import { QuestionDisplay } from "../Components/quiz/QuestionDisplay";
import type { Quiz as BaseQuiz } from "../components/quiz/QuizCard";
import PageWrapper from "../Components/wrapper/PageWrapper";

// Updated QuestionPalette code
type QuestionPaletteProps = {
  totalQuestions: number;
  answers: (number | null)[];
  marked: boolean[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  answers,
  marked,
  currentIndex,
  onSelect,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Question Palette</h2>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          // Priority: marked for review > answered > seen > not seen
          let statusClass = "bg-white text-gray-800 border"; // default = not seen
          if (marked[i]) {
            statusClass = "bg-yellow-400 text-white"; // marked for review
          } else if (answers[i] !== null) {
            statusClass = "bg-green-500 text-white"; // answered
          } else if (i <= currentIndex) {
            statusClass = "bg-gray-400 text-white"; // seen but not answered
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-colors ${statusClass} ${
                currentIndex === i ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Types for questions
type QuestionOption = {
  id: string;
  text: string;
};

type QuizQuestion = {
  id: string;
  questionText: string;
  options: QuestionOption[];
};

type FullQuiz = BaseQuiz & {
  questions: QuizQuestion[];
};

const API_URL = "http://localhost:4000/api";
const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();

  const [quiz, setQuiz] = useState<FullQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<boolean[]>([]);

  useEffect(() => {
    const checkLoginAndFetch = async () => {
      try {
        // 1. Check if the person is loged in
        await axios.get(`${API_URL}/endPoints/me`, {
          withCredentials: true,
        });

        const { data } = await axios.get<FullQuiz>(
          `http://localhost:4000/api/exams/${quizId}`
        );
        setQuiz(data);
        setAnswers(Array(data.questions.length).fill(null));
        setMarkedQuestions(Array(data.questions.length).fill(false));
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    checkLoginAndFetch();
  }, [quizId, navigate]);

  const shuffledQuestions = useMemo(() => {
    if (!quiz) return [];
    return quiz.questions
      .map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      }))
      .sort(() => Math.random() - 0.5);
  }, [quiz]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1)
      setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleQuestionSelect = (index: number) =>
    setCurrentQuestionIndex(index);

  const handleMarkToggle = () => {
    const newMarked = [...markedQuestions];
    newMarked[currentQuestionIndex] = !newMarked[currentQuestionIndex];
    setMarkedQuestions(newMarked);
  };

  const handleFinish = async () => {
    const answeredCount = answers.filter((a) => a !== null).length;
    const confirmation = window.confirm(
      `You have answered ${answeredCount} out of ${quiz?.questions.length} questions. Are you sure you want to finish?`
    );
    if (confirmation) {
      try {
        //sending the answer to new backend endpoint
        const response = await fetch(`${API_URL}/exams/${quizId}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: answers }), //this can send answers array
        });
        if (!response.ok) {
          throw new Error("Failed to submit your answers.");
        }
        const resultsData = await response.json();
        navigate("/quiz/results", { state: { results: resultsData } });
      } catch (err) {
        console.error("Submission failed", err);
        alert("There was an error submitting your quiz, Please try again.");
      }
    }
  };

  const handleTimeUp = () => {
    alert("Time's up! Your quiz will be submitted automatically.");
    handleFinish();
  };

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

  if (!quiz)
    return (
      <div className="text-center mt-20 text-xl">Quiz data is incomplete.</div>
    );

  return (
    <PageWrapper>
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
              {currentQuestionIndex === shuffledQuestions.length - 1 ? (
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
              totalQuestions={shuffledQuestions.length}
              answers={answers}
              marked={markedQuestions}
              currentIndex={currentQuestionIndex}
              onSelect={handleQuestionSelect}
            />
          </aside>
        </div>
      </div>
    </PageWrapper>
  );
};

export default QuizPage;
