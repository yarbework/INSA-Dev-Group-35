import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';

const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && quiz.timeLimit && !isSubmitted) {
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, isSubmitted]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      setQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(-1));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post(`/quizzes/${id}/submit`, { answers });
      setResult(response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl text-red-600">Quiz not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
          {!isSubmitted && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</div>
              <div className="text-sm text-gray-500">Time Remaining</div>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span><strong>Subject:</strong> {quiz.subject}</span>
          <span><strong>Difficulty:</strong> {quiz.difficulty}</span>
          <span><strong>Questions:</strong> {quiz.questions.length}</span>
          {quiz.timeLimit && <span><strong>Time Limit:</strong> {quiz.timeLimit} minutes</span>}
        </div>
      </div>

      {isSubmitted ? (
        /* Results View */
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Quiz Results</h2>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {result?.score}/{result?.total}
            </div>
            <div className="text-xl text-gray-600">
              {((result?.score / result?.total) * 100).toFixed(1)}% Correct
            </div>
          </div>

          {/* Review Questions */}
          <div className="space-y-6">
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">{question.questionText}</h3>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className={`p-2 rounded ${
                        oIndex === question.correctAnswerIndex
                          ? 'bg-green-100 text-green-800'
                          : answers[qIndex] === oIndex && oIndex !== question.correctAnswerIndex
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-50'
                      }`}
                    >
                      {option.text}
                      {oIndex === question.correctAnswerIndex && (
                        <span className="ml-2 text-green-600">✓ Correct</span>
                      )}
                      {answers[qIndex] === oIndex && oIndex !== question.correctAnswerIndex && (
                        <span className="ml-2 text-red-600">✗ Your answer</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/quizzes'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Questions */
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Question Navigation */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </h2>
            <div className="flex space-x-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[index] !== -1
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Current Question */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {quiz.questions[currentQuestion].questionText}
            </h3>
            
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    answers[currentQuestion] === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={(e) => handleAnswerSelect(currentQuestion, parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <span className="block">{option.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
