import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Quiz } from "../components/quiz/QuizCard";

// export type NewQuizPayload = Omit<Quiz, "id" | "author">;

export type NewQuizPayload = {
  title: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number; 
  privacy: "public" | "private";
  password?: string;
  questions: {
    questionText: string;
    options: { text: string }[];
    correctAnswerIndex: number | null; // I have added this to match the QuizCard type
  }[];
};

type ExamsContextType = {
  exams: Quiz[];
  addExam: (newExamPayload: NewQuizPayload) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const ExamsContext = createContext<ExamsContextType | undefined>(undefined);
const API_URL = "http://localhost:4000/api";

export const ExamsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [exams, setExams] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/exams`);
        if (!response.ok) throw new Error("Failed to fetch exams.");
        const data: Quiz[] = await response.json();
        setExams(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const addExam = async (newExamPayload: NewQuizPayload) => {
    try {
      const response = await fetch(`${API_URL}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExamPayload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to create the exam.");
      }
      const createdExam: Quiz = await response.json();
      setExams((prevExams) => [createdExam, ...prevExams]);
    } catch (err: any) {
      console.error("Failed to add exam:", err.message);
      throw err;
    }
  };

  const value = { exams, addExam, loading, error };

  return (
    <ExamsContext.Provider value={value}>{children}</ExamsContext.Provider>
  );
};

export const useExams = () => {
  const context = useContext(ExamsContext);
  if (context === undefined)
    throw new Error("useExams must be used within an ExamsProvider");
  return context;
};
