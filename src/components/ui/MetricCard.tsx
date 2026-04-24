import { motion } from "framer-motion";
import type { HeroStat } from "@/types/app";

const toneClassMap: Record<HeroStat["tone"], string> = {
  gold: "from-gold/20 to-gold/0 text-gold",
  teal: "from-pulse/20 to-pulse/0 text-pulse",
  orange: "from-ember/20 to-ember/0 text-ember",
  slate: "from-steel/20 to-steel/0 text-white",
};

export function MetricCard({ detail, label, tone, value }: HeroStat) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="panel-soft relative overflow-hidden p-5"
      transition={{ duration: 0.18 }}
    >
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${toneClassMap[tone]}`} />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.28em] text-steel">{label}</p>
        <div className="mt-4 text-3xl font-bold text-white">{value}</div>
        <p className="mt-2 text-sm text-steel">{detail}</p>
      </div>
    </motion.div>
  );
}
