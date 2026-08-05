import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import AuthLayout from "../components/AuthLayout";

import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your finances"
    >

      {error && (
        <p className="text-rose-500 text-sm mb-4 text-center">
          {error}
        </p>
      )}

      <form
        onSubmit={handleLogin}
        className="space-y-4"
      >

        {/* Email */}
        <div className="relative">

          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-300" />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="input pl-10"
          />

        </div>

        {/* Password */}
        <div className="relative">

          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-300" />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="input pl-10"
          />

        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>

      </form>

      {/* Footer */}
      <p className="text-sm text-center mt-6 text-brand-400 dark:text-brand-300">

        Don’t have an account?{" "}

        <Link
          to="/register"
          className="text-accent-600 dark:text-accent-400 font-medium hover:underline"
        >
          Register
        </Link>

      </p>

    </AuthLayout>
  );
}
