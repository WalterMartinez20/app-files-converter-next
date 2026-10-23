"use client";

interface PasswordChecklistProps {
  password: string;
}

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const items = [
    { label: "8+ characters", met: hasMinLength },
    { label: "Uppercase (A-Z)", met: hasUppercase },
    { label: "Lowercase (a-z)", met: hasLowercase },
    { label: "Number (0-9)", met: hasNumber },
    { label: "Special symbol (!@#$...)", met: hasSpecial, colSpan: true },
  ];

  return (
    <ul className="text-xs text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-2 mt-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
      {items.map((item) => (
        <li
          key={item.label}
          className={`flex items-center gap-2 transition-colors ${
            item.colSpan ? "col-span-2" : ""
          } ${item.met ? "text-emerald-500 font-medium" : ""}`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {item.met ? "check_circle" : "radio_button_unchecked"}
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
