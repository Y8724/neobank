import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import AuthLayout from "../components/AuthLayout";

import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back !"
      subtitle="Log in to manage your finances"
    >

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {error}
        </p>
      )}

      <form
        onSubmit={handleLogin}
        className="space-y-4"
      >

        {/* Email */}
        <div className="relative">

          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100"
          />

        </div>

        {/* Password */}
        <div className="relative">

          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-gray-100"
          />

        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          Login
        </button>

      </form>

      {/* Footer */}
      <p className="text-sm text-center mt-6 text-gray-500">

        Don’t have an account?{" "}

        <Link
          to="/register"
          className="text-blue-600 hover:underline"
        >
          Register
        </Link>

      </p>

    </AuthLayout>
  );
}