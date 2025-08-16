import React, { useState, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  quizTitle: string;
  onClose: () => void;
  onSubmit: (password: string) => void;
};

export const PasswordPromptModal: React.FC<ModalProps> = ({
  isOpen,
  quizTitle,
  onClose,
  onSubmit,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
    }
  }, [isOpen]); //

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === "") {
      setError("Password cannot be empty.");
      return;
    }
    onSubmit(password);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose} // Close modal on background click
    >
      <div
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Password Required
        </h2>
        <p>
          {" "}
          The quiz "<strong>{quizTitle}</strong>
          is private. Please enter the password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="quiz-password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="quiz-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
