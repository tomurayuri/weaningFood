'use client';

import { useState } from 'react';
import { analyzePeriodNutrition, generateGrowthReport } from '@/lib/nutritionAnalyzer';
import { NutritionBarChart, WeeklyProgressChart, DailyRecordChart } from '@/components/NutritionChart';
import { getProfile } from '@/lib/profileManager';
import Container from '@/components/ui/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AnalysisPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  
  // プロファイルを取得
  const profile = getProfile();

  if (!profile) {
    return (
      <Container>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="text-center">
            <div className="text-2xl mb-4">⚠️</div>
            <CardTitle className="text-yellow-800 mb-2">プロフィールが登録されていません</CardTitle>
            <p className="text-yellow-700 mb-4">栄養分析を行うには、まずプロフィールを登録してください。</p>
            <Button variant="primary" onClick={() => window.location.href = '/profile'}>
              プロフィールを登録する
            </Button>
          </CardContent>
        </Card>
      </Container>
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
    <Container maxWidth="xl" className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-xl md:text-2xl">📊</span>
          <span>栄養分析</span>
        </h1>
        <p className="text-gray-600">赤ちゃんの栄養摂取状況を詳しく分析します</p>
      </div>

      {/* 期間選択 */}
      <Card>
        <CardHeader>
          <CardTitle>分析期間</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Button
              variant={selectedPeriod === 'week' ? 'primary' : 'outline'}
              onClick={() => setSelectedPeriod('week')}
              className="flex-1 sm:flex-none"
            >
              <span className="text-xs mr-1">📅</span>
              週間 (7日)
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'primary' : 'outline'}
              onClick={() => setSelectedPeriod('month')}
              className="flex-1 sm:flex-none"
            >
              <span className="text-xs mr-1">📅</span>
              月間 (30日)
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            分析期間: <span className="font-medium">{analysis.startDate} 〜 {analysis.endDate}</span>
          </p>
        </CardContent>
      </Card>

      {/* 記録状況の概要 */}
      <Card>
        <CardHeader>
          <CardTitle>記録状況サマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{analysis.totalDays}</p>
              <p className="text-sm text-gray-600">総日数</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold text-green-600">{analysis.recordedDays}</p>
              <p className="text-sm text-gray-600">記録日数</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold text-purple-600">
                {Math.round((analysis.recordedDays / analysis.totalDays) * 100)}%
              </p>
              <p className="text-sm text-gray-600">記録率</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl md:text-3xl font-bold text-orange-600">
                {analysis.deficientNutrients.length}
              </p>
              <p className="text-sm text-gray-600">不足栄養素</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* チャート表示 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <NutritionBarChart analysis={analysis} />
        <DailyRecordChart analysis={analysis} />
      </div>

      {/* 週別進捗（月間の場合のみ） */}
      {growthReport && growthReport.trends.weeklyProgress.length > 1 && (
        <WeeklyProgressChart weeklyData={growthReport.trends.weeklyProgress} />
      )}

      {/* レコメンデーション */}
      {growthReport && growthReport.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <span>栄養士からのアドバイス</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {growthReport.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 記録がない場合のメッセージ */}
      {analysis.recordedDays === 0 && (
        <Card className="bg-gray-50 border-gray-300">
          <CardContent className="text-center">
            <div className="text-2xl mb-4">📝</div>
            <CardTitle className="text-gray-800 mb-2">記録がありません</CardTitle>
            <p className="text-gray-600 mb-4">選択した期間に食事記録がありません。まずは食事を記録してみましょう。</p>
            <Button variant="primary" onClick={() => window.location.href = '/record'}>
              食事記録を開始する
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}