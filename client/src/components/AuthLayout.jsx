import { FaUniversity, FaLock, FaChartLine, FaShieldAlt } from "react-icons/fa";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-amber-50/40 dark:bg-brand-950">

      {/* HERO SECTION */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white p-12 relative overflow-hidden">

        <div className="absolute w-72 h-72 rounded-full bg-accent-500/20 blur-3xl -top-10 -left-10" />
        <div className="absolute w-72 h-72 rounded-full bg-brand-400/20 blur-3xl bottom-0 right-0" />

        <div className="max-w-md space-y-6 relative">

          <h1 className="flex items-center gap-3 text-4xl font-bold">
            <span className="p-2.5 rounded-xl bg-white/10">
              <FaUniversity />
            </span>
            NeoBank
          </h1>

          <p className="text-xl text-brand-100">
            Smart banking for modern life.
          </p>

          <div className="space-y-3 text-sm text-brand-100">

            <p className="flex items-center gap-2">
              <FaShieldAlt className="text-accent-400" /> Bank-grade security
            </p>

            <p className="flex items-center gap-2">
              <FaLock className="text-accent-400" /> Encrypted transactions
            </p>

            <p className="flex items-center gap-2">
              <FaChartLine className="text-accent-400" /> AI-powered financial insights
            </p>

          </div>

        </div>

      </div>

      {/* FORM SECTION */}
      <div className="flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white dark:bg-brand-900 rounded-2xl shadow-soft-lg p-8 animate-fadeIn">

          <h2 className="text-3xl font-bold mb-2 text-center text-brand-900 dark:text-white">
            {title}
          </h2>

          <p className="text-brand-400 dark:text-brand-300 text-center mb-6">
            {subtitle}
          </p>

          {children}

        </div>

      </div>

    </div>
  );
}
