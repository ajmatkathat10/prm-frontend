import { useState, useEffect } from 'react';
import { Cpu, Clock, ShieldCheck, Check } from 'lucide-react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/store/services/settingsApiSlice';

export default function SettingsPage() {
  const { data: settings, isLoading, refetch } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  // Settings states
  const [llmProvider, setLlmProvider] = useState('Gemini');
  const [llmApiKey, setLlmApiKey] = useState('');
  const [schedulerIntervalHours, setSchedulerIntervalHours] = useState(4);
  const [maxWeeklyHours, setMaxWeeklyHours] = useState(40);

  // Success notifier
  const [showNotifier, setShowNotifier] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (settings) {
      setLlmProvider(settings.llmProvider);
      setLlmApiKey(settings.llmApiKey);
      setSchedulerIntervalHours(settings.schedulerIntervalHours);
      setMaxWeeklyHours(settings.maxWeeklyHours);
    }
  }, [settings]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSaveSettings = async (field: string, value: string | number) => {
    try {
      await updateSettings({
        [field]: value,
      }).unwrap();
      
      setShowNotifier(true);
      setTimeout(() => setShowNotifier(false), 3000);
      refetch();
    } catch {
      // no-op
    }
  };

  const maskApiKey = (key?: string) => {
    if (!key) return 'Not Configured';
    if (key.length <= 8) return '********';
    return `${key.substring(0, 4)}****************${key.substring(key.length - 4)}`;
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">System Configuration</h1>
      </div>

      {isLoading ? (
        <div className="text-slate-400 text-sm">Loading system configurations...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Current Configurations
            </h3>

            {showNotifier && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-1.5 transition-all">
                <Check className="w-3.5 h-3.5" />
                Settings saved successfully!
              </div>
            )}

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-slate-500 block text-xs font-semibold uppercase">LLM Provider</span>
                <span className="text-slate-200 mt-0.5 block font-medium">{llmProvider}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs font-semibold uppercase">LLM API Key</span>
                <span className="text-slate-200 mt-0.5 block font-mono text-xs">{maskApiKey(llmApiKey)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs font-semibold uppercase">Scheduler Interval</span>
                <span className="text-slate-200 mt-0.5 block font-medium">{schedulerIntervalHours} hours</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs font-semibold uppercase">Max Weekly Hours Limit</span>
                <span className="text-slate-200 mt-0.5 block font-medium">{maxWeeklyHours} hours / week</span>
              </div>
            </div>
          </div>

          {/* Editors Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* LLM settings card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                Artificial Intelligence Core
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase block">Provider</label>
                  <select
                    value={llmProvider}
                    onChange={(e) => {
                      setLlmProvider(e.target.value);
                      handleSaveSettings('llmProvider', e.target.value);
                    }}
                    className="w-full bg-slate-850 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                  >
                    <option value="Gemini">Google Gemini</option>
                    <option value="Groq">Groq AI</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase block">Update API Token</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Insert API Token..."
                      value={llmApiKey}
                      onChange={(e) => setLlmApiKey(e.target.value)}
                      className="flex-1 bg-slate-850 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('llmApiKey', llmApiKey)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-bold rounded-lg text-xs transition-colors"
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduler settings card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                Operational Cron Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase block">Scheduler Interval (Hours)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={schedulerIntervalHours}
                      onChange={(e) => setSchedulerIntervalHours(Number(e.target.value))}
                      className="flex-1 bg-slate-850 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('schedulerIntervalHours', schedulerIntervalHours)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-bold rounded-lg text-xs transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase block">Max Weekly Hours Cap</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={maxWeeklyHours}
                      onChange={(e) => setMaxWeeklyHours(Number(e.target.value))}
                      className="flex-1 bg-slate-850 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('maxWeeklyHours', maxWeeklyHours)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-bold rounded-lg text-xs transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
