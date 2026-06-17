function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const levels = [
  { label: "Weak", color: "bg-red-400", textColor: "text-red-500" },
  { label: "Fair", color: "bg-orange-400", textColor: "text-orange-500" },
  { label: "Good", color: "bg-yellow-400", textColor: "text-yellow-500" },
  { label: "Strong", color: "bg-lime-400", textColor: "text-lime-500" },
  { label: "Very Strong", color: "bg-green-400", textColor: "text-green-500" },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;

  const score = getStrength(password);
  const level = levels[score];

  return (
    <div className="mb-5 -mt-3 animate-fade-in">
      <div className="flex gap-1 mb-1">
        {levels.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? level.color : "bg-gray-800"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${level.textColor}`}>{level.label}</p>
    </div>
  );
}
