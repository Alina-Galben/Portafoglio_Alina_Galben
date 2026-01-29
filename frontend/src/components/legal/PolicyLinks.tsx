type Props = {
  className?: string;
  linkClassName?: string;
  disabled?: boolean;
};

const IUBENDA_PRIVACY_URL = "https://www.iubenda.com/privacy-policy/82953394";
const IUBENDA_COOKIE_URL  = "https://www.iubenda.com/privacy-policy/82953394/cookie-policy";

export default function PolicyLinks({
  className = "",
  linkClassName = "",
  disabled = false,
}: Props) {
  const baseLinkClass = `
    iubenda-white iubenda-noiframe iubenda-embed
    underline hover:opacity-90
    focus:outline-none focus:ring-2 focus:ring-violet-500
    ${disabled ? "pointer-events-none opacity-60" : ""}
    ${linkClassName}
  `;

  return (
    <nav
      aria-label="Informative legali"
      className={`flex flex-wrap gap-x-4 gap-y-2 text-sm ${className}`}
    >
      <a
        href={IUBENDA_PRIVACY_URL}
        className={baseLinkClass}
        title="Privacy Policy"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => disabled && e.preventDefault()}
      >
        Privacy Policy
      </a>

      <a
        href={IUBENDA_COOKIE_URL}
        className={baseLinkClass}
        title="Cookie Policy"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => disabled && e.preventDefault()}
      >
        Cookie Policy
      </a>
    </nav>
  );
}
