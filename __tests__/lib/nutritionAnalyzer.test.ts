import {
  analyzePeriodNutrition,
  analyzeFoodDiversity,
  generateGrowthReport,
  PeriodNutritionAnalysis,
  FoodDiversityAnalysis
} from '@/lib/nutritionAnalyzer';
import { MealRecord, BabyProfile, FoodItem } from '@/types';
import * as mealRecordManager from '@/lib/mealRecordManager';
import * as profileManager from '@/lib/profileManager';

// モック関数の設定
jest.mock('@/lib/mealRecordManager');
jest.mock('@/lib/profileManager');

describe('栄養分析ロジック', () => {
  const mockMeals: MealRecord[] = [
    {
      id: 'meal-1',
      date: '2024-08-15',
      mealType: 'breakfast',
      foods: [
        {
          name: 'お粥',
          amount: 50,
          nutrition: { protein: 0.75, carbs: 8.0, fat: 0.05, fiber: 0.15, iron: 0.05, calcium: 1.5 }
        },
        {
          name: 'にんじん',
          amount: 20,
          nutrition: { protein: 0.14, carbs: 1.82, fat: 0.04, fiber: 0.56, iron: 0.04, calcium: 5.6 }
        }
      ],
      notes: 'よく食べました',
      createdAt: '2024-08-15T08:00:00.000Z',
      updatedAt: '2024-08-15T08:00:00.000Z'
    },
    {
      id: 'meal-2',
      date: '2024-08-15',
      mealType: 'lunch',
      foods: [
        {
          name: '豆腐',
          amount: 30,
          nutrition: { protein: 1.98, carbs: 0.48, fat: 1.26, fiber: 0.12, iron: 0.27, calcium: 25.8 }
        }
      ],
      notes: '',
      createdAt: '2024-08-15T12:00:00.000Z',
      updatedAt: '2024-08-15T12:00:00.000Z'
    },
    {
      id: 'meal-3',
      date: '2024-08-16',
      mealType: 'breakfast',
      foods: [
        {
          name: 'バナナ',
          amount: 40,
          nutrition: { protein: 0.44, carbs: 9.0, fat: 0.08, fiber: 0.44, iron: 0.12, calcium: 2.4 }
        }
      ],
      notes: '新しい食材',
      createdAt: '2024-08-16T08:00:00.000Z',
      updatedAt: '2024-08-16T08:00:00.000Z'
    },
    {
      id: 'meal-4',
      date: '2024-08-17',
      mealType: 'breakfast',
      foods: [
        {
          name: 'お粥',
          amount: 60,
          nutrition: { protein: 0.9, carbs: 9.6, fat: 0.06, fiber: 0.18, iron: 0.06, calcium: 1.8 }
        },
        {
          name: 'かぼちゃ',
          amount: 25,
          nutrition: { protein: 0.475, carbs: 4.275, fat: 0.075, fiber: 1.025, iron: 0.125, calcium: 5.0 }
        }
      ],
      notes: '',
      createdAt: '2024-08-17T08:00:00.000Z',
      updatedAt: '2024-08-17T08:00:00.000Z'
    }
  ];

  const mockProfile: BabyProfile = {
    id: 'profile-123',
    name: 'テスト太郎',
    birthDate: '2024-02-15', // 6ヶ月
    createdAt: '2024-08-15T00:00:00.000Z',
    updatedAt: '2024-08-15T00:00:00.000Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // 現在日付を固定（2024年8月17日）
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-17T12:00:00.000Z'));
    
    // モック関数の戻り値を設定
    (mealRecordManager.getMealRecords as jest.Mock).mockReturnValue(mockMeals);
    (profileManager.getProfile as jest.Mock).mockReturnValue(mockProfile);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('analyzePeriodNutrition 関数', () => {
    test('指定期間の栄養分析を正しく実行できる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzePeriodNutrition(startDate, endDate, mockProfile);
      
      expect(result.startDate).toBe(startDate);
      expect(result.endDate).toBe(endDate);
      expect(result.totalDays).toBe(3);
      expect(result.recordedDays).toBe(3); // 8/15, 8/16, 8/17すべてに記録あり
      expect(result.period).toBe('2024-08-15 - 2024-08-17');
    });

    test('平均栄養価を正しく計算できる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzePeriodNutrition(startDate, endDate, mockProfile);
      
      // 8/15の合計: protein=2.87, carbs=10.3, fat=1.35, fiber=0.83, iron=0.36, calcium=32.9
      // 8/16の合計: protein=0.44, carbs=9.0, fat=0.08, fiber=0.44, iron=0.12, calcium=2.4
      // 8/17の合計: protein=1.375, carbs=13.875, fat=0.135, fiber=1.205, iron=0.185, calcium=6.8
      // 3日間の平均を計算
      expect(result.averageNutrition.protein).toBeCloseTo(1.562, 2); // (2.87+0.44+1.375)/3
      expect(result.averageNutrition.carbs).toBeCloseTo(11.058, 2); // (10.3+9.0+13.875)/3
      expect(result.averageNutrition.fat).toBeCloseTo(0.522, 2);
      expect(result.averageNutrition.fiber).toBeCloseTo(0.825, 2);
      expect(result.averageNutrition.iron).toBeCloseTo(0.222, 2);
      expect(result.averageNutrition.calcium).toBeCloseTo(14.033, 2);
    });

    test('推奨栄養量との比較を正しく行える', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzePeriodNutrition(startDate, endDate, mockProfile);
      
      // 6ヶ月の推奨栄養量: protein=10, carbs=50, fat=5, fiber=3, iron=3, calcium=200
      expect(result.recommendedNutrition).toEqual({
        protein: 10,
        carbs: 50,
        fat: 5,
        fiber: 3,
        iron: 3,
        calcium: 200
      });
      
      // 達成率を確認（100%を超える場合は100%にキャップ）
      expect(result.achievementRates.protein).toBe(16); // (1.562/10)*100 = 15.62 -> 16
      expect(result.achievementRates.carbs).toBe(22); // (11.058/50)*100 = 22.116 -> 22
      expect(result.achievementRates.fat).toBe(10); // (0.522/5)*100 = 10.44 -> 10
      expect(result.achievementRates.fiber).toBe(27); // (0.825/3)*100 = 27.5 -> 27
      expect(result.achievementRates.iron).toBe(7); // (0.222/3)*100 = 7.4 -> 7
      expect(result.achievementRates.calcium).toBe(7); // (14.033/200)*100 = 7.0165 -> 7
    });

    test('不足栄養素を正しく特定できる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzePeriodNutrition(startDate, endDate, mockProfile);
      
      // 80%未満の栄養素（すべて80%未満なので、全栄養素が不足）
      expect(result.deficientNutrients).toEqual([
        'protein', 'carbs', 'fat', 'fiber', 'iron', 'calcium'
      ]);
    });

    test('記録がない日も正しく処理できる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-20'; // 8/18-8/20は記録なし
      
      const result = analyzePeriodNutrition(startDate, endDate, mockProfile);
      
      expect(result.totalDays).toBe(6);
      expect(result.recordedDays).toBe(3); // 8/15, 8/16, 8/17のみ
      expect(result.dailyAnalysis).toHaveLength(6);
      
      // 記録がない日のデータを確認
      const noRecordDay = result.dailyAnalysis.find(day => day.date === '2024-08-18');
      expect(noRecordDay?.hasRecord).toBe(false);
      expect(noRecordDay?.mealCount).toBe(0);
      expect(noRecordDay?.nutrition).toEqual({
        protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0
      });
    });

    test('プロフィールがない場合も正しく処理できる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzePeriodNutrition(startDate, endDate);
      
      expect(result.recommendedNutrition).toBeNull();
      expect(result.achievementRates).toEqual({
        protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0
      });
      expect(result.deficientNutrients).toEqual([]);
    });
  });

  describe('analyzeFoodDiversity 関数', () => {
    test('食材多様性を正しく分析できる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzeFoodDiversity(startDate, endDate);
      
      expect(result.period).toBe('2024-08-15 - 2024-08-17');
      expect(result.totalFoods).toBe(6); // お粥、にんじん、豆腐、バナナ、お粥、かぼちゃ
      expect(result.uniqueFoods).toEqual(['お粥', 'にんじん', '豆腐', 'バナナ', 'かぼちゃ']);
      expect(result.uniqueFoods).toHaveLength(5);
    });

    test('使用頻度の高い食材を正しくランキングできる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzeFoodDiversity(startDate, endDate);
      
      // お粥が2回、その他が1回ずつ
      expect(result.topFoods[0]).toEqual({ name: 'お粥', count: 2 });
      expect(result.topFoods[1].count).toBe(1);
      expect(result.topFoods).toHaveLength(5);
    });

    test('新しく導入された食材を特定できる', () => {
      // 前の期間の食事記録を追加
      const previousMeals = [
        {
          id: 'meal-prev',
          date: '2024-08-12',
          mealType: 'breakfast' as const,
          foods: [
            {
              name: 'お粥',
              amount: 40,
              nutrition: { protein: 0.6, carbs: 6.4, fat: 0.04, fiber: 0.12, iron: 0.04, calcium: 1.2 }
            }
          ],
          notes: '',
          createdAt: '2024-08-12T08:00:00.000Z',
          updatedAt: '2024-08-12T08:00:00.000Z'
        }
      ];
      
      (mealRecordManager.getMealRecords as jest.Mock).mockReturnValue([...previousMeals, ...mockMeals]);
      
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzeFoodDiversity(startDate, endDate);
      
      // お粥は前の期間にもあるので、新しい食材は にんじん、豆腐、バナナ、かぼちゃ
      expect(result.newFoodsIntroduced).toEqual(
        expect.arrayContaining(['にんじん', '豆腐', 'バナナ', 'かぼちゃ'])
      );
      expect(result.newFoodsIntroduced).toHaveLength(4);
    });
  });

  describe('generateGrowthReport 関数', () => {
    test('週間レポートを正しく生成できる', () => {
      const result = generateGrowthReport('week');
      
      expect(result).not.toBeNull();
      expect(result?.profile).toEqual(mockProfile);
      expect(result?.currentAge).toBe(6); // 6ヶ月
      expect(result?.periodAnalysis).toBeDefined();
      expect(result?.diversityAnalysis).toBeDefined();
      expect(result?.trends).toBeDefined();
      expect(result?.recommendations).toBeDefined();
    });

    test('月間レポートを正しく生成できる', () => {
      const result = generateGrowthReport('month');
      
      expect(result).not.toBeNull();
      expect(result?.periodAnalysis.startDate).toBeDefined();
      expect(result?.periodAnalysis.endDate).toBe('2024-08-17'); // 今日の日付
    });

    test('カスタム期間レポートを正しく生成できる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = generateGrowthReport('custom', startDate, endDate);
      
      expect(result).not.toBeNull();
      expect(result?.periodAnalysis.startDate).toBe(startDate);
      expect(result?.periodAnalysis.endDate).toBe(endDate);
    });

    test('プロフィールがない場合はnullを返す', () => {
      (profileManager.getProfile as jest.Mock).mockReturnValue(null);
      
      const result = generateGrowthReport('week');
      
      expect(result).toBeNull();
    });

    test('レコメンデーションを正しく生成できる', () => {
      const result = generateGrowthReport('week');
      
      expect(result?.recommendations).toBeDefined();
      expect(Array.isArray(result?.recommendations)).toBe(true);
      expect(result!.recommendations.length).toBeGreaterThan(0);
      
      // 不足栄養素に関するレコメンデーションが含まれることを確認
      const nutritionRecommendation = result!.recommendations.find(rec => 
        rec.includes('不足気味です')
      );
      expect(nutritionRecommendation).toBeDefined();
    });

    test('栄養摂取トレンドを正しく分析できる', () => {
      const result = generateGrowthReport('week');
      
      expect(result?.trends).toBeDefined();
      expect(result?.trends.weeklyProgress).toBeDefined();
      expect(result?.trends.improvingNutrients).toBeDefined();
      expect(result?.trends.decliningNutrients).toBeDefined();
      expect(typeof result?.trends.consistencyScore).toBe('number');
      expect(result!.trends.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(result!.trends.consistencyScore).toBeLessThanOrEqual(100);
    });
  });

  describe('エッジケース', () => {
    test('食事記録が全くない期間を正しく処理できる', () => {
      (mealRecordManager.getMealRecords as jest.Mock).mockReturnValue([]);
      
      const startDate = '2024-08-15';
      const endDate = '2024-08-17';
      
      const result = analyzePeriodNutrition(startDate, endDate, mockProfile);
      
      expect(result.recordedDays).toBe(0);
      expect(result.averageNutrition).toEqual({
        protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0
      });
      expect(result.achievementRates).toEqual({
        protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0
      });
    });

    test('1日だけの期間を正しく処理できる', () => {
      const startDate = '2024-08-15';
      const endDate = '2024-08-15';
      
      const result = analyzePeriodNutrition(startDate, endDate, mockProfile);
      
      expect(result.totalDays).toBe(1);
      expect(result.recordedDays).toBe(1);
      expect(result.dailyAnalysis).toHaveLength(1);
      expect(result.dailyAnalysis[0].date).toBe('2024-08-15');
      expect(result.dailyAnalysis[0].hasRecord).toBe(true);
    });

    test('未来の日付を含む期間を正しく処理できる', () => {
      const startDate = '2024-08-17';
      const endDate = '2024-08-20'; // 未来の日付を含む
      
      const result = analyzePeriodNutrition(startDate, endDate, mockProfile);
      
      expect(result.totalDays).toBe(4);
      expect(result.recordedDays).toBe(1); // 8/17のみ記録あり
      
      // 未来の日付は記録なしとして処理される
      const futureDay = result.dailyAnalysis.find(day => day.date === '2024-08-18');
      expect(futureDay?.hasRecord).toBe(false);
    });
  });
});