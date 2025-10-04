import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg mb-12 text-white shadow-2xl border-4 border-yellow-300">
        <h1 className="text-5xl font-bold text-white mb-6 animate-pulse">
          Welcome to QuizGeek! 🚀
        </h1>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          A modern quiz application built for students and instructors. 
          Create, share, and take quizzes with AI-powered assessments and performance tracking.
        </p>
        
        {!user ? (
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors transform hover:scale-110 shadow-lg"
            >
              🎯 Get Started
            </Link>
            <Link
              to="/login"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors shadow-lg"
            >
              🔐 Sign In
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/quizzes"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Quizzes
            </Link>
            {user.role === 'Instructor' && (
              <Link
                to="/create-quiz"
                className="inline-block border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Quiz
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Assessment</h3>
          <p className="text-gray-600">
            Get detailed AI-powered feedback on your quiz performance to improve your learning.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Timer & Tracking</h3>
          <p className="text-gray-600">
            Timed quizzes with performance tracking to monitor your progress over time.
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
          <p className="text-gray-600">
            Students can take quizzes while instructors create and manage quiz content.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Community</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-1">100+</div>
            <div className="text-gray-600">Active Quizzes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-1">500+</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
            <div className="text-gray-600">Instructors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
