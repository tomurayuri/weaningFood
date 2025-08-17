import { 
  getNutritionRecommendation, 
  calculateAgeInMonths, 
  nutritionRecommendations 
} from '@/data/nutritionRecommendations';

describe('月齢別推奨栄養量データ', () => {
  describe('calculateAgeInMonths 関数', () => {
    test('誕生日から正しい月齢を計算する', () => {
      // 現在日を固定して計算の一貫性を保つ
      const mockDate = new Date('2024-08-16');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      // 6ヶ月前の誕生日
      const birthDate = '2024-02-16';
      expect(calculateAgeInMonths(birthDate)).toBe(6);

      // 8ヶ月前の誕生日
      const birthDate2 = '2023-12-16';
      expect(calculateAgeInMonths(birthDate2)).toBe(8);

      jest.useRealTimers();
    });

    test('誕生日が未来の場合は0ヶ月を返す', () => {
      const futureDate = '2025-12-31';
      expect(calculateAgeInMonths(futureDate)).toBe(0);
    });
  });

  describe('getNutritionRecommendation 関数', () => {
    test('5-6ヶ月（初期）の推奨栄養量を返す', () => {
      const recommendation = getNutritionRecommendation(5);
      expect(recommendation).toEqual({
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
      });
    });

    test('7-8ヶ月（中期）の推奨栄養量を返す', () => {
      const recommendation = getNutritionRecommendation(7);
      expect(recommendation).toEqual({
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
      });
    });

    test('9-11ヶ月（後期）の推奨栄養量を返す', () => {
      const recommendation = getNutritionRecommendation(10);
      expect(recommendation).toEqual({
        ageMonths: 10,
        mealsPerDay: 3,
        nutrition: {
          protein: 20,
          carbs: 100,
          fat: 12,
          fiber: 7,
          iron: 5,
          calcium: 400
        }
      });
    });

    test('12ヶ月以降（完了期）の推奨栄養量を返す', () => {
      const recommendation = getNutritionRecommendation(15);
      expect(recommendation).toEqual({
        ageMonths: 15,
        mealsPerDay: 4, // 3回食 + おやつ
        nutrition: {
          protein: 25,
          carbs: 120,
          fat: 15,
          fiber: 8,
          iron: 6,
          calcium: 450
        }
      });
    });

    test('新生児（0-4ヶ月）の場合はnullを返す', () => {
      const recommendation = getNutritionRecommendation(3);
      expect(recommendation).toBeNull();
    });

    test('負の月齢の場合はnullを返す', () => {
      const recommendation = getNutritionRecommendation(-1);
      expect(recommendation).toBeNull();
    });
  });

  describe('nutritionRecommendations データ', () => {
    test('推奨栄養量データが正しく定義されている', () => {
      expect(nutritionRecommendations).toHaveLength(4);
      
      // 月齢順にソートされていることを確認
      const ageMonths = nutritionRecommendations.map(r => r.ageMonths);
      expect(ageMonths).toEqual([5, 7, 9, 12]);
    });

    test('各推奨栄養量データに必要なプロパティが含まれている', () => {
      nutritionRecommendations.forEach((recommendation) => {
        expect(recommendation).toHaveProperty('ageMonths');
        expect(recommendation).toHaveProperty('mealsPerDay');
        expect(recommendation).toHaveProperty('nutrition');
        
        const nutrition = recommendation.nutrition;
        expect(nutrition).toHaveProperty('protein');
        expect(nutrition).toHaveProperty('carbs');
        expect(nutrition).toHaveProperty('fat');
        expect(nutrition).toHaveProperty('fiber');
        expect(nutrition).toHaveProperty('iron');
        expect(nutrition).toHaveProperty('calcium');
      });
    });

    test('栄養素の値がすべて正の数値である', () => {
      nutritionRecommendations.forEach((recommendation) => {
        const nutrition = recommendation.nutrition;
        Object.values(nutrition).forEach((value) => {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThan(0);
        });
      });
    });

    test('月齢が進むにつれて栄養量が増加している', () => {
      for (let i = 1; i < nutritionRecommendations.length; i++) {
        const prev = nutritionRecommendations[i - 1];
        const current = nutritionRecommendations[i];
        
        expect(current.nutrition.protein).toBeGreaterThan(prev.nutrition.protein);
        expect(current.nutrition.carbs).toBeGreaterThan(prev.nutrition.carbs);
        expect(current.mealsPerDay).toBeGreaterThanOrEqual(prev.mealsPerDay);
      }
    });
  });
});