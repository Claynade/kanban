import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", form);
      setMessage(response.data.message || "Login successful");
      setForm({ email: "", password: "" });
      setUser(response.data.user); // update global auth state
      navigate("/projects");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "An error occurred. Please try again."
      );
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1d0f27] to-[#2c3364] relative overflow-hidden">
      <div className="bg-white h-[500px] max-w-md w-1/2 rounded-l-lg overflow-hidden">
        <img
          src="/reg-bg.png"
          alt="login"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-white p-8 rounded-r-lg h-[500px]  shadow-md w-1/2 max-w-md relative z-10">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">
          Login to Your Account
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-white focus:ring-blue-400"
              placeholder="Enter your email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-white focus:ring-blue-400"
              placeholder="Create a password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md text-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message == "Login successful"
                ? "font-bold text-green-600"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
