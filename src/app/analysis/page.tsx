'use client';

import { useState } from 'react';
import { analyzePeriodNutrition, generateGrowthReport } from '@/lib/nutritionAnalyzer';
import { NutritionBarChart, WeeklyProgressChart, DailyRecordChart } from '@/components/NutritionChart';
import { getProfile } from '@/lib/profileManager';

export default function AnalysisPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  
  // プロファイルを取得
  const profile = getProfile();

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">プロフィールが登録されていません</h2>
          <p className="text-yellow-700">栄養分析を行うには、まずプロフィールを登録してください。</p>
        </div>
      </div>
    );
  }

  // 期間を計算
  const today = new Date();
  const getAnalysisDates = () => {
    if (selectedPeriod === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return {
        startDate: weekAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    } else {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      return {
        startDate: monthAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
    }
  };

  const { startDate, endDate } = getAnalysisDates();
  const analysis = analyzePeriodNutrition(startDate, endDate, profile);
  const growthReport = generateGrowthReport(selectedPeriod);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">栄養分析</h1>
        <p className="text-gray-600">赤ちゃんの栄養摂取状況を分析します</p>
      </div>

      {/* 期間選択 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">分析期間</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            週間 (7日)
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            月間 (30日)
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          分析期間: {analysis.startDate} 〜 {analysis.endDate}
        </p>
      </div>

      {/* 記録状況の概要 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">記録状況</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{analysis.totalDays}</p>
            <p className="text-sm text-gray-600">総日数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{analysis.recordedDays}</p>
            <p className="text-sm text-gray-600">記録日数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((analysis.recordedDays / analysis.totalDays) * 100)}%
            </p>
            <p className="text-sm text-gray-600">記録率</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {analysis.deficientNutrients.length}
            </p>
            <p className="text-sm text-gray-600">不足栄養素</p>
          </div>
        </div>
      </div>

      {/* チャート表示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NutritionBarChart analysis={analysis} />
        <DailyRecordChart analysis={analysis} />
      </div>

      {/* 週別進捗（月間の場合のみ） */}
      {growthReport && growthReport.trends.weeklyProgress.length > 1 && (
        <WeeklyProgressChart weeklyData={growthReport.trends.weeklyProgress} />
      )}

      {/* レコメンデーション */}
      {growthReport && growthReport.recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">アドバイス</h2>
          <div className="space-y-3">
            {growthReport.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 記録がない場合のメッセージ */}
      {analysis.recordedDays === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">記録がありません</h3>
          <p className="text-gray-600">選択した期間に食事記録がありません。まずは食事を記録してみましょう。</p>
        </div>
      )}
    </div>
  );
}