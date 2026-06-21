const iconPaths = {
  wallet: (
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a2 2 0 0 1 2 2v1.5h-5.5a3.5 3.5 0 1 0 0 7H21V17a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Zm11.5 3H22v3h-6.5a1.5 1.5 0 1 1 0-3Z" />
  ),
  gift: (
    <path d="M4 10h16v10H4V10Zm8 0v10M3 7h18v3H3V7Zm9 0H7.5a2.5 2.5 0 1 1 2.1-3.85C10.35 4.3 12 7 12 7Zm0 0h4.5a2.5 2.5 0 1 0-2.1-3.85C13.65 4.3 12 7 12 7Z" />
  ),
  calendar: (
    <path d="M6 3v3m12-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Zm3 8h2m4 0h2m-8 4h2m4 0h2" />
  ),
  warning: <path d="M12 4 3 20h18L12 4Zm0 5v5m0 3v.01" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />,
};

export type SalaryIconName = keyof typeof iconPaths;

export default function SalaryIcon({
  name,
  className = "h-7 w-7",
}: {
  name: SalaryIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}
