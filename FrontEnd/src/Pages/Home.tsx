import { ArrowRight, BookOpen, CheckCircle, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import PageWrapper from "../Components/wrapper/PageWrapper";
import FeatureCard from "../Components/FeatureCard";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <PageWrapper>
      <section className="bg-white text-gray-900 font-sans">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between p-8 lg:p-16">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 animate__animated animate__fadeInLeft">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug mb-6">
              Master New Concepts with Every Question
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Elevate your learning with interactive quizzes, track your
              progress, and achieve your academic goals. Your journey to
              knowledge starts here.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/exams"
                  className="inline-block bg-blue-600 text-white text-lg font-medium px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-transform transition-colors duration-300"
                >
                  Go to Exams
                  <ArrowRight className="inline-block ml-2" size={20} />
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-block bg-blue-600 text-white text-lg font-medium px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-transform transition-colors duration-300"
                >
                  Get Started for Free
                  <ArrowRight className="inline-block ml-2" size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {" "}
              Why Students Love Our Platform
            </h2>
            <p className="text-lg text-gray-600 mt-3">
              Everything you need to prepare, practice, and perform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen size={32} />}
              title="Personlized Learning"
              description="Contribute your Own quizzes and challenge others. Our platform adapts to your learning style and pace."
            />
            <FeatureCard
              icon={<CheckCircle size={32} />}
              title="Instant Feedback"
              description="Receive immediate, detailed feedback on your performance to help you identify strengths and weaknesses."
            />
            <FeatureCard
              icon={<BarChart2 size={32} />}
              title="Performance Tracking"
              description="Monitor your progress over time with a personal dashboard and detailed analytics for every exam"
            />
          </div>
        </div>
      </section>
      {!isAuthenticated && (
        <section className="bg-white py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-gray-600 my-4">
              Create an account to join our community of learners today.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-blue-600 text-white text-lg font-semibold px-10 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 mt-4"
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
