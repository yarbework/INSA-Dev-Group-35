import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { QuizCard } from "../components/quiz/QuizCard";
import type { Quiz } from "../components/quiz/QuizCard";
import { useExams } from "../context/ExamsContext";

const ExamsPage: React.FC = () => {
  const { exams, loading, error } = useExams();
  const navigate = useNavigate();

  // This logic groups quizzes by subject. e.g., { Programming: [...], History: [...] }
  const groupedExams = useMemo(() => {
    return exams.reduce((acc, quiz) => {
      if (!acc[quiz.subject]) {
        acc[quiz.subject] = [];
      }
      acc[quiz.subject].push(quiz);
      return acc;
    }, {} as Record<string, Quiz[]>);
  }, [exams]); // Re-calculates only when the exams array changes

  const handleStartQuiz = (quiz: Quiz) => {
    // NOTE: For a real app, you would fetch the full quiz with questions here,
    // as the initial GET request doesn't include them for performance.
    // For now, this is a placeholder. We will need to create a new API endpoint like GET /api/exams/:id
    alert(
      `Starting quiz "${quiz.title}". Navigation to quiz page needs to be implemented after fetching full quiz data.`
    );
    // Example navigation:
    // navigate(`/quiz/${quiz._id}`);
    navigate(`/quiz/${quiz._id}`);
  };

  // Render a loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // Render an error message if the fetch fails
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-8">
        <div className="text-center bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-700">An Error Occurred</h2>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Available Exams
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Select a quiz to test your knowledge.
          </p>
        </header>

        {Object.keys(groupedExams).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedExams).map(([subject, quizzes]) => (
              <section key={subject}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                  {subject}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {quizzes.map((quiz) => (
                    <QuizCard
                      key={quiz._id}
                      quiz={quiz}
                      onStart={() => handleStartQuiz(quiz)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">No exams available at the moment.</p>
            <p>Why not create one?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
