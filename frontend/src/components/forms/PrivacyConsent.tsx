type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
};

const IUBENDA_PRIVACY_URL = "https://www.iubenda.com/privacy-policy/82953394";
const IUBENDA_COOKIE_URL = "https://www.iubenda.com/privacy-policy/82953394/cookie-policy";

export default function PrivacyConsent({
  checked,
  onChange,
  error,
  disabled = false,
  className = "",
  textClassName = "text-gray-700",
}: Props) {
  const errorId = error ? "privacy-consent-error" : undefined;

  return (
    <div className={`mt-4 ${className}`}>
      <label
        className={`flex items-start gap-3 text-sm leading-5 ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-2 focus:ring-violet-500"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />

        <span className={textClassName}>
          Ho letto e accetto la{" "}
          <a
            href={IUBENDA_PRIVACY_URL}
            className="iubenda-white iubenda-noiframe iubenda-embed underline hover:opacity-90"
            title="Privacy Policy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => disabled && e.preventDefault()}
          >
            Privacy Policy
          </a>{" "}
          e la{" "}
          <a
            href={IUBENDA_COOKIE_URL}
            className="iubenda-white iubenda-noiframe iubenda-embed underline hover:opacity-90"
            title="Cookie Policy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => disabled && e.preventDefault()}
          >
            Cookie Policy
          </a>
          .
        </span>
      </label>

      {error ? (
        <p id="privacy-consent-error" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
