export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/50 backdrop-blur-sm animate-fadeIn">

      {/* Modal Box */}
      <div className="bg-white dark:bg-brand-900 w-full max-w-md mx-4 rounded-2xl shadow-soft-lg p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-brand-300 hover:text-brand-600 dark:hover:text-brand-100 text-xl"
        >
          ✕
        </button>

        {/* Title */}
        {title && (
          <h2 className="text-xl font-semibold text-brand-900 dark:text-white mb-4">
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="space-y-3">
          {children}
        </div>

      </div>
    </div>
  );
}
