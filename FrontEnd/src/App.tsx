import "./App.css"; // css file

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExamsProvider } from "./context/ExamsContext";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/signUp";
import Exam from "./Pages/ExamsPage";
import About from "./Pages/About";
import QuizPage from "./Pages/QuizPage";
import CreateQuiz from "./Pages/CreateQuizPage";
import NavLayout from "./Components/NavLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExamsProvider>
          <Routes>
            {/* The following navLayout contains header and footer which is included to home, exam and about page */}
            <Route path="/" element={<NavLayout />}>
              <Route index element={<Home />} />
              <Route path="exams" element={<Exam />} />
              <Route path="about" element={<About />} />
            </Route>
            {/* The following statements are without header and footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/createQuiz" element={<CreateQuiz />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
          </Routes>
        </ExamsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
