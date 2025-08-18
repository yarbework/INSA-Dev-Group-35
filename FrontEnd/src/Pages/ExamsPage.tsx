import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizCard } from "../components/quiz/QuizCard";
import type { Quiz } from "../components/quiz/QuizCard";
import { useExams } from "../context/ExamsContext";
import { PasswordPromptModal } from "../components/PasswordPromptModal";

const ExamsPage: React.FC = () => {
  const { exams, loading, error } = useExams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

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
    // Navigate to the quiz page with the quiz ID
    if (quiz.privacy === "public") {
      navigate(`/quiz/${quiz._id}`);
    } else {
      setSelectedQuiz(quiz);
      setIsModalOpen(true); // Open the password prompt modal if the quiz is private
    }
  };

  // Function to handle password submission from the modal

  const handlePasswordSubmit = (enteredPassword: string) => {
    if (selectedQuiz && enteredPassword === selectedQuiz.password) {
      setIsModalOpen(false); // Close the modal if the password is correct
      navigate(`/quiz/${selectedQuiz._id}`); // Navigate to the quiz page
      setSelectedQuiz(null); // Reset selected quiz
    } else {
      alert("Incorrect password. Please try again."); // Alert user if password is incorrect
    }
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
    <>
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
            <div className="space-y-12 flex flex-row flex-wrap gap-5 ">
              {Object.entries(groupedExams).map(([subject, quizzes]) => (
                <section key={subject}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                    {subject}
                  </h2>
                  <div className=" min-w-[325px]">
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
      {selectedQuiz && (
        <PasswordPromptModal
          isOpen={isModalOpen}
          quizTitle={selectedQuiz.title}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </>
  );
};

export default ExamsPage;
