import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { BuildBar } from './components/BuildBar';
import { JsonViewerModal } from './components/JsonViewerModal';
import { LogModal } from './components/LogModal';
import { Navigation } from './components/Navigation';
import { OutdatedLangModal } from './components/OutdatedLangModal';
import { ResultModal } from './components/ResultModal';
import { WelcomeModal } from './components/WelcomeModal';
import { HelpTab } from './components/tabs/HelpTab';
import { HistoryTab } from './components/tabs/HistoryTab';
import { ImageConverterTab } from './components/tabs/ImageConverterTab';
import { JsonEditorTab } from './components/tabs/JsonEditorTab';
import { ResourcePackTab } from './components/tabs/ResourcePackTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { translations } from './i18n/translations';
import {
  AppSettings,
  ContentType,
  HistoryOperation,
  LogEntry,
  NavTabId,
  PackItem,
  StyleId,
  ThemeId,
} from './types';
import { UNICODE_CHARS_PRIMARY } from './utils/imageProcessor';
import {
  BuildProgress,
  buildResourcePackZip,
  generateDefaultFontJson,
} from './utils/packBuilder';
import { createDemoPackItems } from './utils/sampleData';
import { getThemeClasses } from './utils/themeStyles';
import { generatePackMcmeta } from './utils/versionMapper';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'ru',
  theme: 'warm-sunset',
  style: 'classic',
  minecraftVersion: '1.21',
  packName: 'RESPSOA',
  namespace: 'minecraft',
  showPreviewBeforeSave: true,
  showLogs: true,
  defaultSizePreset: 'logo-standard',
  defaultCornerRadius: 0,
  defaultFitMode: 'contain',
  defaultAscentPrefix: 7,
  defaultHeightPrefix: 9,
  defaultAscentLogo: 30,
  defaultHeightLogo: 35,
  customPackPngDataUrl: null,
  activeProfile: 'logos',
};

