import { useState } from "react";
import { ChevronDown } from "lucide-react";

function More() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col justify-center min-h-screen px-10 py-20">
      <h1 className="text-3xl font-bold mb-8">More About the Quiz App</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-sm mb-4">
          This app was built to help both teachers and students stay connected and engaged with learning — even outside of school hours. Whether it’s after class, on weekends, or during school breaks, students can stay on track while teachers stay informed.
        </p>
        <p className="text-sm mb-4">
          The goal is simple: to support learning <strong>anytime, anywhere</strong>, and make sure <strong>no student falls behind</strong>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">For Teachers</h2>
        <ul className="list-disc list-inside text-sm pl-5 mb-4">
          <li>Create and publish quizzes on any topic</li>
          <li>Organize questions by subject, grade, and difficulty</li>
          <li>Schedule quizzes ahead of time</li>
          <li>Track which students completed quizzes</li>
          <li>Analyze student performance on each question</li>
          <li>See class-wide trends and individual strengths/weaknesses</li>
        </ul>
        <p className="text-sm mb-4">
          This allows teachers to monitor understanding and give better support — even when they’re not in the classroom with their students.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">For Students</h2>
        <p className="text-sm mb-4">
          This app gives students the tools to <strong>take charge of their own learning</strong>.
        </p>
        <ul className="list-disc list-inside text-sm pl-5 mb-4">
          <li>Access quizzes from any of their teachers</li>
          <li>Receive instant feedback after each quiz</li>
          <li>View correct answers and explanations</li>
          <li>Track their progress over time — including scores, speed, accuracy, and improvement</li>
          <li>Identify their weak areas and focus on them</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Powered by AI for Smarter Learning</h2>
        <p className="text-sm mb-4">
          Our app uses <strong>Artificial Intelligence (AI)</strong> to help students grow faster and more effectively.
        </p>
        <ul className="list-disc list-inside text-sm pl-5 mb-4">
          <li>Analyzes student performance in real time</li>
          <li>Detects patterns in mistakes or slow responses</li>
          <li>Suggests areas to review based on the student’s results</li>
          <li>Gives personalized feedback after each quiz</li>
          <li>Recommends specific practice questions to improve weak areas</li>
        </ul>
        <p className="text-sm mb-4">
          This means every student gets a <strong>personalized learning experience</strong>, just like having a smart study coach that knows exactly what they need to work on.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal list-inside text-sm pl-5 mb-4 space-y-2">
          <li>Teachers upload quizzes to the platform</li>
          <li>Students log in and choose available quizzes to take</li>
          <li>
            After completing a quiz, students receive:
            <ul className="list-disc list-inside ml-6 text-sm pl-2">
              <li>Instant scores</li>
              <li>Correct answers and explanations</li>
              <li>Feedback from the AI</li>
            </ul>
          </li>
          <li>Teachers get reports on student progress</li>
          <li>Students can review their full performance history anytime</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Why This Matters</h2>
        <p className="text-sm mb-4">
          In traditional classrooms, it’s hard to tell if students are studying effectively when they’re not at school. This app solves that by:
        </p>
        <ul className="list-disc list-inside text-sm pl-5 mb-4">
          <li>Giving teachers <strong>visibility into student learning</strong></li>
          <li>Giving students <strong>control over their learning path</strong></li>
          <li>Providing <strong>data-backed feedback and support</strong></li>
        </ul>
        <p className="text-sm mb-4">
          It’s not just about testing — it’s about <strong>continuous improvement</strong>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Built for the Future of Learning</h2>
        <p className="text-sm mb-4">We’re actively improving the platform. Here’s what’s coming soon:</p>
        <ul className="list-disc list-inside text-sm pl-5 mb-4">
          <li>Leaderboards and friendly challenges</li>
          <li>Study streaks and achievements</li>
          <li>AI-powered daily review quizzes</li>
          <li>Parent and school dashboards</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
        <p className="text-sm mb-4">
          Whether you're a teacher who wants to support your students better, or a student who wants to improve smarter, this app is here for you.
        </p>
        <p className="text-sm">
          Together, let’s make learning more <strong>connected, personalized, and effective</strong> — no matter where you are.
        </p>
      </section>
    </div>
  );
}


export default function About() {
  const [showMore, setShowMore] = useState(false);

  const handleClick = () => {
    setShowMore(!showMore);
  };



  return (
    <>
      <div className="bg-white">
        <div className="max-w-5xl mx-auto flex flex-col justify-center min-h-screen px-10 py-20">
          <h1 className="text-5xl mb-10 text-center font-bold">About Us</h1>
          
          <section className="mb-10">
            <h2 className="text-3xl mb-4 font-semibold">Our Mission</h2>
            <p className="text-sm">
              <span className="text-yellow-300 font-bold">|</span> Our mission is to empower learners by providing accessible and engaging educational resources that inspire curiosity and growth.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl mb-4 font-semibold">Our Values</h2>
            <ul className="list-disc list-inside text-sm pl-5">
              <li>Accessibility: Learning should be available to everyone.</li>
              <li>Engagement: We create interactive content that captivates.</li>
              <li>Integrity: We uphold honesty and transparency in our resources.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl mb-4 font-semibold">What You Should Expect</h2>
            <p className="text-sm mb-4">
              This quiz app is designed to strengthen learning beyond the classroom by helping teachers and students stay connected, even when school is not in session.
            </p>
            <p className="text-sm mb-4">
              Teachers can create and share quizzes with their students, helping to monitor progress and ensure everyone is following along with lessons.
            </p>
            <p className="text-sm mb-4">
              Students can access quizzes released by multiple teachers, allowing them to:
            </p>
            <ul className="list-disc list-inside text-sm pl-5 mb-4">
              <li>Practice key concepts from their lessons</li>
              <li>Get instant feedback on their performance</li>
              <li>Review at their own pace, anytime and anywhere</li>
            </ul>
            <p className="text-sm">
              This app empowers both teachers and students with the tools they need for active, flexible, and focused learning.
            </p>
          </section>

          

          {showMore && <More/>}

          <div className="flex items-center justify-center mt-10">
            <button
              className="flex text-yellow-300 px-4 py-2 rounded mt-4 hover:bg-yellow-200 transition"
              onClick={handleClick}
            >
              <ChevronDown />
              {!showMore ? "Learn More" : "Show less"}
            </button>
          </div>
            </div>
      </div>
    </>
  );
}
