import { FoodLog, UserProfile, RiskScreening, FoodItem } from '../../types';
import { initialFoodDatabase } from '@/data/foodDatabase';

const FOOD_LOGS_KEY = 'natriwatch_food_logs';
const USER_PROFILE_KEY = 'natriwatch_user_profile';
const RISK_SCREENING_KEY = 'natriwatch_risk_screening';

export function getFoodLogs(): FoodLog[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FOOD_LOGS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addFoodLog(
  log: Omit<FoodLog, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
): FoodLog {
  const logs = getFoodLogs();
  const newLog: FoodLog = {
    ...log,
    id: log.id || `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: log.createdAt || new Date().toISOString(),
  };
  logs.unshift(newLog);
  if (typeof window !== 'undefined') {
    localStorage.setItem(FOOD_LOGS_KEY, JSON.stringify(logs));
  }
  return newLog;
}

export function deleteFoodLog(id: string): void {
  if (typeof window === 'undefined') return;
  const logs = getFoodLogs();
  const filtered = logs.filter((log) => log.id !== id);
  localStorage.setItem(FOOD_LOGS_KEY, JSON.stringify(filtered));
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_PROFILE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function getLatestRiskScreening(): RiskScreening | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(RISK_SCREENING_KEY);
  if (!stored) return null;
  const screenings: RiskScreening[] = JSON.parse(stored);
  return screenings.length > 0 ? screenings[0] : null;
}

export function saveRiskScreening(screening: RiskScreening): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(RISK_SCREENING_KEY);
  const screenings: RiskScreening[] = stored ? JSON.parse(stored) : [];
  screenings.unshift(screening);
  localStorage.setItem(RISK_SCREENING_KEY, JSON.stringify(screenings));
}

export function getAllFoodItems(): FoodItem[] {
  return initialFoodDatabase || [];
}
export const clearAllLocalData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};