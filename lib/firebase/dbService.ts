import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import { FoodLog, UserProfile, RiskScreening } from '../../types';

const FOOD_LOGS_COLLECTION = 'food_logs';
const USER_PROFILES_COLLECTION = 'user_profiles';
const RISK_SCREENINGS_COLLECTION = 'risk_screenings';

export async function getFoodLogsFromDB(): Promise<FoodLog[]> {
  try {
    const querySnapshot = await getDocs(collection(db, FOOD_LOGS_COLLECTION));
    const logs: FoodLog[] = [];
    querySnapshot.forEach((docSnap) => {
      logs.push({ id: docSnap.id, ...docSnap.data() } as FoodLog);
    });
    return logs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (error) {
    console.error('Gagal mengambil data dari Firestore:', error);
    return [];
  }
}

export async function addFoodLogToDB(
  log: Omit<FoodLog, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
): Promise<FoodLog> {
  const newLogData = {
    ...log,
    createdAt: log.createdAt || new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, FOOD_LOGS_COLLECTION), newLogData);
  return { id: docRef.id, ...newLogData } as FoodLog;
}

export async function deleteFoodLogFromDB(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, FOOD_LOGS_COLLECTION, id));
  } catch (error) {
    console.error('Gagal menghapus dokumen:', error);
  }
}

export async function saveUserProfileToDB(profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, USER_PROFILES_COLLECTION, 'default_user'), profile);
  } catch (error) {
    console.error('Gagal menyimpan profil:', error);
  }
}

export async function getUserProfileFromDB(): Promise<UserProfile | null> {
  try {
    const docSnap = await getDoc(doc(db, USER_PROFILES_COLLECTION, 'default_user'));
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
    return null;
  }
}

export async function saveRiskScreeningToDB(screening: RiskScreening): Promise<void> {
  try {
    await addDoc(collection(db, RISK_SCREENINGS_COLLECTION), screening);
  } catch (error) {
    console.error('Gagal menyimpan skrining:', error);
  }
}