import { useState } from "react";
import "../../App.css";
import { Link } from "react-router-dom";
// function LoginButton() {
//   const navigate = useNavigate();
//   return (
//     <button
//       onClick={() => navigate("/login")}
//       className="border-2 border-blue-600 px-5 py-2 rounded-lg font-semibold text-blue-600 hover:text-white hover:bg-blue-600 transition-colors duration-300"
//     >
//       Login
//     </button>
//   );
// }

// const buttons = [
//   { href: "/login", label: "Login" },
//   { href: "/signUp", label: "SignUp" },
// ];
import Buttons from "../buttons";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <header className="w-full flex flex-row justify-between items center p-6  border-b border-gray-200 relative">
        <Link to="/" className="text-xl font-bold">
          Quiz<span className="text-blue-600">Geek</span>
        </Link>

        {/* widescreen navigation */}

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

          {/* <LoginButton /> */}
          <Buttons />
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
                d={
                  isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
                }
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
              <li>
                {/* <LoginButton /> */}
                <Buttons />
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
