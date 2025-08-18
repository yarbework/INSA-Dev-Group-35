import { useNavigate } from "react-router-dom";

type LoginButtonProps = {
  loggedIn: boolean;
  onLogout: () => void;
};

export function LoginButton({ loggedIn, onLogout }: LoginButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (loggedIn ? onLogout() : navigate("/login"))}
      className="w-full md:w-auto px-5 py-2 rounded-lg font-semibold transition-colors duration-300 border-2 border-blue-600 text-gray-600 hover:bg-blue-700 hover:text-white"
    >
      {loggedIn ? "Logout" : "Login"}
    </button>
  );
}

export function CreateQuizButton({ loggedIn }: { loggedIn: boolean }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/CreateQuiz")}
      className={
        loggedIn
          ? "hidden"
          : "w-full md:w-auto px-5 py-2 rounded-lg font-semibold transition-colors duration-300 bg-blue-600 text-white hover:bg-white border-2 border-blue-600 hover:text-gray-600"
      }
      // optionally disable if not logged in
      title={!loggedIn ? "You must be logged in to create a quiz" : ""}
    >
      Create Quiz
    </button>
  );
}
