export function Brand() {
  return (
    <a href="#" aria-label="nexus.mobi — início" className="brand">
      <svg
        className="brand-symbol"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 31V10Q8 5 12 9L28 31Q32 36 32 30V9"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="31" r="3.5" fill="currentColor" />
        <circle cx="32" cy="9" r="3.5" fill="currentColor" />
      </svg>
      <span>
        nexus<span className="brand-dot">.</span>
        <span className="brand-suffix">mobi</span>
      </span>
    </a>
  );
}
