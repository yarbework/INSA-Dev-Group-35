import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import PageWrapper from "../Components/wrapper/PageWrapper";
import image from "../assets/images/home.jpg";

export default function Home() {
  return (
    <PageWrapper>
      <div className="bg-white min-h-screen flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-extrabold text-black mb-5 animate__animated animate__fadeInDown">
          Learn <br /> New Concepts <br /> for Each Question
        </h1>
        <p className="text-lg text-gray-800 mb-5 animate__animated animate__fadeInUp">
          <span className="font-bold">|</span> We help you prepare for exams and
          quizzes
        </p>
        <div className="flex space-x-4 animate__animated animate__fadeIn">
          <Link to="/exams">
            <button className="bg-gradient-to-r from-yellow-500 to-red-500 text-white text-xl px-6 py-3 rounded-lg shadow-lg hover:opacity-80 transition duration-300 transform hover:scale-105">
              Start Learning
            </button>
          </Link>
          <Link
            to="../about"
            className="flex items-center text-gray-800 hover:underline"
          >
            <ChevronDown className="mr-2" />
            Know More
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 mt-10">
        <h2 className="text-3xl font-bold text-black text-center mb-6">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-black mb-3">
              Personalized Learning
            </h3>
            <p className="text-gray-700">
              Our platform adapts to your learning style and pace, ensuring a
              customized experience.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-black mb-3">
              Engaging Quizzes
            </h3>
            <p className="text-gray-700">
              Enjoy interactive quizzes that keep you engaged and motivated to
              learn more.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-black mb-3">
              Instant Feedback
            </h3>
            <p className="text-gray-700">
              Receive immediate feedback on your performance to help you
              identify areas for improvement.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
