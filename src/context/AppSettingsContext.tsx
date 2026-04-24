import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createMockSettings } from "@/lib/mockData";
import { getSettings, saveSettings } from "@/lib/api";
import type { AppSettingsData } from "@/types/app";

interface AppSettingsContextValue {
  settings: AppSettingsData;
  isLoaded: boolean;
  refresh: () => Promise<void>;
  persist: (nextSettings: AppSettingsData) => Promise<void>;
  setLocalSettings: (nextSettings: AppSettingsData) => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettingsData>(createMockSettings());
  const [isLoaded, setIsLoaded] = useState(false);

  async function refresh() {
    const payload = await getSettings();
    setSettings(payload);
    setIsLoaded(true);
  }

  async function persist(nextSettings: AppSettingsData) {
    setSettings(nextSettings);
    setIsLoaded(true);
    await saveSettings(nextSettings);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo(
    () => ({
      settings,
      isLoaded,
      refresh,
      persist,
      setLocalSettings: setSettings,
    }),
    [settings, isLoaded],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return context;
}
