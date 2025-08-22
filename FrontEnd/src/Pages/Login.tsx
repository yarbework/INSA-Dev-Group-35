import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import PageWrapper from "../Components/wrapper/PageWrapper";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/endPoints/login",
        loginData,
        { withCredentials: true }
      );
      if (res.data.success) navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  return (
    <PageWrapper>
      <div className="fixed top-4 left-4 z-50">
        <Link to="/" className="text-2xl font-bold">
          Quiz<span className="text-yellow-300">Geek</span>
        </Link>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-blue-700">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Log in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md"
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full py-2 px-4 border rounded-md mt-4 bg-white hover:bg-gray-50"
            >
              <FcGoogle className="mr-2" size={24} />
              Login with Google
            </button>
            <Link to="/signUp" className="mt-4 block text-center text-blue-600">
              Create your account
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
