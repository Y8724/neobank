import { FaUniversity, FaLock, FaChartLine } from "react-icons/fa";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-100 dark:bg-gray-900">

      {/* HERO SECTION */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12">

        <div className="max-w-md space-y-6">

          <h1 className="flex items-center gap-3 text-4xl font-bold">
            <FaUniversity />
            NeoBank
          </h1>

          <p className="text-xl opacity-90">
            Smart banking for modern life.
          </p>

          <div className="space-y-3 text-sm opacity-90">

            <p className="flex items-center gap-2">
              <FaLock /> Secure transactions
            </p>

            <p className="flex items-center gap-2">
              <FaChartLine /> Track your finances
            </p>

            <p className="flex items-center gap-2">
              <FaUniversity /> All accounts in one place
            </p>

          </div>

        </div>

      </div>

      {/* FORM SECTION */}
      <div className="flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

          <h2 className="text-3xl font-bold mb-2 text-center dark:text-gray-100">
            {title}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
            {subtitle}
          </p>

          {children}

        </div>

      </div>

    </div>
  );
}