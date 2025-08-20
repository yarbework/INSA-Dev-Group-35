import "./App.css"; // css file

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExamsProvider } from "./context/ExamsContext";
import { AnimatePresence } from "framer-motion";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/signUp";
import Exam from "./Pages/ExamsPage";
import About from "./Pages/About";
import QuizPage from "./Pages/QuizPage";
import CreateQuiz from "./Pages/CreateQuizPage";
import NavLayout from "./Components/NavLayout";
import PageWrapper from "./Components/wrapper/PageWrapper";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <AuthProvider>
        <ExamsProvider>
          <Routes location={location} key={location.pathname}>
            {/* The following navLayout contains header and footer which is included to home, exam and about page */}
            <Route path="/" element={<NavLayout />}>
              <Route
                index
                element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                }
              />
              <Route
                path="exams"
                element={
                  <PageWrapper>
                    <Exam />
                  </PageWrapper>
                }
              />
              <Route
                path="about"
                element={
                  <PageWrapper>
                    <About />
                  </PageWrapper>
                }
              />
            </Route>
            {/* The following statements are without header and footer */}
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              }
            />
            <Route
              path="/signUp"
              element={
                <PageWrapper>
                  <SignUp />
                </PageWrapper>
              }
            />
            <Route
              path="/createQuiz"
              element={
                <PageWrapper>
                  <CreateQuiz />
                </PageWrapper>
              }
            />
            <Route
              path="/quiz/:quizId"
              element={
                <PageWrapper>
                  <QuizPage />
                </PageWrapper>
              }
            />
          </Routes>
        </ExamsProvider>
      </AuthProvider>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
