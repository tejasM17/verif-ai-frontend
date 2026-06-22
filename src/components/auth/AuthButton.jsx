export default function AuthButton({ loading, children, type = "submit" }) {
  return (
    <button
      type={type}
      disabled={loading}
      className={`
        relative w-full py-2.5 px-5 rounded-lg font-semibold text-sm
        transition-all duration-300 overflow-hidden
        ${loading
          ? "bg-yellow-600 cursor-not-allowed text-gray-300"
          : "bg-yellow-400 text-black hover:bg-yellow-300 active:scale-[0.98] shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40"}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children}
        </span>
      )}
    </button>
  );
}
