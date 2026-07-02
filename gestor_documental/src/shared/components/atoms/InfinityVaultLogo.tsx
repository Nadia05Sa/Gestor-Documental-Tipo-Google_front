export const InfinityVaultLogo = ({ className = 'justify-center' }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M7.5 14C7.5 10.5 9.5 8 12 8C14 8 15.5 9.2 16.5 11C17.5 9.2 19 8 21 8C23.5 8 25.5 10.5 25.5 14C25.5 17.5 23.5 20 21 20C19 20 17.5 18.8 16.5 17C15.5 18.8 14 20 12 20C9.5 20 7.5 17.5 7.5 14Z"
        stroke="url(#infinity-gradient-logo)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="infinity-gradient-logo" x1="7" y1="8" x2="26" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
    <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <span style={{ color: '#1e3a5f' }}>Infinity </span>
      <span style={{ color: '#8b5cf6' }}>Vault</span>
    </span>
  </div>
);
