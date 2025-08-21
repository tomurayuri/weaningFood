'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MealRecord, Nutrition } from '@/types';
import { getMealRecordsByDate, deleteMealRecord } from '@/lib/mealRecordManager';
import { calculateDailyNutrition } from '@/lib/nutritionCalculator';
import { getProfile } from '@/lib/profileManager';
import { getNutritionRecommendation, calculateAgeInMonths } from '@/data/nutritionRecommendations';
import { MealRecordDisplay } from '@/components/MealRecordDisplay';

/**
 * 日別食事記録詳細表示ページ
 */
export default function DailyMealsPage() {
  const router = useRouter();
  const params = useParams();
  const date = params.date as string;

  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  /**
   * 日付の食事記録を読み込み
   */
  useEffect(() => {
    if (!date) return;

    const loadDailyMeals = () => {
      try {
        const dailyMeals = getMealRecordsByDate(date);
        setMeals(dailyMeals);
      } catch (error) {
        console.error('日別食事記録読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDailyMeals();
  }, [date]);

  /**
   * 編集ボタンクリック時
   */
  const handleEdit = (meal: MealRecord) => {
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
   * 日付を読みやすい形式にフォーマット
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  /**
   * 栄養価を表示形式にフォーマット
   */
  const formatNutrition = (value: number): string => {
    return value < 1 ? value.toFixed(2) : value.toFixed(1);
  };

  /**
   * 栄養価の達成率を計算
   */
  const calculateAchievementRate = (actual: number, recommended: number): number => {
    if (recommended === 0) return 0;
    return Math.min(100, Math.floor((actual / recommended) * 100));
  };

  /**
   * 達成率に基づく色クラスを取得
   */
  const getAchievementColor = (rate: number): string => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    if (rate >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // 日付の総栄養価を計算
  const totalNutrition = calculateDailyNutrition(meals);

  // プロフィールから推奨栄養価を取得
  const profile = getProfile();
  let recommendedNutrition: Nutrition | null = null;
  let ageInfo = null;

  if (profile) {
    const ageMonths = calculateAgeInMonths(profile.birthDate);
    const recommendation = getNutritionRecommendation(ageMonths);
    if (recommendation) {
      recommendedNutrition = recommendation.nutrition;
      ageInfo = {
        ageMonths,
        mealsPerDay: recommendation.mealsPerDay
      };
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-800">{formatDate(date)}</h1>
          <p className="mt-2 text-gray-600">
            この日の食事記録 {meals.length}件
          </p>
        </div>

        {/* 栄養価サマリー */}
        {meals.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">1日の栄養価サマリー</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">タンパク質</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNutrition(totalNutrition.protein)}g
                </p>
                {recommendedNutrition && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      推奨: {formatNutrition(recommendedNutrition.protein)}g
                    </p>
                    <p className={`text-sm font-medium ${getAchievementColor(calculateAchievementRate(totalNutrition.protein, recommendedNutrition.protein))}`}>
                      {calculateAchievementRate(totalNutrition.protein, recommendedNutrition.protein)}%達成
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">炭水化物</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNutrition(totalNutrition.carbs)}g
                </p>
                {recommendedNutrition && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      推奨: {formatNutrition(recommendedNutrition.carbs)}g
                    </p>
                    <p className={`text-sm font-medium ${getAchievementColor(calculateAchievementRate(totalNutrition.carbs, recommendedNutrition.carbs))}`}>
                      {calculateAchievementRate(totalNutrition.carbs, recommendedNutrition.carbs)}%達成
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">脂質</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNutrition(totalNutrition.fat)}g
                </p>
                {recommendedNutrition && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      推奨: {formatNutrition(recommendedNutrition.fat)}g
                    </p>
                    <p className={`text-sm font-medium ${getAchievementColor(calculateAchievementRate(totalNutrition.fat, recommendedNutrition.fat))}`}>
                      {calculateAchievementRate(totalNutrition.fat, recommendedNutrition.fat)}%達成
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">食物繊維</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNutrition(totalNutrition.fiber)}g
                </p>
                {recommendedNutrition && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      推奨: {formatNutrition(recommendedNutrition.fiber)}g
                    </p>
                    <p className={`text-sm font-medium ${getAchievementColor(calculateAchievementRate(totalNutrition.fiber, recommendedNutrition.fiber))}`}>
                      {calculateAchievementRate(totalNutrition.fiber, recommendedNutrition.fiber)}%達成
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">鉄分</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNutrition(totalNutrition.iron)}mg
                </p>
                {recommendedNutrition && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      推奨: {formatNutrition(recommendedNutrition.iron)}mg
                    </p>
                    <p className={`text-sm font-medium ${getAchievementColor(calculateAchievementRate(totalNutrition.iron, recommendedNutrition.iron))}`}>
                      {calculateAchievementRate(totalNutrition.iron, recommendedNutrition.iron)}%達成
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">カルシウム</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNutrition(totalNutrition.calcium)}mg
                </p>
                {recommendedNutrition && (
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      推奨: {formatNutrition(recommendedNutrition.calcium)}mg
                    </p>
                    <p className={`text-sm font-medium ${getAchievementColor(calculateAchievementRate(totalNutrition.calcium, recommendedNutrition.calcium))}`}>
                      {calculateAchievementRate(totalNutrition.calcium, recommendedNutrition.calcium)}%達成
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 推奨食事回数との比較 */}
            {ageInfo && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">この日の食事回数</p>
                    <p className="text-lg font-semibold text-gray-800">{meals.length}回</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">推奨食事回数</p>
                    <p className="text-lg font-semibold text-gray-800">{ageInfo.mealsPerDay}回</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">月齢</p>
                    <p className="text-lg font-semibold text-gray-800">{ageInfo.ageMonths}ヶ月</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 食事記録詳細 */}
        {meals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              この日の食事記録はまだありません
            </p>
            <button
              onClick={() => router.push(`/meals/new?date=${date}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              この日の食事記録を作成
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">食事記録詳細</h2>
            
            {meals.map((meal) => (
              <MealRecordDisplay
                key={meal.id}
                record={meal}
                onEdit={() => handleEdit(meal)}
                onDelete={() => handleDeleteConfirm(meal.id)}
                compact={false}
              />
            ))}
          </div>
        )}

        {/* アクションボタン */}
        <div className="mt-8 text-center">
          <div className="space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => router.push(`/meals/new?date=${date}`)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              この日の食事記録を追加
            </button>
            <button 
              onClick={() => router.push('/meals')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              履歴一覧に戻る
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