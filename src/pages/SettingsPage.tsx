import { useState, useEffect } from 'react';
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
      // Handled by toast middleware
    }
  };

  const maskApiKey = (key?: string) => {
    if (!key) return 'Not Configured';
    if (key.length <= 8) return '********';
    return `${key.substring(0, 4)}****************${key.substring(key.length - 4)}`;
  };

  return (
    <div>
      {/* Header */}
      <div>
        <h1>System Configuration</h1>
      </div>

      {isLoading ? (
        <div style={{ color: "#666" }}>Loading system configurations...</div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
          {/* Summary Panel */}
          <div className="card" style={{ flex: '1', minWidth: '280px' }}>
            <h3>Current Configurations</h3>

            {showNotifier && (
              <div className="success-banner">
                Settings saved successfully!
              </div>
            )}

            <div style={{ marginTop: '15px' }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#666', display: 'block', fontWeight: 'bold' }}>LLM PROVIDER</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{llmProvider}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#666', display: 'block', fontWeight: 'bold' }}>LLM API KEY</span>
                <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{maskApiKey(llmApiKey)}</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#666', display: 'block', fontWeight: 'bold' }}>SCHEDULER INTERVAL</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{schedulerIntervalHours} hours</span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#666', display: 'block', fontWeight: 'bold' }}>MAX WEEKLY HOURS LIMIT</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{maxWeeklyHours} hours / week</span>
              </div>
            </div>
          </div>

          {/* Editors Grid */}
          <div style={{ flex: '2', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* LLM settings card */}
            <div className="card">
              <h3>Artificial Intelligence Core</h3>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <label>Provider</label>
                  <select
                    value={llmProvider}
                    onChange={(e) => {
                      setLlmProvider(e.target.value);
                      handleSaveSettings('llmProvider', e.target.value);
                    }}
                    style={{ width: '100%' }}
                  >
                    <option value="Gemini">Google Gemini</option>
                    <option value="Groq">Groq AI</option>
                  </select>
                </div>

                <div style={{ flex: '1', minWidth: '200px' }}>
                  <label>Update API Token</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="password"
                      placeholder="Insert API Token..."
                      value={llmApiKey}
                      onChange={(e) => setLlmApiKey(e.target.value)}
                      style={{ flex: '1' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('llmApiKey', llmApiKey)}
                    >
                      Save Key
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduler settings card */}
            <div className="card">
              <h3>Operational Cron Configuration</h3>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                <div style={{ flex: '1', minWidth: '180px' }}>
                  <label>Scheduler Interval (Hours)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      min={1}
                      value={schedulerIntervalHours}
                      onChange={(e) => setSchedulerIntervalHours(Number(e.target.value))}
                      style={{ flex: '1' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('schedulerIntervalHours', schedulerIntervalHours)}
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div style={{ flex: '1', minWidth: '180px' }}>
                  <label>Max Weekly Hours Cap</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      min={1}
                      value={maxWeeklyHours}
                      onChange={(e) => setMaxWeeklyHours(Number(e.target.value))}
                      style={{ flex: '1' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('maxWeeklyHours', maxWeeklyHours)}
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

