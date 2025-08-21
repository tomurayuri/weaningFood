'use client';

import { useState } from 'react';
import { generateGrowthReport, analyzeFoodDiversity } from '@/lib/nutritionAnalyzer';
import { WeeklyProgressChart } from '@/components/NutritionChart';
import { getProfile } from '@/lib/profileManager';
import { calculateAgeInMonths } from '@/data/nutritionRecommendations';

export default function ReportPage() {
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month'>('month');
  
  const profile = getProfile();

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">プロフィールが登録されていません</h2>
          <p className="text-yellow-700">成長レポートを作成するには、まずプロフィールを登録してください。</p>
        </div>
      </div>
    );
  }

  const growthReport = generateGrowthReport(reportPeriod);
  const currentAge = calculateAgeInMonths(profile.birthDate);

  // 食材多様性を取得
  const today = new Date();
  const periodStart = reportPeriod === 'week' ? 
    new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) : 
    new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const diversityAnalysis = analyzeFoodDiversity(
    periodStart.toISOString().split('T')[0],
    today.toISOString().split('T')[0]
  );

  if (!growthReport) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">レポートを生成できませんでした</h2>
          <p className="text-red-700">食事記録が不足している可能性があります。</p>
        </div>
      </div>
    );
  }

  const getAgeStageText = (ageMonths: number): string => {
    if (ageMonths < 6) return '離乳食開始前';
    if (ageMonths < 8) return '離乳食初期 (5-6ヶ月)';
    if (ageMonths < 12) return '離乳食中期 (7-11ヶ月)';
    return '離乳食後期 (12ヶ月以降)';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const overallAchievementRate = Math.round(
    Object.values(growthReport.periodAnalysis.achievementRates)
      .reduce((sum, rate) => sum + rate, 0) / 6
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">成長レポート</h1>
        <p className="text-gray-600">{profile.name}ちゃんの栄養摂取レポート</p>
      </div>

      {/* 期間選択 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">レポート期間</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setReportPeriod('week')}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                reportPeriod === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              週間
            </button>
            <button
              onClick={() => setReportPeriod('month')}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                reportPeriod === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              月間
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {formatDate(growthReport.periodAnalysis.startDate)} 〜 {formatDate(growthReport.periodAnalysis.endDate)}
        </p>
      </div>

      {/* プロフィール情報 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">基本情報</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">名前</p>
            <p className="font-medium">{profile.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">月齢</p>
            <p className="font-medium">{currentAge}ヶ月</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">発達段階</p>
            <p className="font-medium text-blue-600">{getAgeStageText(currentAge)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">生年月日</p>
            <p className="font-medium">{formatDate(profile.birthDate)}</p>
          </div>
        </div>
      </div>

      {/* 総合評価 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">総合評価</h2>
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-2">
            <span className="text-2xl font-bold text-blue-600">{overallAchievementRate}%</span>
          </div>
          <p className="text-gray-700">栄養推奨量達成率</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{growthReport.periodAnalysis.recordedDays}</p>
            <p className="text-sm text-gray-600">記録日数</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-purple-600">{diversityAnalysis.uniqueFoods.length}</p>
            <p className="text-sm text-gray-600">摂取食材数</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-orange-600">{diversityAnalysis.newFoodsIntroduced.length}</p>
            <p className="text-sm text-gray-600">新規食材数</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">{growthReport.periodAnalysis.deficientNutrients.length}</p>
            <p className="text-sm text-gray-600">不足栄養素</p>
          </div>
        </div>
      </div>

      {/* 食材多様性 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">食材の多様性</h2>
        
        {/* よく使用された食材 */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">よく使用された食材</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {diversityAnalysis.topFoods.slice(0, 6).map((food, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{food.name}</span>
                  <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {food.count}回
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 新しく導入された食材 */}
        {diversityAnalysis.newFoodsIntroduced.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">新しく導入された食材</h3>
            <div className="flex flex-wrap gap-2">
              {diversityAnalysis.newFoodsIntroduced.map((food, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 週別進捗（月間レポートの場合） */}
      {reportPeriod === 'month' && growthReport.trends.weeklyProgress.length > 1 && (
        <WeeklyProgressChart weeklyData={growthReport.trends.weeklyProgress} />
      )}

      {/* トレンド分析 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">栄養摂取トレンド</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 改善している栄養素 */}
          <div>
            <h3 className="text-md font-medium text-green-600 mb-3">改善傾向</h3>
            {growthReport.trends.improvingNutrients.length > 0 ? (
              <div className="space-y-2">
                {growthReport.trends.improvingNutrients.map((nutrient, index) => {
                  const names = {
                    protein: 'タンパク質',
                    carbs: '炭水化物',
                    fat: '脂質',
                    fiber: '食物繊維',
                    iron: '鉄分',
                    calcium: 'カルシウム'
                  };
                  return (
                    <div key={index} className="bg-green-50 p-2 rounded">
                      <span className="text-green-700 font-medium">{names[nutrient]}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">データが不足しています</p>
            )}
          </div>

          {/* 低下している栄養素 */}
          <div>
            <h3 className="text-md font-medium text-orange-600 mb-3">注意が必要</h3>
            {growthReport.trends.decliningNutrients.length > 0 ? (
              <div className="space-y-2">
                {growthReport.trends.decliningNutrients.map((nutrient, index) => {
                  const names = {
                    protein: 'タンパク質',
                    carbs: '炭水化物',
                    fat: '脂質',
                    fiber: '食物繊維',
                    iron: '鉄分',
                    calcium: 'カルシウム'
                  };
                  return (
                    <div key={index} className="bg-orange-50 p-2 rounded">
                      <span className="text-orange-700 font-medium">{names[nutrient]}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">特に問題ありません</p>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">記録継続スコア:</span> {growthReport.trends.consistencyScore}%
          </p>
        </div>
      </div>

      {/* アドバイス */}
      {growthReport.recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            栄養士からのアドバイス
          </h2>
          <div className="space-y-4">
            {growthReport.recommendations.map((recommendation, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-4">
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* レポート生成日 */}
      <div className="text-center text-sm text-gray-500">
        レポート生成日: {new Date().toLocaleDateString('ja-JP')}
      </div>
    </div>
  );
}