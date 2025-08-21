'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MealRecord } from '@/types';
import { getMealRecords, getMealRecordsByDate, deleteMealRecord } from '@/lib/mealRecordManager';
import { MealRecordDisplay } from '@/components/MealRecordDisplay';

/**
 * 食事記録一覧表示ページ
 */
export default function MealsPage() {
  const router = useRouter();
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [editingMeal, setEditingMeal] = useState<MealRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  /**
   * 食事記録を読み込み
   */
  useEffect(() => {
    const loadMeals = () => {
      try {
        const allMeals = getMealRecords();
        setMeals(allMeals);
        setFilteredMeals(allMeals);
      } catch (error) {
        console.error('食事記録読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMeals();
  }, []);

  /**
   * フィルタリング処理
   */
  useEffect(() => {
    let filtered = meals;

    // 日付フィルター
    if (selectedDate) {
      filtered = filtered.filter(meal => meal.date === selectedDate);
    }

    // 食事種類フィルター
    if (selectedMealType) {
      filtered = filtered.filter(meal => meal.mealType === selectedMealType);
    }

    setFilteredMeals(filtered);
  }, [meals, selectedDate, selectedMealType]);

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

  /**
   * 編集ボタンクリック時
   */
  const handleEdit = (meal: MealRecord) => {
    // 編集ページに遷移（今は未実装のため、一時的に記録作成ページに遷移）
    router.push(`/meals/new?edit=${meal.id}`);
  };

  /**
   * 削除確認ダイアログ表示
   */
  const handleDeleteConfirm = (mealId: string) => {
    setShowDeleteConfirm(mealId);
  };

  /**
   * 削除実行
   */
  const handleDelete = (mealId: string) => {
    try {
      const success = deleteMealRecord(mealId);
      if (success) {
        // リストから削除
        const updatedMeals = meals.filter(meal => meal.id !== mealId);
        setMeals(updatedMeals);
        setShowDeleteConfirm(null);
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除中にエラーが発生しました');
    }
  };

  /**
   * フィルターリセット
   */
  const handleResetFilters = () => {
    setSelectedDate('');
    setSelectedMealType('');
  };

  /**
   * 一意の日付リストを取得
   */
  const getUniqueDates = () => {
    const dates = meals.map(meal => meal.date);
    return [...new Set(dates)].sort().reverse(); // 新しい日付順
  };

  // 読み込み中の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* ページタイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">食事記録履歴</h1>
          <p className="mt-2 text-gray-600">
            これまでの食事記録を確認・編集できます
          </p>
        </div>

        {/* フィルター */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">フィルター</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 日付フィルター */}
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                日付
              </label>
              <select
                id="date-filter"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべての日付</option>
                {getUniqueDates().map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* 食事種類フィルター */}
            <div>
              <label htmlFor="mealtype-filter" className="block text-sm font-medium text-gray-700 mb-1">
                食事の種類
              </label>
              <select
                id="mealtype-filter"
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべての食事</option>
                <option value="breakfast">朝食</option>
                <option value="lunch">昼食</option>
                <option value="dinner">夕食</option>
                <option value="snack">おやつ</option>
              </select>
            </div>

            {/* フィルターリセット */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                フィルターをリセット
              </button>
            </div>
          </div>

          {/* フィルター結果表示 */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredMeals.length}件の食事記録が見つかりました
            {(selectedDate || selectedMealType) && (
              <span className="ml-2">
                (フィルター適用中)
              </span>
            )}
          </div>
        </div>

        {/* 食事記録一覧 */}
        {filteredMeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              {meals.length === 0 ? 'まだ食事記録がありません' : '条件に一致する食事記録がありません'}
            </p>
            <button
              onClick={() => router.push('/meals/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              新しい食事記録を作成
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredMeals.map((meal) => (
              <MealRecordDisplay
                key={meal.id}
                record={meal}
                onEdit={() => handleEdit(meal)}
                onDelete={() => handleDeleteConfirm(meal.id)}
                compact={true}
              />
            ))}
          </div>
        )}

        {/* 新規作成ボタン */}
        {filteredMeals.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/meals/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              新しい食事記録を作成
            </button>
          </div>
        )}

        {/* ナビゲーション */}
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

        {/* 削除確認ダイアログ */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                食事記録を削除しますか？
              </h3>
              <p className="text-gray-600 mb-6">
                この操作は元に戻せません。削除してもよろしいですか？
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}