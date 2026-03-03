import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import AuthLayout from "../components/AuthLayout";

import {
  FaUser,
  FaEnvelope,
  FaLock
} from "react-icons/fa";

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start managing your money today"
    >

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Name */}
        <div className="relative">

          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
          />

        </div>

        {/* Email */}
        <div className="relative">

          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
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
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
          />

        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          Create Account
        </button>

      </form>

      {/* Footer */}
      <p className="text-sm text-center mt-6 text-gray-500">

        Already have an account?{" "}

        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          Login
        </Link>

      </p>

    </AuthLayout>
  );
}
