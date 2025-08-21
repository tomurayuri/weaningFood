'use client';

import { Nutrition } from '@/types';
import { PeriodNutritionAnalysis, WeeklyProgress } from '@/lib/nutritionAnalyzer';

/**
 * 栄養チャートコンポーネントのプロパティ
 */
interface NutritionChartProps {
  /** 分析データ */
  analysis: PeriodNutritionAnalysis;
  /** チャートタイプ */
  chartType: 'bar' | 'line' | 'radar';
  /** 表示する栄養素 */
  nutrients?: Array<keyof Nutrition>;
}

/**
 * 週別進捗チャートのプロパティ
 */
interface WeeklyProgressChartProps {
  /** 週別進捗データ */
  weeklyData: WeeklyProgress[];
}

/**
 * 栄養価を表示形式にフォーマット
 */
function formatNutrition(value: number): string {
  return value < 1 ? value.toFixed(2) : value.toFixed(1);
}

/**
 * 達成率に基づく色を取得
 */
function getAchievementColor(rate: number): string {
  if (rate >= 100) return 'bg-green-500';
  if (rate >= 80) return 'bg-green-400';
  if (rate >= 60) return 'bg-yellow-400';
  if (rate >= 40) return 'bg-orange-400';
  return 'bg-red-400';
}

/**
 * 栄養バランスチャート（バー形式）
 */
export function NutritionBarChart({ analysis }: { analysis: PeriodNutritionAnalysis }) {
  const nutrients = [
    { key: 'protein' as keyof Nutrition, label: 'タンパク質', unit: 'g' },
    { key: 'carbs' as keyof Nutrition, label: '炭水化物', unit: 'g' },
    { key: 'fat' as keyof Nutrition, label: '脂質', unit: 'g' },
    { key: 'fiber' as keyof Nutrition, label: '食物繊維', unit: 'g' },
    { key: 'iron' as keyof Nutrition, label: '鉄分', unit: 'mg' },
    { key: 'calcium' as keyof Nutrition, label: 'カルシウム', unit: 'mg' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">栄養摂取状況</h3>
      
      <div className="space-y-4">
        {nutrients.map(({ key, label, unit }) => {
          const actualValue = analysis.averageNutrition[key];
          const recommendedValue = analysis.recommendedNutrition?.[key] || 0;
          const achievementRate = analysis.achievementRates[key];
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-600">
                  {formatNutrition(actualValue)}{unit} / {formatNutrition(recommendedValue)}{unit}
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium text-white ${getAchievementColor(achievementRate)}`}>
                    {achievementRate}%
                  </span>
                </span>
              </div>
              
              {/* プログレスバー */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getAchievementColor(achievementRate)}`}
                  style={{ width: `${Math.min(100, achievementRate)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 不足栄養素の警告 */}
      {analysis.deficientNutrients.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">不足している栄養素があります</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {analysis.deficientNutrients.map(nutrient => {
                    const names = { protein: 'タンパク質', carbs: '炭水化物', fat: '脂質', fiber: '食物繊維', iron: '鉄分', calcium: 'カルシウム' };
                    return names[nutrient];
                  }).join('、')}が推奨量の80%未満です。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 週別進捗チャート
 */
export function WeeklyProgressChart({ weeklyData }: WeeklyProgressChartProps) {
  if (weeklyData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">週別進捗</h3>
        <p className="text-gray-500 text-center py-8">データが不足しています</p>
      </div>
    );
  }

  const maxAchievementRate = Math.max(...weeklyData.map(week => week.achievementRate));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">週別進捗</h3>
      
      {/* チャートエリア */}
      <div className="relative h-64 mb-4">
        {/* Y軸ラベル */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        
        {/* グリッドライン */}
        <div className="absolute left-8 top-0 right-0 h-full">
          {[0, 25, 50, 75, 100].map(value => (
            <div 
              key={value} 
              className="absolute w-full border-t border-gray-200" 
              style={{ top: `${100 - value}%` }}
            />
          ))}
        </div>
        
        {/* バー */}
        <div className="absolute left-8 top-0 right-0 h-full flex items-end justify-between space-x-2">
          {weeklyData.map((week, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${week.achievementRate}%` }}
                title={`${week.week}: ${week.achievementRate}%達成`}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* X軸ラベル */}
      <div className="flex justify-between text-xs text-gray-500 ml-8">
        {weeklyData.map((week, index) => (
          <span key={index} className="flex-1 text-center">{week.week}</span>
        ))}
      </div>
      
      {/* 統計情報 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">平均達成率</p>
            <p className="text-xl font-semibold text-gray-800">
              {Math.round(weeklyData.reduce((sum, week) => sum + week.achievementRate, 0) / weeklyData.length)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">最高達成率</p>
            <p className="text-xl font-semibold text-green-600">
              {Math.max(...weeklyData.map(week => week.achievementRate))}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 日別記録状況チャート
 */
export function DailyRecordChart({ analysis }: { analysis: PeriodNutritionAnalysis }) {
  const recordedDays = analysis.dailyAnalysis.filter(day => day.hasRecord).length;
  const recordingRate = Math.round((recordedDays / analysis.totalDays) * 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">記録継続状況</h3>
      
      {/* 記録率の円グラフ風表示 */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* 背景円 */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            {/* 進捗円 */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - recordingRate / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{recordingRate}%</span>
          </div>
        </div>
      </div>
      
      {/* 統計情報 */}
      <div className="space-y-3 text-center">
        <div>
          <p className="text-sm text-gray-600">記録日数</p>
          <p className="text-lg font-semibold text-gray-800">
            {recordedDays} / {analysis.totalDays}日
          </p>
        </div>
        
        {recordingRate < 70 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-700">
              記録の継続性を上げることで、より正確な栄養分析が可能になります。
            </p>
          </div>
        )}
        
        {recordingRate >= 90 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              素晴らしい継続率です！この調子で記録を続けていきましょう。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}