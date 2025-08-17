import { NutritionRecommendation } from '@/types';
import { differenceInMonths } from 'date-fns';

export const nutritionRecommendations: NutritionRecommendation[] = [
  {
    ageMonths: 5,
    mealsPerDay: 1,
    nutrition: {
      protein: 10,
      carbs: 50,
      fat: 5,
      fiber: 3,
      iron: 3,
      calcium: 200
    }
  },
  {
    ageMonths: 7,
    mealsPerDay: 2,
    nutrition: {
      protein: 15,
      carbs: 80,
      fat: 8,
      fiber: 5,
      iron: 4,
      calcium: 300
    }
  },
  {
    ageMonths: 9,
    mealsPerDay: 3,
    nutrition: {
      protein: 20,
      carbs: 100,
      fat: 12,
      fiber: 7,
      iron: 5,
      calcium: 400
    }
  },
  {
    ageMonths: 12,
    mealsPerDay: 4,
    nutrition: {
      protein: 25,
      carbs: 120,
      fat: 15,
      fiber: 8,
      iron: 6,
      calcium: 450
    }
  }
];

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

export function calculateAgeInMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  
  if (birth > now) {
    return 0;
  }
  
  return differenceInMonths(now, birth);
}