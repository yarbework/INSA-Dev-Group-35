import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExams } from "../context/ExamsContext";

// Type definitions for the form's local state
type Option = {
  text: string;
};

type Question = {
  id: number; // A temporary ID for React's key prop
  questionText: string;
  options: Option[];
  correctAnswerIndex: number | null;
};

const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { addExam } = useExams();

  // State for the form fields
  const [quizTitle, setQuizTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now(),
      questionText: "",
      options: [{ text: "" }, { text: "" }],
      correctAnswerIndex: null,
    },
  ]);
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy"
  );

  // State for UI feedback
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLER FUNCTIONS for managing questions and options ---
  const handleAddQuestion = () =>
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        questionText: "",
        options: [{ text: "" }, { text: "" }],
        correctAnswerIndex: null,
      },
    ]);
  const handleRemoveQuestion = (id: number) => {
    if (questions.length > 1)
      setQuestions(questions.filter((q) => q.id !== id));
  };
  const handleQuestionTextChange = (id: number, text: string) =>
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, questionText: text } : q))
    );
  const handleAddOption = (qId: number) =>
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, { text: "" }] } : q
      )
    );
  const handleRemoveOption = (qId: number, oIndex: number) =>
    setQuestions(
      questions.map((q) =>
        q.id === qId
          ? { ...q, options: q.options.filter((_, i) => i !== oIndex) }
          : q
      )
    );
  const handleOptionTextChange = (qId: number, oIndex: number, text: string) =>
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          const newOpts = q.options.map((opt, i) =>
            i === oIndex ? { ...opt, text } : opt
          );
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  const handleCorrectAnswerChange = (qId: number, oIndex: number) =>
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, correctAnswerIndex: oIndex } : q
      )
    );

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: string[] = [];

    // Validation logic
    if (quizTitle.trim() === "") newErrors.push("Quiz Title is required.");
    if (subject.trim() === "") newErrors.push("Subject is required.");
    questions.forEach((q, i) => {
      if (q.questionText.trim() === "")
        newErrors.push(`Question #${i + 1} text is empty.`);
      if (q.options.some((opt) => opt.text.trim() === ""))
        newErrors.push(`An option in Question #${i + 1} is empty.`);
      if (q.correctAnswerIndex === null)
        newErrors.push(
          `A correct answer for Question #${i + 1} must be selected.`
        );
    });
    if (timeLimit <= 0) newErrors.push("Time limit must be greater than zero.");
    if (privacy === "private" && password.trim() === "")
      newErrors.push("Password is required for private quizzes.");

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setIsSubmitting(true);
      const payload = {
        title: quizTitle,
        subject,
        questionCount: questions.length,
        difficulty,
        timeLimit,
        privacy,
        password: privacy === "private" ? password : undefined,
        questions: questions.map(
          ({ questionText, options, correctAnswerIndex }) => ({
            questionText,
            options,
            correctAnswerIndex: correctAnswerIndex as number,
          })
        ),
      };

      try {
        await addExam(payload);
        navigate("/exams");
      } catch (error) {
        setErrors(["Failed to submit quiz. Please try again."]);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-xl space-y-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">
            Create a New Quiz
          </h1>

          {/* Main Quiz Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="quizTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quiz Title
              </label>
              <input
                type="text"
                id="quizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-700">Questions</h2>
            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="p-4 border rounded-lg bg-gray-50 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">
                    Question {qIndex + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionTextChange(q.id, e.target.value)
                  }
                  placeholder="Enter question text..."
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
                <div className="space-y-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        id={`correct_answer_${q.id}-${oIndex}`}
                        aria-label={`Set option ${
                          oIndex + 1
                        } as the correct answer`}
                        name={`correct_answer_${q.id}`}
                        checked={q.correctAnswerIndex === oIndex}
                        onChange={() => handleCorrectAnswerChange(q.id, oIndex)}
                      />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionTextChange(q.id, oIndex, e.target.value)
                        }
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-grow p-2 border rounded-md"
                      />
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(q.id, oIndex)}
                          className="text-xs text-red-500"
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddOption(q.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add Option
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-2 border-2 border-dashed border-blue-300 text-gray-500 hover:bg-blue-600 rounded-md hover:text-white transition-colors"
            >
              + Add Question
            </button>
          </div>

          {/* Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6">
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-2 border rounded-md"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="timeLimit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time Limit (mins)
              </label>
              <input
                type="number"
                id="timeLimit"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="privacy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Privacy
              </label>
              <select
                id="privacy"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as any)}
                className="w-full p-2 border rounded-md"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          {privacy === "private" && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quiz Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}

          {/* Errors and Submission */}
          {errors.length > 0 && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">
                Please fix the following errors:
              </strong>
              <ul className="list-disc list-inside mt-2">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizPage;
