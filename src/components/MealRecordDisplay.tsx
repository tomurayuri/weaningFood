'use client';

import { MealRecord, Nutrition } from '@/types';
import { calculateMealNutrition } from '@/lib/nutritionCalculator';

/**
 * 食事記録表示コンポーネントのプロパティ
 */
interface MealRecordDisplayProps {
  /** 表示する食事記録 */
  record: MealRecord;
  /** 編集ボタンクリック時のコールバック */
  onEdit?: () => void;
  /** 削除ボタンクリック時のコールバック */
  onDelete?: () => void;
  /** 簡易表示モード（true: コンパクト表示、false: 詳細表示） */
  compact?: boolean;
}

/**
 * 食事記録を表示するコンポーネント
 * 食材リスト、栄養価サマリー、メモなどを表示
 * 
 * @example
 * ```tsx
 * <MealRecordDisplay 
 *   record={mealRecord} 
 *   onEdit={() => setIsEditing(true)}
 *   onDelete={() => handleDelete()}
 * />
 * ```
 */
export function MealRecordDisplay({ record, onEdit, onDelete, compact = false }: MealRecordDisplayProps) {
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
   * 食事の種類別の色設定
   */
  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-800';
      case 'lunch':
        return 'bg-green-100 text-green-800';
      case 'dinner':
        return 'bg-blue-100 text-blue-800';
      case 'snack':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      day: 'numeric'
    });
  };

  /**
   * 時刻を取得（作成日時から）
   */
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 栄養価を表示形式にフォーマット
   */
  const formatNutrition = (value: number): string => {
    return value < 1 ? value.toFixed(2) : value.toFixed(1);
  };

  // 食事の合計栄養価を計算
  const totalNutrition = calculateMealNutrition(record);

  return (
    <div className={`bg-white rounded-lg shadow-md ${compact ? 'p-4' : 'p-6'}`}>
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getMealTypeColor(record.mealType)}`}>
              {getMealTypeLabel(record.mealType)}
            </span>
            <span className="text-sm text-gray-500">
              {formatTime(record.createdAt)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {formatDate(record.date)}
          </h3>
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                編集
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                削除
              </button>
            )}
          </div>
        )}
      </div>

      {/* 食材リスト */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">食材</h4>
        <div className={`space-y-2 ${compact ? 'max-h-32 overflow-y-auto' : ''}`}>
          {record.foods.map((food, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
              <span className="font-medium text-gray-800">{food.name}</span>
              <span className="text-sm text-gray-600">{food.amount}g</span>
            </div>
          ))}
        </div>
      </div>

      {/* 栄養価サマリー */}
      {!compact && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">栄養価</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">タンパク質:</span>
              <span className="font-medium text-gray-800">
                {formatNutrition(totalNutrition.protein)}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">炭水化物:</span>
              <span className="font-medium text-gray-800">
                {formatNutrition(totalNutrition.carbs)}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">脂質:</span>
              <span className="font-medium text-gray-800">
                {formatNutrition(totalNutrition.fat)}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">食物繊維:</span>
              <span className="font-medium text-gray-800">
                {formatNutrition(totalNutrition.fiber)}g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">鉄分:</span>
              <span className="font-medium text-gray-800">
                {formatNutrition(totalNutrition.iron)}mg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">カルシウム:</span>
              <span className="font-medium text-gray-800">
                {formatNutrition(totalNutrition.calcium)}mg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* メモ */}
      {record.notes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">メモ</h4>
          <p className={`text-gray-600 ${compact ? 'text-sm line-clamp-2' : ''}`}>
            {record.notes}
          </p>
        </div>
      )}

      {/* コンパクトモード時の栄養価サマリー */}
      {compact && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">タンパク質: {formatNutrition(totalNutrition.protein)}g</span>
            <span className="text-gray-600">炭水化物: {formatNutrition(totalNutrition.carbs)}g</span>
            <span className="text-gray-600">脂質: {formatNutrition(totalNutrition.fat)}g</span>
          </div>
        </div>
      )}

      {/* 更新日時 */}
      {record.updatedAt && record.updatedAt !== record.createdAt && (
        <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
          <p>更新日: {formatDate(record.updatedAt)} {formatTime(record.updatedAt)}</p>
        </div>
      )}
    </div>
  );
}