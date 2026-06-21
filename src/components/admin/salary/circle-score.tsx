export default function CircleScore({
  score,
  large = false,
}: {
  score: number;
  large?: boolean;
}) {
  const radius = large ? 54 : 47;
  const size = large ? 132 : 116;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-slate-200 dark:text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          className="text-emerald-500 transition-all duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <strong
          className={`${large ? "text-3xl" : "text-2xl"} text-slate-900 dark:text-white`}
        >
          {score}%
        </strong>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Выполнено
        </p>
      </div>
    </div>
  );
}