export default function App() {
  // Load settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('respsoa_settings_v1');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Load history from localStorage
  const [history, setHistory] = useState<HistoryOperation[]>(() => {
    try {
      const saved = localStorage.getItem('respsoa_history_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<NavTabId>('pack');
  const [items, setItems] = useState<PackItem[]>(() => createDemoPackItems());
  const [selectedItemId, setSelectedItemId] = useState<string | null>(() => items[0]?.id || null);
  const [itemsUndoStack, setItemsUndoStack] = useState<PackItem[][]>([]);

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'RESPSOA v1.0 инициализирован. Загружен демонстрационный набор элементов.',
    },
  ]);

  // Modals & Drawers
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(() => {
    return !localStorage.getItem('respsoa_seen_welcome');
  });
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isJsonViewerOpen, setIsJsonViewerOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [outdatedLangFile, setOutdatedLangFile] = useState<File | null>(null);

  // Custom default.json override from JSON editor tab
  const [customDefaultJson, setCustomDefaultJson] = useState<string | null>(null);

  // Pack building state
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState<BuildProgress>({
    percent: 0,
    currentStep: 'Готов к сборке',
  });
  const [lastBuildResult, setLastBuildResult] = useState<{
    zipBlob?: Blob;
    defaultJson?: string;
    packMcmeta?: string;
    soundsJson?: string;
    stats?: {
      totalFiles: number;
      sizeBytes: number;
      durationMs: number;
    };
  }>({});

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync settings & history to localStorage
  useEffect(() => {
    localStorage.setItem('respsoa_settings_v1', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('respsoa_history_v1', JSON.stringify(history));
  }, [history]);

  const addLog = useCallback((level: 'info' | 'warn' | 'error' | 'success', message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
      },
    ]);
  }, []);

  const updateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
    if (newPartial.theme || newPartial.style || newPartial.language) {
      addLog('info', `Настройки обновлены: ${Object.keys(newPartial).join(', ')}`);
    }
  };

  // Push current items to undo stack before mutating
  const pushUndo = useCallback(() => {
    setItemsUndoStack((prev) => [...prev.slice(-15), items]);
  }, [items]);

  const handleUndo = useCallback(() => {
    if (itemsUndoStack.length === 0) return;
    const previous = itemsUndoStack[itemsUndoStack.length - 1];
    setItemsUndoStack((prev) => prev.slice(0, -1));
    setItems(previous);
    addLog('info', 'Отмена последнего действия над элементами (Ctrl+Z)');
  }, [itemsUndoStack, addLog]);

  // Profile presets switch
  const handleApplyProfile = (profileName: string) => {
    if (profileName === 'logos') {
      updateSettings({
        activeProfile: 'logos',
        defaultSizePreset: 'logo-standard',
        defaultAscentLogo: 30,
        defaultHeightLogo: 35,
        defaultCornerRadius: 16,
      });
      addLog('success', 'Применён профиль «Логотипы» (256x256, ascent: 30, height: 35, R:16)');
    } else if (profileName === 'prefixes') {
      updateSettings({
        activeProfile: 'prefixes',
        defaultSizePreset: 'original',
        defaultAscentPrefix: 7,
        defaultHeightPrefix: 9,
        defaultCornerRadius: 0,
      });
      addLog('success', 'Применён профиль «Префиксы» (оригинальный размер, ascent: 7, height: 9)');
    } else if (profileName === 'sounds') {
      updateSettings({
        activeProfile: 'sounds',
        minecraftVersion: '1.21.9',
      });
      addLog('success', 'Применён профиль «Звуки» (версия MC 1.21.9+)');
    }
  };

  // Process and add dropped / selected files
  const handleAddFiles = useCallback(
    async (files: File[]) => {
      pushUndo();
      const newItems: PackItem[] = [];

      let currentBitmapCount = items.filter((i) => i.type === 'bitmap').length;

      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';

        // Check for outdated .lang
        if (ext === 'lang') {
          setOutdatedLangFile(file);
          addLog('warn', `Обнаружен устаревший формат языка .lang (${file.name})`);
          continue;
        }

        let type: ContentType = 'bitmap';
        let targetFilename = file.name;
        let ascent = settings.defaultAscentLogo;
        let height = settings.defaultHeightLogo;
        let sizePreset = settings.defaultSizePreset;
        let cornerRadius = settings.defaultCornerRadius;
        let enableRounding = cornerRadius > 0;

        if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext)) {
          type = 'sound';
          const soundNum = items.filter((i) => i.type === 'sound').length + newItems.filter((i) => i.type === 'sound').length + 1;
          targetFilename = `sound${soundNum}.ogg`;
        } else if (ext === 'json') {
          if (file.name.includes('_') || file.name.length <= 10) {
            type = 'lang';
          } else {
            type = 'model';
          }
        } else if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(ext)) {
          currentBitmapCount++;
          targetFilename = `logo${currentBitmapCount}.png`;
        }

        const charIdx = (items.length + newItems.length) % UNICODE_CHARS_PRIMARY.length;
        const char = UNICODE_CHARS_PRIMARY[charIdx];

        // Read data URL
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        newItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          file,
          name: file.name,
          dataUrl,
          type,
          chars: char,
          ascent,
          height,
          sizePreset,
          customWidth: 256,
          customHeight: 256,
          cornerRadius,
          enableRounding,
          fitMode: settings.defaultFitMode,
          targetFilename,
          sizeBytes: file.size,
        });
      }

      if (newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setSelectedItemId(newItems[0].id);
        addLog('success', `Добавлено элементов: ${newItems.length}`);
      }
    },
    [items, settings, pushUndo, addLog]
  );

  const handleUpdateItem = (id: string, updated: Partial<PackItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const handleDeleteItem = useCallback(
    (id: string) => {
      pushUndo();
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        if (selectedItemId === id) {
          setSelectedItemId(next[0]?.id || null);
        }
        return next;
      });
      addLog('info', 'Элемент удален');
    },
    [pushUndo, selectedItemId, addLog]
  );

  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    pushUndo();
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);

      // Re-number target filenames for bitmaps if requested
      let logoCount = 1;
      return copy.map((item) => {
        if (item.type === 'bitmap') {
          const updated = {
            ...item,
            targetFilename: `logo${logoCount}.png`,
            chars: UNICODE_CHARS_PRIMARY[(logoCount - 1) % UNICODE_CHARS_PRIMARY.length],
          };
          logoCount++;
          return updated;
        }
        return item;
      });
    });
    addLog('info', `Элемент перемещён на позицию #${toIndex + 1}`);
  };

  const handleClearAll = () => {
    pushUndo();
    setItems([]);
    setSelectedItemId(null);
    addLog('info', 'Список элементов очищен');
  };

  const handleLoadDemo = () => {
    pushUndo();
    const demo = createDemoPackItems();
    setItems(demo);
    setSelectedItemId(demo[0]?.id || null);
    addLog('success', 'Загружен демонстрационный набор элементов');
  };

  // Convert outdated .lang to .json
  const handleAutoConvertLang = (convertedFile: File, jsonContent: string) => {
    handleAddFiles([convertedFile]);
    addLog('success', `Файл ${convertedFile.name} успешно преобразован в стандартный JSON`);
  };

  // Build Resource Pack
  const handleBuildPack = async () => {
    if (items.length === 0 || isBuilding) return;

    setIsBuilding(true);
    addLog('info', `Запуск сборки ресурспака «${settings.packName}.zip» для Minecraft ${settings.minecraftVersion}...`);

    try {
      const result = await buildResourcePackZip(
        items,
        settings,
        (progress) => setBuildProgress(progress),
        customDefaultJson
      );

      setLastBuildResult(result);
      setIsBuilding(false);

      // Add to history
      const newHistoryOp: HistoryOperation = {
        id: `op-${Date.now()}`,
        date: new Date().toISOString(),
        filesCount: items.length,
        fileNames: items.map((i) => i.targetFilename),
        types: items.reduce((acc, curr) => {
          acc[curr.targetFilename] = curr.type;
          return acc;
        }, {} as Record<string, ContentType>),
        packVersion: settings.minecraftVersion,
        packName: settings.packName,
        outputZipName: `${settings.packName}.zip`,
        sizeBytes: result.stats?.sizeBytes || 0,
      };

      setHistory((prev) => [newHistoryOp, ...prev]);
      addLog('success', `Ресурспак «${settings.packName}.zip» успешно собран (${((result.stats?.sizeBytes || 0) / 1024).toFixed(1)} KB)`);

      // Open result modal
      setIsResultOpen(true);
    } catch (err) {
      console.error('Pack build error:', err);
      setIsBuilding(false);
      addLog('error', `Ошибка сборки: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Download ZIP helper
  const handleDownloadZip = () => {
    if (!lastBuildResult.zipBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(lastBuildResult.zipBlob);
    a.download = `${settings.packName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addLog('success', `Скачивание ${settings.packName}.zip начато`);
  };

  // Repeat operation from history
  const handleRepeatOperation = (op: HistoryOperation) => {
    updateSettings({
      minecraftVersion: op.packVersion,
      packName: op.outputZipName.replace(/\.zip$/i, ''),
    });
    setActiveTab('pack');
    addLog('info', `Загружены параметры из истории для повтора: ${op.outputZipName}`);
  };

  // Global Hotkeys Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in input or textarea
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Ctrl + S -> Build
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleBuildPack();
        return;
      }

      // Ctrl + O -> Open file dialog
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        hiddenFileInputRef.current?.click();
        return;
      }

      // Ctrl + Z -> Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !isInput) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Delete / Backspace on selected item
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput && selectedItemId) {
        e.preventDefault();
        handleDeleteItem(selectedItemId);
        return;
      }

      // Ctrl + Shift + J -> JSON editor
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setActiveTab('json');
        return;
      }

      // Ctrl + 1..6 -> Switch Tabs
      if ((e.ctrlKey || e.metaKey) && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        const tabMap: Record<string, NavTabId> = {
          '1': 'pack',
          '2': 'converter',
          '3': 'json',
          '4': 'settings',
          '5': 'history',
          '6': 'help',
        };
        setActiveTab(tabMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBuildPack, handleUndo, handleDeleteItem, selectedItemId]);

  const themeCls = getThemeClasses(settings.theme);

  return (
    <div className={`relative min-h-screen text-neutral-100 font-sans ${themeCls.pageBg} select-none`}>
      {/* Background Animated Canvas with Falling Minecraft Food, Vines, or Crystals */}
      <BackgroundCanvas theme={settings.theme} style={settings.style} />

      {/* Hidden File Input for Ctrl+O */}
      <input
        ref={hiddenFileInputRef}
        type="file"
        multiple
        accept="image/*,audio/*,.json,.lang"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleAddFiles(Array.from(e.target.files));
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          settings={settings}
          updateSettings={updateSettings}
          onOpenWelcome={() => setIsWelcomeOpen(true)}
          onOpenLogs={() => setIsLogOpen(true)}
          logsCount={logs.length}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'pack' && (
            <ResourcePackTab
              items={items}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onMoveItem={handleMoveItem}
              onAddFiles={handleAddFiles}
              onLoadDemo={handleLoadDemo}
              onClearAll={handleClearAll}
              onOutdatedLangDetected={(file) => setOutdatedLangFile(file)}
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          )}

          {activeTab === 'converter' && (
            <ImageConverterTab settings={settings} />
          )}

          {activeTab === 'json' && (
            <JsonEditorTab
              items={items}
              customDefaultJson={customDefaultJson}
              onSaveJsonToProject={(jsonStr) => {
                setCustomDefaultJson(jsonStr);
                addLog('success', 'Пользовательский default.json сохранён в структуру ресурспака');
              }}
              settings={settings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              updateSettings={updateSettings}
              onApplyProfile={handleApplyProfile}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab
              history={history}
              onRepeatOperation={handleRepeatOperation}
              onClearHistory={() => {
                setHistory([]);
                addLog('info', 'История операций очищена');
              }}
              settings={settings}
            />
          )}

          {activeTab === 'help' && (
            <HelpTab settings={settings} />
          )}
        </main>

        {/* Bottom Build Bar for Resource Pack Tab */}
        {activeTab === 'pack' && (
          <BuildBar
            isBuilding={isBuilding}
            progress={buildProgress}
            onBuild={handleBuildPack}
            onToggleLogs={() => setIsLogOpen(true)}
            itemsCount={items.length}
            settings={settings}
          />
        )}
      </div>

      {/* Welcome / First-Run Modal */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
      />

      {/* Result Modal */}
      <ResultModal
        isOpen={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        progress={buildProgress}
        onDownloadZip={handleDownloadZip}
        onViewJson={() => {
          setIsResultOpen(false);
          setIsJsonViewerOpen(true);
        }}
        settings={settings}
      />

      {/* JSON Viewer Modal */}
      <JsonViewerModal
        isOpen={isJsonViewerOpen}
        onClose={() => setIsJsonViewerOpen(false)}
        defaultJson={lastBuildResult.defaultJson || generateDefaultFontJson(items, settings.namespace)}
        packMcmeta={lastBuildResult.packMcmeta || generatePackMcmeta(settings.minecraftVersion, settings.packName)}
        soundsJson={lastBuildResult.soundsJson || '{}'}
        settings={settings}
      />

      {/* Real-time Logs Modal */}
      <LogModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
        settings={settings}
      />

      {/* Outdated .lang Warning Modal */}
      <OutdatedLangModal
        isOpen={!!outdatedLangFile}
        onClose={() => setOutdatedLangFile(null)}
        file={outdatedLangFile}
        onAutoConvert={handleAutoConvertLang}
        settings={settings}
      />
    </div>
  );
}
