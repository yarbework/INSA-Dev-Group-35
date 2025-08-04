import "../../App.css";
import { useNavigate } from "react-router-dom";

function Button() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("Login")}
      className="border-3 border-blue-600 px-5 py-1 rounded-xl hover:text-white hover:bg-blue-600 transition-colors duration-200"
    >
      Login
    </button>
  );
}

export default function Header() {
  return (
    <>
      <header className="w-full flex flex-row justify-between p-7 font-sans font-bold mb-0">
        <h1>Logo</h1>

        <nav className="flex gap-20">
          <ul className="flex gap-10 text-gray-500">
            <li className="hover:text-gray-700">
              <a href="">Home</a>
            </li>
            <li className="hover:text-gray-700">
              <a href="">Exams</a>
            </li>
            <li className="hover:text-gray-700">
              <a href="">About us</a>
            </li>
          </ul>

          <Button />
        </nav>
      </header>

      <hr className="border-1 border-gray-400 mt-0" />
    </>
  );
}
