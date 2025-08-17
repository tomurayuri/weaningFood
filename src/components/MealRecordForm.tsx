'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MealRecord, FoodItem } from '@/types';
import { saveMealRecord, updateMealRecord } from '@/lib/mealRecordManager';
import { FoodSelector } from './FoodSelector';

/**
 * Zodバリデーションスキーマ
 */
const mealRecordSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で入力してください')
    .refine((date) => {
      const mealDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return mealDate <= today;
    }, '日付は今日以前を選択してください'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], {
    errorMap: () => ({ message: '食事の種類を選択してください' })
  }),
  notes: z.string().max(500, 'メモは500文字以内で入力してください').optional()
});

/**
 * TypeScriptの型をZodスキーマから自動生成
 */
type MealRecordFormData = z.infer<typeof mealRecordSchema>;

/**
 * 食事記録フォームのプロパティ
 */
interface MealRecordFormProps {
  /** 編集対象の食事記録（新規作成の場合は未定義） */
  existingRecord?: MealRecord;
  /** フォーム送信成功時のコールバック */
  onSuccess?: (record: MealRecord) => void;
  /** フォーム送信キャンセル時のコールバック */
  onCancel?: () => void;
}

/**
 * 食事記録入力フォームコンポーネント
 * 食材選択、食事の種類、日付、メモを入力して食事記録を作成・編集
 * 
 * @example
 * ```tsx
 * // 新規食事記録作成
 * <MealRecordForm onSuccess={(record) => console.log('保存成功:', record)} />
 * 
 * // 既存食事記録編集
 * <MealRecordForm 
 *   existingRecord={existingRecord} 
 *   onSuccess={(record) => console.log('更新成功:', record)} 
 * />
 * ```
 */
export function MealRecordForm({ existingRecord, onSuccess, onCancel }: MealRecordFormProps) {
  // 食材選択の状態
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>(
    existingRecord?.foods || []
  );

  /**
   * React Hook Formの設定
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<MealRecordFormData>({
    resolver: zodResolver(mealRecordSchema),
    defaultValues: {
      date: existingRecord?.date || new Date().toISOString().split('T')[0],
      mealType: existingRecord?.mealType || 'breakfast',
      notes: existingRecord?.notes || ''
    },
    mode: 'onChange'
  });

  /**
   * 食材追加ハンドラー
   */
  const handleAddFood = (food: FoodItem) => {
    setSelectedFoods([...selectedFoods, food]);
  };

  /**
   * 食材削除ハンドラー
   */
  const handleRemoveFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  /**
   * 食材更新ハンドラー
   */
  const handleUpdateFood = (index: number, updatedFood: FoodItem) => {
    const newFoods = [...selectedFoods];
    newFoods[index] = updatedFood;
    setSelectedFoods(newFoods);
  };

  /**
   * フォーム送信処理
   */
  const onSubmit = async (data: MealRecordFormData) => {
    // 食材が選択されていない場合はエラー
    if (selectedFoods.length === 0) {
      alert('少なくとも1つの食材を選択してください');
      return;
    }

    try {
      let savedRecord: MealRecord;

      if (existingRecord) {
        // 既存記録の更新
        const updated = updateMealRecord(existingRecord.id, {
          ...data,
          foods: selectedFoods
        });
        if (!updated) {
          throw new Error('食事記録の更新に失敗しました');
        }
        savedRecord = updated;
      } else {
        // 新規記録の保存
        savedRecord = saveMealRecord({
          ...data,
          foods: selectedFoods
        });
      }

      // 成功コールバックを実行
      onSuccess?.(savedRecord);
      
      // 新規作成の場合はフォームをリセット
      if (!existingRecord) {
        reset();
        setSelectedFoods([]);
      }
    } catch (error) {
      console.error('食事記録保存エラー:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    }
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {existingRecord ? '食事記録を編集' : '新しい食事記録'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 日付入力 */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              日付 <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : ''
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* 食事の種類選択 */}
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
              食事の種類 <span className="text-red-500">*</span>
            </label>
            <select
              id="mealType"
              {...register('mealType')}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.mealType ? 'border-red-500' : ''
              }`}
            >
              <option value="breakfast">朝食</option>
              <option value="lunch">昼食</option>
              <option value="dinner">夕食</option>
              <option value="snack">おやつ</option>
            </select>
            {errors.mealType && (
              <p className="mt-1 text-sm text-red-600">{errors.mealType.message}</p>
            )}
          </div>
        </div>

        {/* 食材選択 */}
        <div>
          <FoodSelector
            selectedFoods={selectedFoods}
            onAddFood={handleAddFood}
            onRemoveFood={handleRemoveFood}
            onUpdateFood={handleUpdateFood}
          />
        </div>

        {/* メモ入力 */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            メモ（任意）
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.notes ? 'border-red-500' : ''
            }`}
            placeholder="食べた様子や気づいたことを記録してください"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* 送信ボタン */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || selectedFoods.length === 0}
            className={`flex-1 py-3 px-6 rounded-md font-medium text-white ${
              isSubmitting || selectedFoods.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? '保存中...' : existingRecord ? '更新' : '記録'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-6 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              キャンセル
            </button>
          )}
        </div>

        {/* 食材選択エラー */}
        {selectedFoods.length === 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  少なくとも1つの食材を選択してください
                </p>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* 入力ヒント */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">記録のヒント</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 食材と分量を正確に記録することで、栄養バランスを把握できます</li>
          <li>• メモ欄には食べた様子や反応を記録しておくと後で役立ちます</li>
          <li>• 毎日継続して記録することで、成長パターンが見えてきます</li>
        </ul>
      </div>
    </div>
  );
}