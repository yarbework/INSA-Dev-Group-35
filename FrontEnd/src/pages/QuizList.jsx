import React, { useState, useEffect } from 'react';
import QuizCard from '../components/QuizCard';
import { api } from '../utils/api';
import { SUBJECTS, findMatchingSubject, getSubjectsByCategory } from '../constants/subjects';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    difficulty: '',
    searchTerm: ''
  });
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, filters.subject, filters.difficulty, filters.searchTerm]);

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

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      params.append('page', currentPage.toString());

      const response = await api.get(`/quizzes?${params.toString()}`);
      setQuizzes(response.data.quizzes || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ subject: '', difficulty: '', searchTerm: '' });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Quizzes</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg mb-8">
        {/* Smart Subject Filter */}
        <div className="relative subject-dropdown-container">
          <input
            type="text"
            value={filters.subject}
            onChange={(e) => {
              handleFilterChange('subject', e.target.value);
              setShowSubjectDropdown(true);
            }}
            onFocus={() => setShowSubjectDropdown(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
            placeholder="🔍 Search subjects: math, science..."
          />
          
          {showSubjectDropdown && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-64">
              <div className="p-2 border-b border-gray-200">
                <div className="text-xs text-gray-500 font-medium">💡 Popular Subjects</div>
              </div>
              
              {/* Quick filter options */}
              <button
                type="button"
                onClick={() => {
                  handleFilterChange('subject', '');
                  setShowSubjectDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 font-medium text-blue-600"
              >
                🌟 All Subjects
              </button>
              
              {/* Show predefined subjects grouped by category */}
              {Object.entries(getSubjectsByCategory()).map(([category, subjects]) => (
                <div key={category}>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-50">
                    {category}
                  </div>
                  {subjects.slice(0, 3).map((subject, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        handleFilterChange('subject', subject.name);
                        setShowSubjectDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2"
                    >
                      <span>{subject.icon}</span>
                      <span>{subject.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
          placeholder="🔍 Search quiz titles, authors..."
        />

        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Difficulty Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {(filters.subject || filters.difficulty || filters.searchTerm) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Quiz Grid */}
      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 mb-4">No quizzes found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later for new quizzes.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded ${
                      page === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizList;
