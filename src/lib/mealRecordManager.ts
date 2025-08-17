import { MealRecord } from '@/types';

const STORAGE_KEY = 'mealRecords';

/**
 * 一意の食事記録IDを生成します
 */
export function generateMealRecordId(): string {
  return `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 食事記録の種類順序（表示用）
 */
const MEAL_TYPE_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

/**
 * localStorageから食事記録配列を取得します
 */
function getMealRecordsFromStorage(): MealRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

/**
 * 食事記録配列をlocalStorageに保存します
 */
function saveMealRecordsToStorage(records: MealRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * 新しい食事記録を保存します
 * @param mealData - 食事記録データ
 * @returns 保存された食事記録
 */
export function saveMealRecord(mealData: Partial<MealRecord>): MealRecord {
  const now = new Date().toISOString();
  
  const mealRecord: MealRecord = {
    id: mealData.id || generateMealRecordId(),
    date: mealData.date || '',
    mealType: mealData.mealType || 'breakfast',
    foods: mealData.foods || [],
    notes: mealData.notes || '',
    createdAt: mealData.createdAt || now,
    updatedAt: now
  };

  const existingRecords = getMealRecordsFromStorage();
  const updatedRecords = [...existingRecords, mealRecord];
  saveMealRecordsToStorage(updatedRecords);

  return mealRecord;
}

/**
 * 指定したIDの食事記録を取得します
 * @param id - 食事記録ID
 * @returns 食事記録（存在しない場合はnull）
 */
export function getMealRecord(id: string): MealRecord | null {
  const records = getMealRecordsFromStorage();
  return records.find(record => record.id === id) || null;
}

/**
 * すべての食事記録を取得します（日付順：新しい順）
 * @returns 食事記録配列
 */
export function getMealRecords(): MealRecord[] {
  const records = getMealRecordsFromStorage();
  
  // 日付順でソート（新しい順）
  return records.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * 既存の食事記録を更新します
 * @param id - 食事記録ID
 * @param updates - 更新データ
 * @returns 更新された食事記録（存在しない場合はnull）
 */
export function updateMealRecord(id: string, updates: Partial<MealRecord>): MealRecord | null {
  const records = getMealRecordsFromStorage();
  const recordIndex = records.findIndex(record => record.id === id);
  
  if (recordIndex === -1) {
    return null;
  }

  const existingRecord = records[recordIndex];
  
  // 確実にタイムスタンプが変わるように少し待機
  const now = new Date();
  now.setMilliseconds(now.getMilliseconds() + 1);

  const updatedRecord: MealRecord = {
    ...existingRecord,
    ...updates,
    id: existingRecord.id, // IDは変更不可
    createdAt: existingRecord.createdAt, // 作成日時は変更不可
    updatedAt: now.toISOString()
  };

  records[recordIndex] = updatedRecord;
  saveMealRecordsToStorage(records);

  return updatedRecord;
}

/**
 * 食事記録を削除します
 * @param id - 食事記録ID
 * @returns 削除成功フラグ
 */
export function deleteMealRecord(id: string): boolean {
  const records = getMealRecordsFromStorage();
  const filteredRecords = records.filter(record => record.id !== id);
  
  // 削除された場合は配列の長さが変わる
  if (filteredRecords.length === records.length) {
    return false; // 該当する記録が見つからなかった
  }

  saveMealRecordsToStorage(filteredRecords);
  return true;
}

/**
 * 指定した日付の食事記録を取得します（食事の種類順）
 * @param date - 日付（YYYY-MM-DD形式）
 * @returns 該当日の食事記録配列
 */
export function getMealRecordsByDate(date: string): MealRecord[] {
  const records = getMealRecordsFromStorage();
  const dayRecords = records.filter(record => record.date === date);
  
  // 食事の種類順でソート
  return dayRecords.sort((a, b) => {
    const orderA = MEAL_TYPE_ORDER.indexOf(a.mealType);
    const orderB = MEAL_TYPE_ORDER.indexOf(b.mealType);
    return orderA - orderB;
  });
}