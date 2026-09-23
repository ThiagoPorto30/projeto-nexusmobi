type SocialIconProps = { name: "instagram" | "whatsapp"; size?: number };

/** The adjacent link text supplies the accessible channel name. */
export function SocialIcon({ name, size = 24 }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.1" />
          <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <path d="M20.8 11.7a8.8 8.8 0 0 1-13 7.7L3 21l1.5-4.8a8.8 8.8 0 1 1 16.3-4.5Z" />
          <path
            d="m8.3 7.2 1.5 2.5-1.1 1.2a8.6 8.6 0 0 0 4.4 4.4l1.2-1.1 2.5 1.5c-.4 1.5-1.6 2-3 1.5-3.4-1.2-6.3-4.1-7.5-7.5-.5-1.4 0-2.6 1.5-3Z"
            fill="currentColor"
            strokeWidth=".5"
          />
        </>
      )}
    </svg>
  );
}
