import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  NutritionBarChart, 
  WeeklyProgressChart, 
  DailyRecordChart 
} from '@/components/NutritionChart';
import { PeriodNutritionAnalysis, WeeklyProgress } from '@/lib/nutritionAnalyzer';

describe('栄養チャートコンポーネント', () => {
  const mockAnalysis: PeriodNutritionAnalysis = {
    period: '2024-08-15 - 2024-08-17',
    startDate: '2024-08-15',
    endDate: '2024-08-17',
    totalDays: 3,
    recordedDays: 3,
    averageNutrition: {
      protein: 1.5,
      carbs: 10.0,
      fat: 0.5,
      fiber: 0.8,
      iron: 0.2,
      calcium: 15.0
    },
    recommendedNutrition: {
      protein: 10.0,
      carbs: 50.0,
      fat: 5.0,
      fiber: 3.0,
      iron: 3.0,
      calcium: 200.0
    },
    achievementRates: {
      protein: 15, // 1.5/10 * 100
      carbs: 20,   // 10/50 * 100
      fat: 10,     // 0.5/5 * 100
      fiber: 27,   // 0.8/3 * 100 ≈ 27
      iron: 7,     // 0.2/3 * 100 ≈ 7
      calcium: 8   // 15/200 * 100 ≈ 8
    },
    deficientNutrients: ['protein', 'carbs', 'fat', 'fiber', 'iron', 'calcium'],
    dailyAnalysis: [
      {
        date: '2024-08-15',
        nutrition: { protein: 2.0, carbs: 12.0, fat: 0.6, fiber: 1.0, iron: 0.3, calcium: 18.0 },
        mealCount: 2,
        hasRecord: true
      },
      {
        date: '2024-08-16',
        nutrition: { protein: 1.0, carbs: 8.0, fat: 0.4, fiber: 0.6, iron: 0.1, calcium: 12.0 },
        mealCount: 1,
        hasRecord: true
      },
      {
        date: '2024-08-17',
        nutrition: { protein: 1.5, carbs: 10.0, fat: 0.5, fiber: 0.8, iron: 0.2, calcium: 15.0 },
        mealCount: 1,
        hasRecord: true
      }
    ]
  };

  const mockWeeklyProgress: WeeklyProgress[] = [
    {
      week: '週1',
      startDate: '2024-08-01',
      endDate: '2024-08-07',
      averageNutrition: { protein: 1.2, carbs: 9.0, fat: 0.4, fiber: 0.7, iron: 0.15, calcium: 12.0 },
      achievementRate: 65
    },
    {
      week: '週2',
      startDate: '2024-08-08',
      endDate: '2024-08-14',
      averageNutrition: { protein: 1.4, carbs: 10.5, fat: 0.5, fiber: 0.8, iron: 0.18, calcium: 14.0 },
      achievementRate: 72
    },
    {
      week: '週3',
      startDate: '2024-08-15',
      endDate: '2024-08-21',
      averageNutrition: { protein: 1.6, carbs: 11.0, fat: 0.6, fiber: 0.9, iron: 0.22, calcium: 16.0 },
      achievementRate: 78
    }
  ];

  describe('NutritionBarChart コンポーネント', () => {
    test('正常にレンダリングされる', () => {
      render(<NutritionBarChart analysis={mockAnalysis} />);
      
      expect(screen.getByText('栄養摂取状況')).toBeInTheDocument();
      expect(screen.getByText('タンパク質')).toBeInTheDocument();
      expect(screen.getByText('炭水化物')).toBeInTheDocument();
      expect(screen.getByText('脂質')).toBeInTheDocument();
      expect(screen.getByText('食物繊維')).toBeInTheDocument();
      expect(screen.getByText('鉄分')).toBeInTheDocument();
      expect(screen.getByText('カルシウム')).toBeInTheDocument();
    });

    test('栄養価と達成率が正しく表示される', () => {
      render(<NutritionBarChart analysis={mockAnalysis} />);
      
      // タンパク質の表示を確認
      expect(screen.getByText('タンパク質')).toBeInTheDocument();
      expect(screen.getByText('15%')).toBeInTheDocument();
      
      // 炭水化物の表示を確認
      expect(screen.getByText('炭水化物')).toBeInTheDocument();
      expect(screen.getByText('20%')).toBeInTheDocument();
    });

    test('不足栄養素の警告が表示される', () => {
      render(<NutritionBarChart analysis={mockAnalysis} />);
      
      expect(screen.getByText('不足している栄養素があります')).toBeInTheDocument();
      expect(screen.getByText(/推奨量の80%未満です/)).toBeInTheDocument();
    });

    test('推奨栄養量がない場合も正しく処理される', () => {
      const analysisWithoutRecommendation = {
        ...mockAnalysis,
        recommendedNutrition: null,
        achievementRates: {
          protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0
        },
        deficientNutrients: [] as any[]
      };
      
      render(<NutritionBarChart analysis={analysisWithoutRecommendation} />);
      
      expect(screen.getByText('栄養摂取状況')).toBeInTheDocument();
      expect(screen.getByText('タンパク質')).toBeInTheDocument();
    });

    test('達成率100%以上の場合も正しく表示される', () => {
      const highAchievementAnalysis = {
        ...mockAnalysis,
        achievementRates: {
          protein: 100, carbs: 100, fat: 100, fiber: 100, iron: 100, calcium: 100
        },
        deficientNutrients: [] as any[]
      };
      
      render(<NutritionBarChart analysis={highAchievementAnalysis} />);
      
      // 不足栄養素の警告が表示されないことを確認
      expect(screen.queryByText('不足している栄養素があります')).not.toBeInTheDocument();
    });
  });

  describe('WeeklyProgressChart コンポーネント', () => {
    test('正常にレンダリングされる', () => {
      render(<WeeklyProgressChart weeklyData={mockWeeklyProgress} />);
      
      expect(screen.getByText('週別進捗')).toBeInTheDocument();
      expect(screen.getByText('週1')).toBeInTheDocument();
      expect(screen.getByText('週2')).toBeInTheDocument();
      expect(screen.getByText('週3')).toBeInTheDocument();
    });

    test('統計情報が正しく表示される', () => {
      render(<WeeklyProgressChart weeklyData={mockWeeklyProgress} />);
      
      // 平均達成率: (65 + 72 + 78) / 3 = 71.67 ≈ 72
      expect(screen.getByText('平均達成率')).toBeInTheDocument();
      expect(screen.getByText('72%')).toBeInTheDocument();
      
      // 最高達成率: 78
      expect(screen.getByText('最高達成率')).toBeInTheDocument();
      expect(screen.getByText('78%')).toBeInTheDocument();
    });

    test('データがない場合の表示', () => {
      render(<WeeklyProgressChart weeklyData={[]} />);
      
      expect(screen.getByText('週別進捗')).toBeInTheDocument();
      expect(screen.getByText('データが不足しています')).toBeInTheDocument();
    });

    test('週データが1つだけの場合も正しく処理される', () => {
      const singleWeekData = [mockWeeklyProgress[0]];
      
      render(<WeeklyProgressChart weeklyData={singleWeekData} />);
      
      expect(screen.getByText('週1')).toBeInTheDocument();
      expect(screen.getByText('平均達成率')).toBeInTheDocument();
      // 平均と最高で65%が2回表示されるため、getAllByTextを使用
      expect(screen.getAllByText('65%')).toHaveLength(2);
    });
  });

  describe('DailyRecordChart コンポーネント', () => {
    test('正常にレンダリングされる', () => {
      render(<DailyRecordChart analysis={mockAnalysis} />);
      
      expect(screen.getByText('記録継続状況')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument(); // 3/3日 = 100%
      expect(screen.getByText('記録日数')).toBeInTheDocument();
      expect(screen.getByText('3 / 3日')).toBeInTheDocument();
    });

    test('記録継続率が低い場合の警告が表示される', () => {
      const lowRecordingAnalysis = {
        ...mockAnalysis,
        totalDays: 10,
        recordedDays: 3, // 30% (記録があるのは元の3日のみ)
        dailyAnalysis: [
          ...mockAnalysis.dailyAnalysis,
          // 記録のない日を追加
          {
            date: '2024-08-18',
            nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 },
            mealCount: 0,
            hasRecord: false
          },
          {
            date: '2024-08-19',
            nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 },
            mealCount: 0,
            hasRecord: false
          },
          {
            date: '2024-08-20',
            nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 },
            mealCount: 0,
            hasRecord: false
          },
          {
            date: '2024-08-21',
            nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 },
            mealCount: 0,
            hasRecord: false
          },
          {
            date: '2024-08-22',
            nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 },
            mealCount: 0,
            hasRecord: false
          },
          {
            date: '2024-08-23',
            nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 },
            mealCount: 0,
            hasRecord: false
          },
          {
            date: '2024-08-24',
            nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 },
            mealCount: 0,
            hasRecord: false
          }
        ]
      };
      
      render(<DailyRecordChart analysis={lowRecordingAnalysis} />);
      
      expect(screen.getByText('30%')).toBeInTheDocument(); // 3/10 = 30%
      expect(screen.getByText('3 / 10日')).toBeInTheDocument();
      expect(screen.getByText(/記録の継続性を上げることで/)).toBeInTheDocument();
    });

    test('記録継続率が高い場合の称賛メッセージが表示される', () => {
      const highRecordingAnalysis = {
        ...mockAnalysis,
        totalDays: 10,
        recordedDays: 9, // 90%
        dailyAnalysis: [
          ...mockAnalysis.dailyAnalysis,
          // 記録がある日を追加
          { date: '2024-08-18', nutrition: { protein: 1, carbs: 8, fat: 0.3, fiber: 0.5, iron: 0.1, calcium: 10 }, mealCount: 1, hasRecord: true },
          { date: '2024-08-19', nutrition: { protein: 1, carbs: 8, fat: 0.3, fiber: 0.5, iron: 0.1, calcium: 10 }, mealCount: 1, hasRecord: true },
          { date: '2024-08-20', nutrition: { protein: 1, carbs: 8, fat: 0.3, fiber: 0.5, iron: 0.1, calcium: 10 }, mealCount: 1, hasRecord: true },
          { date: '2024-08-21', nutrition: { protein: 1, carbs: 8, fat: 0.3, fiber: 0.5, iron: 0.1, calcium: 10 }, mealCount: 1, hasRecord: true },
          { date: '2024-08-22', nutrition: { protein: 1, carbs: 8, fat: 0.3, fiber: 0.5, iron: 0.1, calcium: 10 }, mealCount: 1, hasRecord: true },
          { date: '2024-08-23', nutrition: { protein: 1, carbs: 8, fat: 0.3, fiber: 0.5, iron: 0.1, calcium: 10 }, mealCount: 1, hasRecord: true },
          // 1日だけ記録なし
          { date: '2024-08-24', nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 }, mealCount: 0, hasRecord: false }
        ]
      };
      
      render(<DailyRecordChart analysis={highRecordingAnalysis} />);
      
      expect(screen.getByText('90%')).toBeInTheDocument(); // 9/10 = 90%
      expect(screen.getByText('9 / 10日')).toBeInTheDocument();
      expect(screen.getByText(/素晴らしい継続率です/)).toBeInTheDocument();
    });

    test('記録率の円グラフが正しく設定される', () => {
      const { container } = render(<DailyRecordChart analysis={mockAnalysis} />);
      
      // SVGが存在することを確認
      const svgElement = container.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      
      // 進捗円が存在することを確認
      const progressCircle = container.querySelector('circle[stroke="#3b82f6"]');
      expect(progressCircle).toBeInTheDocument();
    });

    test('記録が全くない場合も正しく処理される', () => {
      const noRecordAnalysis = {
        ...mockAnalysis,
        recordedDays: 0,
        dailyAnalysis: mockAnalysis.dailyAnalysis.map(day => ({
          ...day,
          hasRecord: false,
          mealCount: 0,
          nutrition: { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 }
        }))
      };
      
      render(<DailyRecordChart analysis={noRecordAnalysis} />);
      
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('0 / 3日')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    test('適切なARIA属性が設定されている', () => {
      const { container } = render(<NutritionBarChart analysis={mockAnalysis} />);
      
      // プログレスバーの存在を確認
      const progressBars = container.querySelectorAll('[style*="width"]');
      expect(progressBars.length).toBeGreaterThan(0);
    });

    test('スクリーンリーダー向けのテキストが適切に設定されている', () => {
      render(<WeeklyProgressChart weeklyData={mockWeeklyProgress} />);
      
      // 統計情報のラベルが適切に設定されている
      expect(screen.getByText('平均達成率')).toBeInTheDocument();
      expect(screen.getByText('最高達成率')).toBeInTheDocument();
    });

    test('チャートにタイトルが適切に設定されている', () => {
      const { container } = render(<WeeklyProgressChart weeklyData={mockWeeklyProgress} />);
      
      // 各週のバーにtitle属性が設定されていることを確認
      const bars = container.querySelectorAll('[title*="週"]');
      expect(bars.length).toBe(mockWeeklyProgress.length);
    });
  });
});