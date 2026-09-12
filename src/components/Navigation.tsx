import {
  Archive,
  BookOpen,
  Code2,
  FileBox,
  History,
  Image as ImageIcon,
  Languages,
  Palette,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import { translations } from '../i18n/translations';
import { AppSettings, NavTabId, StyleId, ThemeId } from '../types';
import { getThemeClasses } from '../utils/themeStyles';
import { AnimeMascot } from './AnimeDecorations';

interface NavigationProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenWelcome: () => void;
  onOpenLogs?: () => void;
  logsCount?: number;
}

export function Navigation({
  activeTab,
  onSelectTab,
  settings,
  updateSettings,
  onOpenWelcome,
  onOpenLogs,
  logsCount = 0,
}: NavigationProps) {
  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);

  const tabs: Array<{ id: NavTabId; num: number; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'pack', num: 1, label: t.tabResourcePack, icon: Archive },
    { id: 'converter', num: 2, label: t.tabConverter, icon: ImageIcon },
    { id: 'json', num: 3, label: t.tabJsonEditor, icon: Code2 },
    { id: 'settings', num: 4, label: t.tabSettings, icon: SettingsIcon },
    { id: 'history', num: 5, label: t.tabHistory, icon: History },
    { id: 'help', num: 6, label: t.tabHelp, icon: BookOpen },
  ];

  const themes: Array<{ id: ThemeId; name: string; color: string }> = [
    { id: 'warm-sunset', name: 'Warm Sunset', color: 'bg-gradient-to-r from-rose-500 to-amber-500' },
    { id: 'forest-night', name: 'Forest Night', color: 'bg-gradient-to-r from-emerald-600 to-teal-400' },
    { id: 'purple-cyan', name: 'Purple Cyan', color: 'bg-gradient-to-r from-purple-500 to-cyan-400' },
  ];

  const styles: Array<{ id: StyleId; name: string }> = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'nature', name: 'Nature' },
    { id: 'minimal', name: 'Minimal' },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b ${themeCls.cardBorder} bg-neutral-950/80 backdrop-blur-md`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWelcome}
            title="О программе RESPSOA"
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg ${themeCls.accentBg} shadow-md`}>
              <FileBox className="h-6 w-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-white text-lg">RESPSOA</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/30">
                  {t.versionBadge}
                </span>
                <AnimeMascot
                  theme={settings.theme}
                  size="sm"
                  className="transition-transform group-hover:scale-125"
                />
              </div>
              <p className="text-[11px] text-neutral-400 font-medium hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all rounded-md ${
                  isActive
                    ? `${themeCls.accentBg} shadow-sm`
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-60 hidden md:inline ml-0.5">Ctrl+{tab.num}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick controls: Theme, Style, Lang */}
        <div className="flex items-center gap-2">
          {/* Quick theme selector */}
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 p-0.5">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => updateSettings({ theme: th.id })}
                title={`Тема: ${th.name}`}
                className={`h-5 w-5 rounded-md mx-0.5 transition-transform ${th.color} ${
                  settings.theme === th.id ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>

          {/* Quick style selector */}
          <div className="hidden lg:flex items-center rounded-lg border border-neutral-800 bg-neutral-900/90 px-1.5 py-0.5 text-[11px] text-neutral-300">
            <Sparkles className="h-3 w-3 mr-1 text-amber-400" />
            <select
              value={settings.style}
              onChange={(e) => updateSettings({ style: e.target.value as StyleId })}
              className="bg-transparent text-neutral-200 outline-none cursor-pointer"
            >
              {styles.map((st) => (
                <option key={st.id} value={st.id} className="bg-neutral-900 text-white">
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language toggle */}
          <button
            onClick={() => updateSettings({ language: settings.language === 'ru' ? 'en' : 'ru' })}
            title="Переключить язык (RU / EN)"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <Languages className="h-3.5 w-3.5 text-neutral-400" />
            <span className="uppercase">{settings.language}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
