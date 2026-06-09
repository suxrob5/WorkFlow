// Centralized Work Hour Configuration
export const WORK_START_HOUR = 9;
export const WORK_START_MINUTE = 0;
export const WORK_END_HOUR = 18;
export const WORK_END_MINUTE = 0;

// Format helper
export const WORK_START_TIME_STR = `${String(WORK_START_HOUR).padStart(2, "0")}:${String(WORK_START_MINUTE).padStart(2, "0")}`;
export const WORK_END_TIME_STR = `${String(WORK_END_HOUR).padStart(2, "0")}:${String(WORK_END_MINUTE).padStart(2, "0")}`;
