import { NutritionRecommendation } from '@/types';
import { differenceInMonths } from 'date-fns';

/**
 * 月齢別推奨栄養量データ
 * 離乳食の段階（初期・中期・後期・完了期）に応じた推奨栄養摂取量を定義
 */
export const nutritionRecommendations: NutritionRecommendation[] = [
  {
    // 離乳食初期（5-6ヶ月）: 1日1回食
    ageMonths: 5,
    mealsPerDay: 1,
    nutrition: {
      protein: 10,   // タンパク質(g)
      carbs: 50,     // 炭水化物(g)
      fat: 5,        // 脂質(g)
      fiber: 3,      // 食物繊維(g)
      iron: 3,       // 鉄分(mg)
      calcium: 200   // カルシウム(mg)
    }
  },
  {
    // 離乳食中期（7-8ヶ月）: 1日2回食
    ageMonths: 7,
    mealsPerDay: 2,
    nutrition: {
      protein: 15,   // タンパク質(g)
      carbs: 80,     // 炭水化物(g)
      fat: 8,        // 脂質(g)
      fiber: 5,      // 食物繊維(g)
      iron: 4,       // 鉄分(mg)
      calcium: 300   // カルシウム(mg)
    }
  },
  {
    // 離乳食後期（9-11ヶ月）: 1日3回食
    ageMonths: 9,
    mealsPerDay: 3,
    nutrition: {
      protein: 20,   // タンパク質(g)
      carbs: 100,    // 炭水化物(g)
      fat: 12,       // 脂質(g)
      fiber: 7,      // 食物繊維(g)
      iron: 5,       // 鉄分(mg)
      calcium: 400   // カルシウム(mg)
    }
  },
  {
    // 離乳食完了期（12ヶ月以降）: 1日3回食 + おやつ
    ageMonths: 12,
    mealsPerDay: 4,
    nutrition: {
      protein: 25,   // タンパク質(g)
      carbs: 120,    // 炭水化物(g)
      fat: 15,       // 脂質(g)
      fiber: 8,      // 食物繊維(g)
      iron: 6,       // 鉄分(mg)
      calcium: 450   // カルシウム(mg)
    }
  }
];

/**
 * 月齢に応じた推奨栄養量を取得します
 * @param ageMonths - 赤ちゃんの月齢
 * @returns 推奨栄養量データ（離乳食開始前の場合はnull）
 * 
 * @example
 * ```typescript
 * // 8ヶ月の赤ちゃんの推奨栄養量を取得
 * const recommendation = getNutritionRecommendation(8);
 * if (recommendation) {
 *   console.log(`1日の食事回数: ${recommendation.mealsPerDay}回`);
 *   console.log(`推奨タンパク質: ${recommendation.nutrition.protein}g`);
 * }
 * ```
 */
export function getNutritionRecommendation(ageMonths: number): NutritionRecommendation | null {
  // 離乳食開始前（5ヶ月未満）や不正な値の場合はnullを返す
  if (ageMonths < 5) {
    return null;
  }

  // 月齢に最も適した推奨栄養量を見つける（降順で検索）
  const appropriateRecommendation = nutritionRecommendations
    .slice()
    .reverse()
    .find(recommendation => ageMonths >= recommendation.ageMonths);

  if (!appropriateRecommendation) {
    return null;
  }

  // 実際の月齢に合わせて調整されたレコメンデーションを返す
  return {
    ...appropriateRecommendation,
    ageMonths: ageMonths
  };
}

/**
 * 誕生日から現在の月齢を計算します
 * @param birthDate - 誕生日（YYYY-MM-DD形式の文字列）
 * @returns 月齢（ヶ月数）
 * 
 * @example
 * ```typescript
 * // 2024年2月16日生まれの赤ちゃんの月齢を計算（現在が8月16日の場合）
 * const ageMonths = calculateAgeInMonths('2024-02-16');
 * console.log(ageMonths); // 6（ヶ月）
 * 
 * // 未来の日付の場合は0を返す
 * const futureAge = calculateAgeInMonths('2025-12-31');
 * console.log(futureAge); // 0
 * ```
 */
export function calculateAgeInMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  
  // 誕生日が未来の場合は0ヶ月を返す
  if (birth > now) {
    return 0;
  }
  
  // date-fnsライブラリを使用して月齢を計算
  return differenceInMonths(now, birth);
}