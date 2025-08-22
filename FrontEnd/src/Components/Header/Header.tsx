import "../../App.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { LoginButton, CreateQuizButton } from "../../Components/Buttons";

async function logout(setUser) {
  await axios.post(
    "http://localhost:4000/api/endPoints/logout",
    {},
    { withCredentials: true }
  );
  window.location.reload();
  setUser(null);
}

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/endPoints/me", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) setUser(res.data.user);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, setUser };
}

export default function Header() {
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuRef = useRef(null);

  const loggedIn = !!user;

  const renderUserMenu = () => {
    if (!loggedIn) return null;

    const commonItems = [
      { name: "Profile", link: "/profile" },
      { name: "Logout", action: () => logout(setUser) },
    ];

    const teacherItems = [
      { name: "Create Quiz", link: "/createQuiz" },
      { name: "Your Quizzes", link: "/yourQuizzes" },
      { name: "Reports", link: "/reports" },
    ];

    const items =
      user.role === "teacher" ? [...teacherItems, ...commonItems] : commonItems;

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-gray-800 font-bold hover:text-blue-600 transition-colors"
        >
          {user.username}
        </button>
        {isDropdownOpen && (
          <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition-colors"
                onClick={() => {
                  setIsDropdownOpen(false);
                  if (item.action) item.action();
                }}
              >
                {item.link ? (
                  <Link to={item.link} className="text-gray-800">
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg text-white">
      {!isMenuOpen && (
        <Link to="/" className="text-2xl font-bold">
          Quiz<span className="text-yellow-300">Geek</span>
        </Link>
      )}

      <nav className="hidden md:flex items-center gap-8">
        <ul className="flex gap-8 font-semibold">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="../exams">Exams</Link>
          </li>
          <li>
            <Link to="../about">About Us</Link>
          </li>
        </ul>

        {!loggedIn && (
          <>
            <LoginButton loggedIn={loggedIn} onLogout={() => logout(setUser)} />
            <CreateQuizButton loggedIn={loggedIn} />
          </>
        )}

        {loggedIn && renderUserMenu()}
      </nav>

      <div className="md:hidden relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="open menu"
          className="text-white focus:outline-none"
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

        {isMenuOpen && (
          <div className="mt-2" ref={menuRef}>
            <nav className="w-full bg-white border border-gray-300 flex flex-col items-center rounded-lg shadow-lg">
              <ul className="flex flex-col gap-2 p-4 text-gray-800 font-semibold w-full items-center">
                <li className="w-full">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full block px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-all duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="../exams"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full block px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-all duration-200"
                  >
                    Exams
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="../about"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full block px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-all duration-200"
                  >
                    About
                  </Link>
                </li>

                {!loggedIn && (
                  <>
                    <li className="w-full">
                      <LoginButton
                        loggedIn={loggedIn}
                        onLogout={() => logout(setUser)}
                      />
                    </li>
                    <li className="w-full">
                      <CreateQuizButton loggedIn={loggedIn} />
                    </li>
                  </>
                )}

                {loggedIn && (
                  <>
                    {user.role === "teacher" && (
                      <>
                        <li className="w-full">
                          <Link
                            to="/createQuiz"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full block px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-all duration-200"
                          >
                            Create Quiz
                          </Link>
                        </li>
                        <li className="w-full">
                          <Link
                            to="/yourQuizzes"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full block px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-all duration-200"
                          >
                            Your Quizzes
                          </Link>
                        </li>
                        <li className="w-full">
                          <Link
                            to="/reports"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full block px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-all duration-200"
                          >
                            Reports
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="w-full">
                      <Link
                        to="../profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full block px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-all duration-200"
                      >
                        Profile
                      </Link>
                    </li>
                    <li className="w-full">
                      <button
                        onClick={() => logout(setUser)}
                        className="w-full block px-4 py-2 rounded-lg text-center hover:bg-blue-100 transition-all duration-200"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
