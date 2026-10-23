"use client";

interface ToolPageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  className?: string;
}

export function ToolPageHeader({
  title,
  subtitle,
  badge,
  className = "",
}: ToolPageHeaderProps) {
  return (
    <div className={`text-center mb-8 md:mb-10 animate-in fade-in duration-300 ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-3">
          {badge}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-3">
        {title}
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
