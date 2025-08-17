'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MealRecord } from '@/types';
import { MealRecordForm } from '@/components/MealRecordForm';

/**
 * 新しい食事記録作成ページ
 */
export default function NewMealPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 食事記録保存成功時の処理
   */
  const handleSuccess = (record: MealRecord) => {
    setIsLoading(true);
    
    // 成功メッセージを表示（簡易実装）
    alert(`${getMealTypeLabel(record.mealType)}の記録を保存しました！`);
    
    // 食事記録一覧ページに遷移（まだ実装されていないため、今はホームに遷移）
    router.push('/');
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* ページタイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">食事記録を追加</h1>
          <p className="mt-2 text-gray-600">
            今日の食事を記録して、栄養バランスを管理しましょう
          </p>
        </div>

        {/* 食事記録フォーム */}
        <MealRecordForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />

        {/* ナビゲーションリンク */}
        <div className="mt-8 text-center">
          <div className="space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button 
              onClick={() => router.push('/profile')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              プロフィール設定
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}