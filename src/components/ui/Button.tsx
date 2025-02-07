interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export const Button = ({ onClick, disabled, loading }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-700 to-violet-800 
      hover:from-purple-800 hover:to-violet-900 text-white font-medium shadow-lg 
      hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 
      disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
  >
    {loading ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Processing...
      </>
    ) : (
      "Download"
    )}
  </button>
);
