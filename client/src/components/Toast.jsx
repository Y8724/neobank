export default function Toast({ message, type, onClose }) {

  if (!message) return null;

  const colors = {
    success: "bg-emerald-600",
    error: "bg-rose-600",
    info: "bg-brand-700",
  };

  return (
    <div
      className={`
        fixed bottom-5 right-5 z-50
        text-white px-4 py-3 rounded-xl shadow-soft-lg
        animate-fadeIn
        ${colors[type] || colors.info}
      `}
    >

      <div className="flex items-center gap-3">

        <span>{message}</span>

        <button
          onClick={() => onClose?.()}
          className="font-bold ml-2"
        >
          ✕
        </button>

      </div>

    </div>
  );
}
