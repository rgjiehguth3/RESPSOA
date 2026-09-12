import { ArrowRight, Check, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import { AppSettings, StyleId, ThemeId } from '../types';
import { getStyleClasses, getThemeClasses } from '../utils/themeStyles';
import { AnimeMascot } from './AnimeDecorations';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export function WelcomeModal({
  isOpen,
  onClose,
  settings,
  updateSettings,
}: WelcomeModalProps) {
  const [step, setStep] = useState<number>(1);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const t = translations[settings.language];
  const themeCls = getThemeClasses(settings.theme);
  const styleCls = getStyleClasses(settings.style);

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem('respsoa_seen_welcome', 'true');
    }
    onClose();
  };

  const themes: Array<{ id: ThemeId; title: string; desc: string; colors: string }> = [
    {
      id: 'warm-sunset',
      title: t.themeWarmSunset,
      desc: 'Падающая еда из Minecraft (морковь, яблоки, хлеб, золотые яблоки)',
      colors: 'from-rose-500 via-amber-500 to-yellow-400',
    },
    {
      id: 'forest-night',
      title: t.themeForestNight,
      desc: 'Лианы, листья, азалия в изумрудных тонах',
      colors: 'from-emerald-600 via-teal-500 to-emerald-400',
    },
    {
      id: 'purple-cyan',
      title: t.themePurpleCyan,
      desc: 'Звёзды, кристаллы и неон лаванды с бирюзой',
      colors: 'from-purple-500 via-indigo-500 to-cyan-400',
    },
  ];

  const styles: Array<{ id: StyleId; title: string }> = [
    { id: 'classic', title: t.styleClassic },
    { id: 'modern', title: t.styleModern },
    { id: 'nature', title: t.styleNature },
    { id: 'minimal', title: t.styleMinimal },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-2xl overflow-hidden border ${themeCls.cardBorder} ${themeCls.cardBg} ${styleCls.cardShape} shadow-2xl`}>
        {/* Header with gradient banner */}
        <div className={`relative p-6 border-b border-neutral-800 bg-gradient-to-r ${themeCls.headerGrad}`}>
          <button
            onClick={handleFinish}
            className="absolute right-4 top-4 p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <AnimeMascot theme={settings.theme} size="lg" mood="sparkle" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                  RESPSOA v1.0
                </span>
                <span className="text-xs text-neutral-400">• Minecraft Java Edition</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t.welcomeTitle}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                {t.welcomeSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {step === 1 ? (
            /* Theme & Style Selector Step */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  {t.chooseThemePrompt}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {themes.map((th) => {
                    const isSelected = settings.theme === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => updateSettings({ theme: th.id })}
                        className={`group relative flex flex-col p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50'
                            : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                        }`}
                      >
                        <div className={`h-2.5 w-full rounded-full bg-gradient-to-r ${th.colors} mb-2`} />
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{th.title.split(' ')[0]}</span>
                          <AnimeMascot theme={th.id} size="sm" />
                        </div>
                        <span className="text-[10px] text-neutral-400 leading-tight">{th.desc}</span>
                        {isSelected && (
                          <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-black">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  {t.chooseStylePrompt}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {styles.map((st) => {
                    const isSelected = settings.style === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => updateSettings({ style: st.id })}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                            : 'border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:bg-neutral-900'
                        }`}
                      >
                        <div className="text-xs">{st.title.split(' ')[0]}</div>
                        <div className="text-[10px] text-neutral-500 truncate">{st.title.slice(st.title.indexOf('('))}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Tutorial Step */
            <div className="space-y-4">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
                <h4 className="font-bold text-sm text-amber-400 mb-1">{t.welcomeStep1Title}</h4>
                <p className="text-xs text-neutral-300">{t.welcomeStep1Desc}</p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
                <h4 className="font-bold text-sm text-emerald-400 mb-1">{t.welcomeStep2Title}</h4>
                <p className="text-xs text-neutral-300">{t.welcomeStep2Desc}</p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
                <h4 className="font-bold text-sm text-cyan-400 mb-1">{t.welcomeStep3Title}</h4>
                <p className="text-xs text-neutral-300">{t.welcomeStep3Desc}</p>
              </div>
            </div>
          )}

          {/* Checkbox: don't show again */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
            <input
              type="checkbox"
              id="dontShowAgainCheck"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-neutral-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="dontShowAgainCheck" className="text-xs text-neutral-400 cursor-pointer select-none">
              {t.dontShowAgain}
            </label>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-800 bg-neutral-950/80">
          {step === 1 ? (
            <>
              <button
                onClick={handleFinish}
                className="text-xs text-neutral-400 hover:text-white px-3 py-1.5 transition-colors"
              >
                {t.skipTutorialBtn}
              </button>
              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold ${themeCls.accentBg} ${styleCls.buttonShape}`}
              >
                <span>{t.startTutorialBtn}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-neutral-400 hover:text-white px-3 py-1.5 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={handleFinish}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold ${themeCls.accentBg} ${styleCls.buttonShape}`}
              >
                <span>{t.doneBtn}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
