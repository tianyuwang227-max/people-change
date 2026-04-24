import {
  createMockSettings,
  createMockBody,
  createMockBootstrap,
  createMockFinance,
  createMockLearning,
  createMockProjects,
  createMockReflection,
} from "@/lib/mockData";
import type {
  AppSettingsData,
  BodyModuleData,
  BootstrapPayload,
  FinanceAdvice,
  FinanceModuleData,
  LearningBlockStatus,
  LearningModuleData,
  ProjectsModuleData,
  ReflectionEntry,
  ReflectionModuleData,
} from "@/types/app";

export async function getBootstrap(): Promise<BootstrapPayload> {
  try {
    const response = await fetch("/api/bootstrap");
    if (!response.ok) {
      throw new Error(`Failed to load bootstrap data: ${response.status}`);
    }
    return (await response.json()) as BootstrapPayload;
  } catch {
    return createMockBootstrap();
  }
}

export async function toggleHabit(slug: string, date: string, completed: boolean) {
  try {
    const response = await fetch("/api/habits/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, date, completed }),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle habit: ${response.status}`);
    }

    return await response.json();
  } catch {
    return { ok: true };
  }
}

export async function getLearning(): Promise<LearningModuleData> {
  try {
    const response = await fetch("/api/learning");
    if (!response.ok) {
      throw new Error(`Failed to load learning data: ${response.status}`);
    }
    return (await response.json()) as LearningModuleData;
  } catch {
    return createMockLearning();
  }
}

export async function toggleLearningTodo(id: string, completed: boolean) {
  try {
    const response = await fetch("/api/learning/todos/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, completed }),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle todo: ${response.status}`);
    }

    return await response.json();
  } catch {
    return { ok: true };
  }
}

export async function updateLearningBlockStatus(id: string, status: LearningBlockStatus) {
  try {
    const response = await fetch("/api/learning/time-blocks/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update block status: ${response.status}`);
    }

    return await response.json();
  } catch {
    return { ok: true };
  }
}

export async function getReflection(): Promise<ReflectionModuleData> {
  try {
    const response = await fetch("/api/reflection");
    if (!response.ok) {
      throw new Error(`Failed to load reflection data: ${response.status}`);
    }
    return (await response.json()) as ReflectionModuleData;
  } catch {
    return createMockReflection();
  }
}

export async function analyzeReflection(payload: {
  summary: string;
  wins: string;
  blockers: string;
  mood: string;
}): Promise<{ ok: boolean; entry: ReflectionEntry; provider?: "openai" | "fallback" }> {
  try {
    const response = await fetch("/api/reflection/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to analyze reflection: ${response.status}`);
    }

    return (await response.json()) as { ok: boolean; entry: ReflectionEntry; provider?: "openai" | "fallback" };
  } catch {
    return {
      ok: true,
      entry: createMockReflection().history[0],
      provider: "fallback",
    };
  }
}

export async function getFinance(): Promise<FinanceModuleData> {
  try {
    const response = await fetch("/api/finance");
    if (!response.ok) {
      throw new Error(`Failed to load finance data: ${response.status}`);
    }
    return (await response.json()) as FinanceModuleData;
  } catch {
    return createMockFinance();
  }
}

export async function analyzeFinance(): Promise<{ ok: boolean; advice: FinanceAdvice; provider?: "openai" | "fallback" }> {
  try {
    const response = await fetch("/api/finance/analyze", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Failed to analyze finance data: ${response.status}`);
    }
    return (await response.json()) as { ok: boolean; advice: FinanceAdvice; provider?: "openai" | "fallback" };
  } catch {
    return {
      ok: true,
      advice: createMockFinance().advice,
      provider: "fallback",
    };
  }
}

export async function getBody(): Promise<BodyModuleData> {
  try {
    const response = await fetch("/api/body");
    if (!response.ok) {
      throw new Error(`Failed to load body data: ${response.status}`);
    }
    return (await response.json()) as BodyModuleData;
  } catch {
    return createMockBody();
  }
}

export async function getProjects(): Promise<ProjectsModuleData> {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) {
      throw new Error(`Failed to load projects data: ${response.status}`);
    }
    return (await response.json()) as ProjectsModuleData;
  } catch {
    return createMockProjects();
  }
}

export async function getSettings(): Promise<AppSettingsData> {
  try {
    const response = await fetch("/api/settings");
    if (!response.ok) {
      throw new Error(`Failed to load settings: ${response.status}`);
    }
    return (await response.json()) as AppSettingsData;
  } catch {
    return createMockSettings();
  }
}

export async function saveSettings(payload: AppSettingsData) {
  try {
    const response = await fetch("/api/settings/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to save settings: ${response.status}`);
    }
    return await response.json();
  } catch {
    return { ok: true };
  }
}
