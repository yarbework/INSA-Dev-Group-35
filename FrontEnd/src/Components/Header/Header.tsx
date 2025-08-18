import "../../App.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoginButton, CreateQuizButton } from "../../Components/Buttons";

async function logout(setUser: React.Dispatch<React.SetStateAction<any>>) {
  // window.location.reload();
  await axios.post(
    "http://localhost:4000/api/endPoints/logout",
    {},
    { withCredentials: true }
  );

  setUser(false);
}

function useAuth() {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/endPoints/me", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          setUser(res.data.user);
        } else {
          setUser(false);
        }
      })
      .catch(() => setUser(false))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, setUser };
}

export default function Header() {
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loggedIn = user;

  return (
    <header className="w-full flex flex-row justify-between items-center p-6 border-b border-gray-200 relative">
      <Link to="/" className="text-xl font-bold">
        Quiz<span className="text-blue-600">Geek</span>
      </Link>

      <nav className="hidden md:flex items-center gap-12">
        <ul className="flex gap-8 text-gray-600 font-semibold">
          <li className="hover:text-blue-700 transition-colors">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-blue-700 transition-colors">
            <Link to="../exams">Exams</Link>
          </li>
          <li className="hover:text-blue-700 transition-colors">
            <Link to="../about">About us</Link>
          </li>
        </ul>

        <LoginButton loggedIn={loggedIn} onLogout={() => logout(setUser)} />
        <CreateQuizButton loggedIn={loggedIn} />
      </nav>

      {/* mobile navigation */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
      </div>

      {/* mobile menu */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white border-b border-gray-200 md:hidden">
          <ul className="flex flex-col gap-6 items-center p-6 text-gray-600 font-semibold">
            <li className="hover:text-blue-600 transition-colors">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="hover:text-blue-600 transition-colors">
              <Link to="../exams" onClick={() => setIsMenuOpen(false)}>
                Exams
              </Link>
            </li>
            <li className="hover:text-blue-600 transition-colors">
              <Link to="../about" onClick={() => setIsMenuOpen(false)}>
                About us
              </Link>
            </li>
            <li className="flex gap-2 flex-col">
              <LoginButton
                loggedIn={loggedIn}
                onLogout={() => logout(setUser)}
              />
              <CreateQuizButton loggedIn={loggedIn} />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
