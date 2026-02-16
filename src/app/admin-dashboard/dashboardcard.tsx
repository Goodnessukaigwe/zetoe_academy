import React from "react";

type Accent = "sky" | "emerald" | "violet" | "rose" | "amber";

type Props = {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ElementType;
  accent?: Accent;
  footer?: string;
};

const accentStyles: Record<Accent, { text: string; bg: string; ring: string; bar: string; icon: string }> = {
  sky: {
    text: "text-sky-700",
    bg: "bg-sky-50",
    ring: "ring-sky-200/60",
    bar: "bg-sky-500",
    icon: "text-sky-600",
  },
  emerald: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200/60",
    bar: "bg-emerald-500",
    icon: "text-emerald-600",
  },
  violet: {
    text: "text-violet-700",
    bg: "bg-violet-50",
    ring: "ring-violet-200/60",
    bar: "bg-violet-500",
    icon: "text-violet-600",
  },
  rose: {
    text: "text-rose-700",
    bg: "bg-rose-50",
    ring: "ring-rose-200/60",
    bar: "bg-rose-500",
    icon: "text-rose-600",
  },
  amber: {
    text: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200/60",
    bar: "bg-amber-500",
    icon: "text-amber-600",
  },
};

const DashboardCard = ({
  title,
  value,
  description,
  icon: Icon,
  accent = "sky",
  footer,
}: Props) => {
  const styles = accentStyles[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {title}
          </p>
          <p className={`mt-3 text-3xl font-semibold ${styles.text}`}>{value}</p>
          {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.bg} ring-1 ${styles.ring}`}>
            <Icon className={styles.icon} size={24} />
          </div>
        )}
      </div>
      {footer && <p className="mt-5 text-xs text-slate-400">{footer}</p>}
      <div className={`absolute inset-x-0 bottom-0 h-1 ${styles.bar}`} />
    </div>
  );
};

export default DashboardCard;
