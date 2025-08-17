import { BabyProfile } from '@/types';
import { calculateAgeInMonths, getNutritionRecommendation } from '@/data/nutritionRecommendations';

const STORAGE_KEY = 'babyProfile';

/**
 * 一意のIDを生成します
 */
function generateId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 新しいプロフィールを保存します
 * @param profileData - プロフィールデータ
 * @returns 保存されたプロフィール
 */
export function saveProfile(profileData: Partial<BabyProfile>): BabyProfile {
  const now = new Date().toISOString();
  
  const profile: BabyProfile = {
    id: profileData.id || generateId(),
    name: profileData.name || '',
    birthDate: profileData.birthDate || '',
    createdAt: profileData.createdAt || now,
    updatedAt: now
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * 保存されたプロフィールを取得します
 * @returns プロフィールデータ（存在しない場合はnull）
 */
export function getProfile(): BabyProfile | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as BabyProfile;
  } catch (error) {
    return null;
  }
}

/**
 * 既存プロフィールを更新します
 * @param updates - 更新データ
 * @returns 更新されたプロフィール（存在しない場合はnull）
 */
export function updateProfile(updates: Partial<BabyProfile>): BabyProfile | null {
  const existing = getProfile();
  if (!existing) {
    return null;
  }

  // 確実にタイムスタンプが変わるように少し待機
  const now = new Date();
  now.setMilliseconds(now.getMilliseconds() + 1);

  const updated: BabyProfile = {
    ...existing,
    ...updates,
    id: existing.id, // IDは変更不可
    createdAt: existing.createdAt, // 作成日時は変更不可
    updatedAt: now.toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * プロフィールを削除します
 * @returns 削除成功フラグ
 */
export function deleteProfile(): boolean {
  localStorage.removeItem(STORAGE_KEY);
  return true;
}

/**
 * プロフィールデータのバリデーション結果
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * プロフィールデータをバリデーションします
 * @param data - バリデーション対象データ
 * @returns バリデーション結果
 */
export function validateProfile(data: Partial<BabyProfile>): ValidationResult {
  const errors: string[] = [];

  // 名前のバリデーション
  if (!data.name || data.name.trim().length === 0) {
    errors.push('名前は必須です');
  } else if (data.name.length > 50) {
    errors.push('名前は50文字以内で入力してください');
  }

  // 誕生日のバリデーション
  if (!data.birthDate) {
    errors.push('誕生日は必須です');
  } else {
    // YYYY-MM-DD形式チェック
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.birthDate)) {
      errors.push('誕生日はYYYY-MM-DD形式で入力してください');
    } else {
      // 有効な日付かチェック
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // 今日の終わりまで許可

      if (birthDate > today) {
        errors.push('誕生日は今日以前の日付を入力してください');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 月齢と離乳食段階の情報
 */
interface AgeInfo {
  ageMonths: number;
  stage: string;
  stageDescription: string;
  mealsPerDay: number;
}

/**
 * プロフィールから月齢と離乳食段階を計算します
 * @param profile - プロフィールデータ
 * @returns 月齢・離乳食段階情報
 */
export function getAgeInfo(profile: BabyProfile): AgeInfo {
  const ageMonths = calculateAgeInMonths(profile.birthDate);
  
  if (ageMonths < 5) {
    return {
      ageMonths,
      stage: '離乳食前',
      stageDescription: '離乳食開始前（5ヶ月未満）',
      mealsPerDay: 0
    };
  }

  const recommendation = getNutritionRecommendation(ageMonths);
  
  if (ageMonths >= 5 && ageMonths <= 6) {
    return {
      ageMonths,
      stage: '初期',
      stageDescription: '離乳食初期（5-6ヶ月）',
      mealsPerDay: recommendation?.mealsPerDay || 1
    };
  }
  
  if (ageMonths >= 7 && ageMonths <= 8) {
    return {
      ageMonths,
      stage: '中期',
      stageDescription: '離乳食中期（7-8ヶ月）',
      mealsPerDay: recommendation?.mealsPerDay || 2
    };
  }
  
  if (ageMonths >= 9 && ageMonths <= 11) {
    return {
      ageMonths,
      stage: '後期',
      stageDescription: '離乳食後期（9-11ヶ月）',
      mealsPerDay: recommendation?.mealsPerDay || 3
    };
  }
  
  // 12ヶ月以降
  return {
    ageMonths,
    stage: '完了期',
    stageDescription: '離乳食完了期（12ヶ月以降）',
    mealsPerDay: recommendation?.mealsPerDay || 4
  };
}