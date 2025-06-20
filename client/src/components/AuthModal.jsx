import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { Eye, EyeOff } from "lucide-react"; // 👈 Eye icons
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ onClose }) => {
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 password toggle

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setForm({ name: "", email: "", password: "" });
    setMessage("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/auth/signup" : "/auth/login";

    try {
      const res = await axios.post(endpoint, form);
      if (!isSignup) {
        localStorage.setItem("accessToken", res.data.accessToken);
        setMessage("Login successful!");
        navigate('/')
        // handleClose();
      } else {
        setMessage("Signup successful! Now log in.");
        setIsSignup(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-8 rounded-2xl shadow-xl w-96 relative transform transition-all duration-300 ${
          isVisible ? "scale-100" : "scale-90"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          {isSignup ? "Create Account" : "Sign In to Continue"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full text-black border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full text-black border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* 👁 Password Field with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full text-black border border-gray-300 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 px-2 flex items-center text-gray-600 hover:text-indigo-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p
          onClick={toggleMode}
          className="text-sm text-center text-indigo-600 mt-6 cursor-pointer hover:underline"
        >
          {isSignup
            ? "Already have an account? Sign In"
            : "New here? Create an account"}
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
