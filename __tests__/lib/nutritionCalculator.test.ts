import {
  calculateFoodNutrition,
  calculateMealNutrition,
  calculateDailyNutrition,
  analyzeNutritionDeficiency,
  generateNutritionAnalysis
} from '@/lib/nutritionCalculator';
import { Food, MealRecord, Nutrition } from '@/types';

describe('栄養計算ロジック', () => {
  const sampleFood: Food = {
    name: 'お粥',
    amount: 50,
    nutrition: {
      protein: 1.5,
      carbs: 16.0,
      fat: 0.1,
      fiber: 0.3,
      iron: 0.1,
      calcium: 3.0
    }
  };

  const sampleMeal: MealRecord = {
    id: '1',
    date: '2024-08-16',
    mealType: 'breakfast',
    mealLabel: '朝食',
    foods: [
      {
        name: 'お粥',
        amount: 50,
        nutrition: {
          protein: 0.75,  // 1.5 * 50/100
          carbs: 8.0,     // 16.0 * 50/100
          fat: 0.05,      // 0.1 * 50/100
          fiber: 0.15,    // 0.3 * 50/100
          iron: 0.05,     // 0.1 * 50/100
          calcium: 1.5    // 3.0 * 50/100
        }
      },
      {
        name: 'にんじん',
        amount: 20,
        nutrition: {
          protein: 0.14,  // 0.7 * 20/100
          carbs: 1.82,    // 9.1 * 20/100
          fat: 0.04,      // 0.2 * 20/100
          fiber: 0.56,    // 2.8 * 20/100
          iron: 0.04,     // 0.2 * 20/100
          calcium: 5.6    // 28.0 * 20/100
        }
      }
    ],
    memo: 'テスト用食事記録'
  };

  describe('calculateFoodNutrition 関数', () => {
    test('基本食材の栄養価を100g基準から実際の分量に換算する', () => {
      const result = calculateFoodNutrition('お粥', 50);
      
      expect(result).toEqual({
        protein: 0.75,  // 1.5 * 50/100
        carbs: 8.0,     // 16.0 * 50/100
        fat: 0.05,      // 0.1 * 50/100
        fiber: 0.15,    // 0.3 * 50/100
        iron: 0.05,     // 0.1 * 50/100
        calcium: 1.5    // 3.0 * 50/100
      });
    });

    test('存在しない食材の場合はゼロ栄養価を返す', () => {
      const result = calculateFoodNutrition('存在しない食材', 100);
      
      expect(result).toEqual({
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        iron: 0,
        calcium: 0
      });
    });

    test('分量が0の場合はゼロ栄養価を返す', () => {
      const result = calculateFoodNutrition('お粥', 0);
      
      expect(result).toEqual({
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        iron: 0,
        calcium: 0
      });
    });
  });

  describe('calculateMealNutrition 関数', () => {
    test('食事記録から総栄養価を計算する', () => {
      const result = calculateMealNutrition(sampleMeal);
      
      // お粥50g + にんじん20gの栄養価
      expect(result.protein).toBeCloseTo(0.89, 2);
      expect(result.carbs).toBeCloseTo(9.82, 2);
      expect(result.fat).toBeCloseTo(0.09, 2);
      expect(result.fiber).toBeCloseTo(0.71, 2);
      expect(result.iron).toBeCloseTo(0.09, 2);
      expect(result.calcium).toBeCloseTo(7.1, 2);
    });

    test('食材が空の場合はゼロ栄養価を返す', () => {
      const emptyMeal: MealRecord = {
        ...sampleMeal,
        foods: []
      };
      
      const result = calculateMealNutrition(emptyMeal);
      
      expect(result).toEqual({
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        iron: 0,
        calcium: 0
      });
    });
  });

  describe('calculateDailyNutrition 関数', () => {
    test('1日の複数食事記録から総栄養価を計算する', () => {
      const meals: MealRecord[] = [
        sampleMeal,
        {
          ...sampleMeal,
          id: '2',
          mealType: 'lunch',
          mealLabel: '昼食'
        }
      ];
      
      const result = calculateDailyNutrition(meals);
      
      // 同じ食事を2回分
      expect(result.protein).toBeCloseTo(1.78, 2);
      expect(result.carbs).toBeCloseTo(19.64, 2);
      expect(result.fat).toBeCloseTo(0.18, 2);
      expect(result.fiber).toBeCloseTo(1.42, 2);
      expect(result.iron).toBeCloseTo(0.18, 2);
      expect(result.calcium).toBeCloseTo(14.2, 2);
    });

    test('食事記録が空の場合はゼロ栄養価を返す', () => {
      const result = calculateDailyNutrition([]);
      
      expect(result).toEqual({
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        iron: 0,
        calcium: 0
      });
    });
  });

  describe('analyzeNutritionDeficiency 関数', () => {
    test('実際の栄養摂取量と推奨量を比較して不足栄養素を特定する', () => {
      const actualNutrition: Nutrition = {
        protein: 5,
        carbs: 30,
        fat: 3,
        fiber: 2,
        iron: 1,
        calcium: 100
      };

      const recommendedNutrition: Nutrition = {
        protein: 10,
        carbs: 50,
        fat: 5,
        fiber: 3,
        iron: 3,
        calcium: 200
      };

      const result = analyzeNutritionDeficiency(actualNutrition, recommendedNutrition);
      
      expect(result).toEqual(['protein', 'carbs', 'fat', 'fiber', 'iron', 'calcium']);
    });

    test('すべて推奨量を満たしている場合は空配列を返す', () => {
      const actualNutrition: Nutrition = {
        protein: 15,
        carbs: 60,
        fat: 6,
        fiber: 4,
        iron: 4,
        calcium: 250
      };

      const recommendedNutrition: Nutrition = {
        protein: 10,
        carbs: 50,
        fat: 5,
        fiber: 3,
        iron: 3,
        calcium: 200
      };

      const result = analyzeNutritionDeficiency(actualNutrition, recommendedNutrition);
      
      expect(result).toEqual([]);
    });
  });

  describe('generateNutritionAnalysis 関数', () => {
    test('栄養分析レポートを生成する', () => {
      const actualNutrition: Nutrition = {
        protein: 5,
        carbs: 50,  // 推奨量と同じ
        fat: 5,     // 推奨量と同じ
        fiber: 2,
        iron: 2,
        calcium: 150
      };

      const recommendedNutrition: Nutrition = {
        protein: 10,
        carbs: 50,
        fat: 5,
        fiber: 3,
        iron: 3,
        calcium: 200
      };

      const result = generateNutritionAnalysis(actualNutrition, recommendedNutrition);
      
      expect(result.totalNutrition).toEqual(actualNutrition);
      expect(result.recommendedNutrition).toEqual(recommendedNutrition);
      expect(result.achievementRate.protein).toBe(50);
      expect(result.achievementRate.carbs).toBe(100);  // 50/50 * 100
      expect(result.achievementRate.fat).toBe(100);    // 5/5 * 100
      expect(result.achievementRate.fiber).toBe(66);   // 2/3 * 100 = 66.67 → 66 (小数点以下切り捨て)
      expect(result.achievementRate.iron).toBe(66);    // 2/3 * 100 = 66.67 → 66 (小数点以下切り捨て)
      expect(result.achievementRate.calcium).toBe(75); // 150/200 * 100
      expect(result.deficientNutrients).toEqual(['protein', 'fiber', 'iron', 'calcium']);
    });
  });
});