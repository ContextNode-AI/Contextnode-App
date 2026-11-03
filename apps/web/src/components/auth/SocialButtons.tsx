"use client";

import { useState } from "react";

interface SocialButtonsProps {
  actionLabel?: string;
  dividerText?: string;
  onSocialClick?: (provider: "google") => void;
}

export function SocialButtons({
  actionLabel = "Continue with",
  dividerText = "Or continue with email",
  onSocialClick,
}: SocialButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleClick = (provider: "google") => {
    setLoadingProvider(provider);
    if (onSocialClick) {
      onSocialClick(provider);
    }
    setTimeout(() => {
      setLoadingProvider(null);
    }, 1200);
  };

  return (
    <div className="space-y-3.5">
      {/* Google Button */}
      <button
        type="button"
        onClick={() => handleClick("google")}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-[#25343F]/40 hover:bg-[#25343F]/70 border border-[#25343F] text-white text-sm font-medium transition-all duration-200 hover:border-[#FE7F2D]/40 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {loadingProvider === "google" ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span>{actionLabel} Google</span>
      </button>

      {/* Styled Divider */}
      <div className="relative py-2.5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#25343F]" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
          <span className="bg-[#090D14] px-3 text-slate-400">
            {dividerText}
          </span>
        </div>
      </div>
    </div>
  );
}

