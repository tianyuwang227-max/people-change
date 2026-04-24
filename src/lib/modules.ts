import {
  Activity,
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardCheck,
  Cog,
  Home,
  LucideIcon,
  NotebookPen,
  Rocket,
  TimerReset,
} from "lucide-react";
import type { ModuleId } from "@/types/app";

export interface ModuleNavItem {
  id: ModuleId;
  title: string;
  subtitle: string;
  path: string;
  icon: LucideIcon;
}

export const moduleNav: ModuleNavItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "快速查看",
    path: "/",
    icon: Home,
  },
  {
    id: "habits",
    title: "习惯打卡",
    subtitle: "执行与节奏",
    path: "/habits",
    icon: ClipboardCheck,
  },
  {
    id: "learning",
    title: "学习管理",
    subtitle: "时间块与待办",
    path: "/learning",
    icon: ChartNoAxesCombined,
  },
  {
    id: "reflection",
    title: "AI 复盘",
    subtitle: "提问与分析",
    path: "/reflection",
    icon: NotebookPen,
  },
  {
    id: "finance",
    title: "财务",
    subtitle: "现金流与目标",
    path: "/finance",
    icon: CircleDollarSign,
  },
  {
    id: "body",
    title: "身体数据",
    subtitle: "状态追踪",
    path: "/body",
    icon: Activity,
  },
  {
    id: "projects",
    title: "项目与作品",
    subtitle: "输出与沉淀",
    path: "/projects",
    icon: Rocket,
  },
  {
    id: "settings",
    title: "设置",
    subtitle: "系统与终端",
    path: "/settings",
    icon: Cog,
  },
];

export const upcomingModules: Record<Exclude<ModuleId, "dashboard" | "habits" | "settings">, string[]> = {
  learning: ["时间块编排", "今日待办推进", "本周总目标视图"],
  reflection: ["结构化复盘输入", "AI 连环追问", "明日行动建议"],
  finance: ["收支账本", "年度目标", "50 万进度条"],
  body: ["体重体脂趋势", "围度记录", "饮食与精力联动"],
  projects: ["项目档案", "作品集卡片", "问题与解法沉淀"],
};

export const settingsPreview = [
  "自定义习惯追踪项",
  "模块显示顺序",
  "主题与品牌文案",
  "未来 Passkey 登录预留",
  "终端日志与错误提示",
  "AI 模型和调用策略",
];
