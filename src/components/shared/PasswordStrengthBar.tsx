"use client";

interface PasswordStrengthBarProps {
  strength: number; // 0 to 100
  passwordLength: number;
}

export function PasswordStrengthBar({
  strength,
  passwordLength,
}: PasswordStrengthBarProps) {
  const getStrengthLabel = () => {
    if (passwordLength === 0) return "";
    if (strength <= 40) return "Weak";
    if (strength <= 60) return "Fair";
    if (strength <= 80) return "Strong";
    return "Very Strong";
  };

  const getStrengthBgColor = () => {
    if (passwordLength === 0) return "bg-slate-200 dark:bg-slate-700";
    if (strength <= 20) return "bg-rose-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-amber-500";
    if (strength <= 80) return "bg-lime-500";
    return "bg-emerald-500";
  };

  const getStrengthTextColor = () => {
    if (passwordLength === 0) return "text-slate-400";
    if (strength <= 20) return "text-rose-500";
    if (strength <= 40) return "text-orange-500";
    if (strength <= 60) return "text-amber-500";
    if (strength <= 80) return "text-lime-500";
    return "text-emerald-500";
  };

  // Safe percentage without inline style
  const widthPercent = passwordLength === 0 ? 0 : Math.max(strength, 8);

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Strength:</span>
        <span className={`font-bold ${getStrengthTextColor()}`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${getStrengthBgColor()}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
}
