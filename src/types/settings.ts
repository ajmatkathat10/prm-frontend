export interface SystemConfig {
  _id: string;
  llmProvider: string;
  llmApiKey: string;
  schedulerIntervalHours: number;
  maxWeeklyHours: number;
}

export interface SettingsResponse {
  success: boolean;
  settings: SystemConfig;
}
