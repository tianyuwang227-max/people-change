import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function SectionHeader({ action, description, title }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">Module Focus</p>
        <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">{description}</p>
      </div>
      {action}
    </div>
  );
}
