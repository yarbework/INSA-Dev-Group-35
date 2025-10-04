import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { SUBJECTS, getSubjectsByCategory, findMatchingSubject } from '../constants/subjects';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quizData, setQuizData] = useState({
    title: '',
    subject: '',
    difficulty: 'Easy',
    timeLimit: '',
    privacy: 'public',
    password: '',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0
  });
  const [loading, setLoading] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = event.target.closest('.subject-dropdown-container');
      if (!dropdown) {
        setShowSubjectDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuizDataChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    const hasEmptyOptions = currentQuestion.options.some(option => !option.trim());
    if (hasEmptyOptions) {
      alert('Please fill in all options');
      return;
    }

    if (currentQuestion.correctAnswerIndex < 0 || currentQuestion.correctAnswerIndex >= currentQuestion.options.length) {
      alert('Please select a correct answer');
      return;
    }

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }]
    }));

    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    });
  };

  const updateOption = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  const addOption = () => {
          setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions,
      correctAnswerIndex: prev.correctAnswerIndex >= newOptions.length 
        ? Math.max(0, newOptions.length - 1) 
        : prev.correctAnswerIndex
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (quizData.title.trim() && quizData.subject.trim() && quizData.questions.length > 0) {
      setLoading(true);
      
      try {
        // Transform the data to match backend validation
        const transformedQuestions = quizData.questions.map(q => ({
          questionText: q.questionText,
          options: q.options.map(option => ({ text: option })),
          correctAnswerIndex: q.correctAnswerIndex
        }));

        const submitData = {
          title: quizData.title,
          subject: quizData.subject,
          author: user?.username || 'Anonymous', // Add required author field
          difficulty: quizData.difficulty,
          timeLimit: parseInt(quizData.timeLimit) || 30,
          privacy: quizData.privacy,
          password: quizData.privacy === 'private' ? (quizData.password || '') : undefined,
          questions: transformedQuestions,
          questionCount: quizData.questions.length
        };

        const response = await api.post('/quizzes', submitData);
        alert('Quiz created successfully!');
        navigate('/quizzes');
      } catch (error) {
        console.error('Quiz creation error:', error);
        const errorMsg = error.response?.data?.errors?.join(', ') || 'Failed to create quiz';
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create New Quiz</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quiz Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quiz Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => handleQuizDataChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quiz title"
              />
            </div>
            <div className="relative subject-dropdown-container">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <div className="relative">
                <input
                  type="text"
                  value={subjectSearch || quizData.subject}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSubjectSearch(value);
                    setShowSubjectDropdown(value.length > 0);
                    
                    // Auto-select if exact match found
                    const matches = findMatchingSubject(value);
                    if (matches.length > 0 && matches[0].name.toLowerCase() === value.toLowerCase()) {
                      handleQuizDataChange('subject', matches[0].name);
                      setSubjectSearch('');

                      setShowSubjectDropdown(false);
                    }
                  }}
                  onFocus={() => setShowSubjectDropdown((subjectSearch || quizData.subject).length > 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search subjects: math, science, physics..."
                />
                
                {showSubjectDropdown && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-gray-200">
                      <div className="text-xs text-gray-500 font-medium">💡 Predefined Subjects</div>
                    </div>
                    
                    {subjectSearch ? (
                      // Show search results
                      findMatchingSubject(subjectSearch).slice(0, 8).map((match, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            handleQuizDataChange('subject', match.name);
                            setSubjectSearch('');
                            setShowSubjectDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                        >
                          <span>{match.icon}</span>
                          <span className="font-medium">{match.name}</span>
                          {match.score === 100 && <span className="text-green-500">✓</span>}
                        </button>
                      ))
                    ) : (
                      // Show all subjects by category
                      Object.entries(getSubjectsByCategory()).map(([category, subjects]) => (
                        <div key={category}>
                          <div className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-50">
                            {category}
                          </div>
                          {subjects.map((subject, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                handleQuizDataChange('subject', subject.name);
                                setShowSubjectDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                            >
                              <span>{subject.icon}</span>
                              <span>{subject.name}</span>
                            </button>
                          ))}
                        </div>
                      ))
                    )}
                    
                    {subjectSearch && findMatchingSubject(subjectSearch).length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No matching subjects found. You can type any custom subject.
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Show selected subject */}
              {quizData.subject && (
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-sm text-green-600">Selected:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    {SUBJECTS[quizData.subject]?.icon} {quizData.subject}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleQuizDataChange('subject', '');
                      setSubjectSearch('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={quizData.difficulty}
                onChange={(e) => handleQuizDataChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                value={quizData.timeLimit}
                onChange={(e) => handleQuizDataChange('timeLimit', parseInt(e.target.value))}
                min="1"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
              <select
                value={quizData.privacy}
                onChange={(e) => handleQuizDataChange('privacy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            {quizData.privacy === 'private' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Password</label>
                <input
                  type="password"
                  value={quizData.password || ''}
                  onChange={(e) => handleQuizDataChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password for private quiz"
                />
              </div>
            )}
          </div>
        </div>

        {/* Add Questions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add Questions ({quizData.questions.length})</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Question Text *</label>
              <textarea
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your question here"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Answer Options</label>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={currentQuestion.correctAnswerIndex === index}
                      onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswerIndex: index }))}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    {option && currentQuestion.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {currentQuestion.options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Add Option
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Question List */}
        {quizData.questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Added Questions</h3>
            <div className="space-y-4">
              {quizData.questions.map((q, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{index + 1}. {q.questionText}</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {q.options.map((option, optionIndex) => (
                      <li key={optionIndex} className={optionIndex === q.correctAnswerIndex ? 'text-green-600 font-medium' : ''}>
                        {optionIndex === q.correctAnswerIndex ? '✓ ' : '• '}{option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || quizData.questions.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
