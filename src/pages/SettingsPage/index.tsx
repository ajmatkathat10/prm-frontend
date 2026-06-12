import { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/store/services/settingsApiSlice';
import { styles } from './settingsPage.styles';

export default function SettingsPage() {
  const { data: settings, isLoading, refetch } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  const [llmProvider, setLlmProvider] = useState('Gemini');
  const [llmApiKey, setLlmApiKey] = useState('');
  const [schedulerIntervalHours, setSchedulerIntervalHours] = useState(4);
  const [maxWeeklyHours, setMaxWeeklyHours] = useState(40);

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
      void 0;
    }
  };

  const maskApiKey = (key?: string) => {
    if (!key) return 'Not Configured';
    if (key.length <= 8) return '********';
    return `${key.substring(0, 4)}****************${key.substring(key.length - 4)}`;
  };

  return (
    <div>
      <div>
        <h1>System Configuration</h1>
      </div>

      {isLoading ? (
        <div style={styles.loadingMessage}>Loading system configurations...</div>
      ) : (
        <div style={styles.layoutContainer}>
          <div className="card" style={styles.summaryCard}>
            <h3>Current Configurations</h3>

            {showNotifier && (
              <div className="success-banner">
                Settings saved successfully!
              </div>
            )}

            <div style={styles.summaryList}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>LLM PROVIDER</span>
                <span style={styles.summaryValue}>{llmProvider}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>LLM API KEY</span>
                <span style={styles.summaryValueMonospace}>{maskApiKey(llmApiKey)}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>SCHEDULER INTERVAL</span>
                <span style={styles.summaryValue}>{schedulerIntervalHours} hours</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>MAX WEEKLY HOURS LIMIT</span>
                <span style={styles.summaryValue}>{maxWeeklyHours} hours / week</span>
              </div>
            </div>
          </div>

          <div style={styles.editorsContainer}>
            <div className="card">
              <h3>Artificial Intelligence Core</h3>

              <div style={styles.rowWrap}>
                <div style={styles.flexOneMinWidth150}>
                  <label>Provider</label>
                  <select
                    value={llmProvider}
                    onChange={(e) => {
                      setLlmProvider(e.target.value);
                      handleSaveSettings('llmProvider', e.target.value);
                    }}
                    style={styles.widthFull}
                  >
                    <option value="Gemini">Google Gemini</option>
                    <option value="Groq">Groq AI</option>
                  </select>
                </div>

                <div style={styles.flexOneMinWidth200}>
                  <label>Update API Token</label>
                  <div style={styles.flexRowGap8}>
                    <input
                      type="password"
                      placeholder="Insert API Token..."
                      value={llmApiKey}
                      onChange={(e) => setLlmApiKey(e.target.value)}
                      style={styles.flexOneInput}
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

            <div className="card">
              <h3>Operational Cron Configuration</h3>

              <div style={styles.rowWrap}>
                <div style={styles.flexOneMinWidth180}>
                  <label>Scheduler Interval (Hours)</label>
                  <div style={styles.flexRowGap8}>
                    <input
                      type="number"
                      min={1}
                      value={schedulerIntervalHours}
                      onChange={(e) => setSchedulerIntervalHours(Number(e.target.value))}
                      style={styles.flexOneInput}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveSettings('schedulerIntervalHours', schedulerIntervalHours)}
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div style={styles.flexOneMinWidth180}>
                  <label>Max Weekly Hours Cap</label>
                  <div style={styles.flexRowGap8}>
                    <input
                      type="number"
                      min={1}
                      value={maxWeeklyHours}
                      onChange={(e) => setMaxWeeklyHours(Number(e.target.value))}
                      style={styles.flexOneInput}
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
