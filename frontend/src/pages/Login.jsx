import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:5000"; //'https://kanban-oghu.onrender.com';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to login. Please check your credentials.");
      }

      const data = await response.json();
      // data.projects is an array of projects and store it in localStorage
      /*       data.user.projects.map((project) => {
        localStorage.setItem(`project-${project._id}`, JSON.stringify(project));
      }); */
      localStorage.setItem("projects", JSON.stringify(data.user.projects));
      setMessage(data.message || "Login successful");
      setForm({ email: "", password: "" });
      localStorage.setItem("isSignedUp", "true");
      navigate("/");
    } catch (error) {
      setMessage(error.message || "An error occurred. Please try again.");
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
