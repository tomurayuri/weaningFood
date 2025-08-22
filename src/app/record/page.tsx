'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MealRecord } from '@/types';
import { MealRecordForm } from '@/components/MealRecordForm';
import Container from '@/components/ui/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

/**
 * 食事記録ページ
 */
export default function RecordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 食事記録保存成功時の処理
   */
  const handleSuccess = (record: MealRecord) => {
    setIsLoading(true);
    
    // 成功メッセージを表示（簡易実装）
    alert(`${getMealTypeLabel(record.mealType)}の記録を保存しました！`);
    
    // 履歴ページに遷移
    router.push('/history');
  };

  /**
   * キャンセル時の処理
   */
  const handleCancel = () => {
    router.back();
  };

  /**
   * 食事の種類の表示名を取得
   */
  const getMealTypeLabel = (mealType: string) => {
    const labels = {
      breakfast: '朝食',
      lunch: '昼食', 
      dinner: '夕食',
      snack: 'おやつ'
    };
    return labels[mealType as keyof typeof labels] || mealType;
  };

  return (
    <Container maxWidth="xl" className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-xl md:text-2xl">📝</span>
          <span>食事記録</span>
        </h1>
        <p className="text-gray-600">今日の食事を記録して、栄養バランスを管理しましょう</p>
      </div>

      {/* 食事記録フォーム */}
      <Card>
        <CardContent className="p-6">
          <MealRecordForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </Container>
  );
}