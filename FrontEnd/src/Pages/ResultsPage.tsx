import React ,{useEffect}from 'react'
import {useLocation, useNavigate, Link} from 'react-router-dom'
import type { Quiz as BaseQuiz } from '../components/quiz/QuizCard';


type QuizWithQuestions = BaseQuiz & {
    questions: {
        questionText: string;
    options: { text: string; _id: string }[];
    correctAnswerIndex: number;
    _id: string;
    }[];
}

interface ResultsData{
    quizTitle: string;
    totalQuestions: number;
  correctAnswersCount: number;
  fullQuiz: QuizWithQuestions; // This will contain the questions with correct answers from stricter type
    userAnswers: (number| null)[];
}

interface LocationState {
    results: ResultsData;
}

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {results} = (location.state as LocationState) || {};
    const {totalQuestions, correctAnswersCount, fullQuiz, userAnswers} = results || {};



    //this redirects to exams, of the user trys to access the page directly
    useEffect(()=> {
        if (!results){
            alert ("No result data found. Redirecting to the exams Page.")
            navigate('/exams');
        }
    }, [results, navigate])


    //calculation takes place in backend the score 
    const percentage = totalQuestions > 0 ? Math.round((correctAnswersCount/totalQuestions)*100) : 0;
    
    //renders nothing to avoid errors, when the data is not ready.
    if (!results){
        return null;
    }
    const quiz = fullQuiz; 
  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8'>
        <div className='max-w-4xl mx-auto'>
            <div className='bg-white p-8 rounded-2xl shadow-xl text-center'>
                <h1 className='text-4xl font-extrabold text-gray-800'>Quiz Results</h1>
                <p className='mt-2 text-lg text-gray-600'>Results for: <strong>{quiz.title}</strong></p>
                <div className='mt-8'>
                    <p className='text-xl text-gray-700'>You Scored</p>
                    <p className='text-7xl font-bold text-blue-600 my-2'>{correctAnswersCount} <span className='text-4xl text-gray-500'>{totalQuestions}</span></p>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-4 mt-6'>
                    <div className='bg-blue-600 h-4 rounded-full'
                    style={{width: `${percentage}%`}}>

                    </div>
                </div>
                <p className='text-lg font-semibold mt-2'>{percentage}%</p>
            </div>
            {/* Detailed Answer Review */}

            <div className='mt-10'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Review Your Answers</h2>
                <div className='space-y-6'>
                    {quiz.questions.map((question, index)=> {
                        const userAnswerIndex = userAnswers[index];
                        const correctAnswerIndex = question.correctAnswerIndex;
                        const isCorrect = userAnswerIndex ===correctAnswerIndex

                        return(
                             <div key={index} className={`p-6 rounded-lg shadow-md ${isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                  <p className="font-bold text-lg text-gray-800">{index + 1}. {question.questionText}</p>
                  
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <p className="text-sm">
                      <span className="font-semibold">Your Answer: </span>
                      {userAnswerIndex !== null ? (
                        <span className={!isCorrect ? 'text-red-700 font-bold' : ''}>
                          {question.options[userAnswerIndex]?.text || "No answer provided"}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">You did not answer this question.</span>
                      )}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Correct Answer: </span>
                        <span className="text-green-700 font-bold">
                          {question.options[correctAnswerIndex]?.text}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
                    })}

                </div>
            </div>
            {/* Actions Button */}

            <div className='mt-10 flex justify-center gap-4'>
                
                <Link
                to='/exams'
                className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors'> Back To Exams</Link>

            </div>

        </div>
    </div>
  )
}

export default ResultsPage