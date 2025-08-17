'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BabyProfile } from '@/types';
import { saveProfile, updateProfile, validateProfile } from '@/lib/profileManager';

/**
 * Zodバリデーションスキーマ
 * フォームの入力値を検証するルールを定義
 */
const profileSchema = z.object({
  name: z
    .string()
    .min(1, '名前は必須です')
    .max(50, '名前は50文字以内で入力してください'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '誕生日はYYYY-MM-DD形式で入力してください')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return birthDate <= today;
    }, '誕生日は今日以前の日付を入力してください')
});

/**
 * TypeScriptの型をZodスキーマから自動生成
 * z.infer<typeof profileSchema> でスキーマから型を作成
 */
type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * プロフィールフォームのプロパティ
 */
interface ProfileFormProps {
  /** 編集対象のプロフィール（新規作成の場合は未定義） */
  existingProfile?: BabyProfile;
  /** フォーム送信成功時のコールバック */
  onSuccess?: (profile: BabyProfile) => void;
  /** フォーム送信キャンセル時のコールバック */
  onCancel?: () => void;
}

/**
 * プロフィール入力フォームコンポーネント
 * React Hook Form + Zod でバリデーション付きフォームを実装
 * 
 * @example
 * ```tsx
 * // 新規プロフィール作成
 * <ProfileForm onSuccess={(profile) => console.log('保存成功:', profile)} />
 * 
 * // 既存プロフィール編集
 * <ProfileForm 
 *   existingProfile={existingProfile} 
 *   onSuccess={(profile) => console.log('更新成功:', profile)} 
 * />
 * ```
 */
export function ProfileForm({ existingProfile, onSuccess, onCancel }: ProfileFormProps) {
  /**
   * React Hook Formの設定
   * - resolver: zodResolver(profileSchema) でZodと連携
   * - defaultValues: 初期値を設定（編集時は既存データ、新規時は空）
   * - mode: 'onChange' でリアルタイムバリデーション
   */
  const {
    register,     // input要素を登録するための関数
    handleSubmit, // フォーム送信を処理する関数
    formState: { errors, isSubmitting }, // エラー状態と送信中状態
    reset         // フォームをリセットする関数
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: existingProfile?.name || '',
      birthDate: existingProfile?.birthDate || ''
    },
    mode: 'onChange' // リアルタイムバリデーション
  });

  /**
   * フォーム送信処理
   * handleSubmitが自動的にバリデーションを実行し、成功時のみこの関数が呼ばれる
   */
  const onSubmit = async (data: ProfileFormData) => {
    try {
      let savedProfile: BabyProfile;

      if (existingProfile) {
        // 既存プロフィールの更新
        const updated = updateProfile(data);
        if (!updated) {
          throw new Error('プロフィールの更新に失敗しました');
        }
        savedProfile = updated;
      } else {
        // 新規プロフィールの保存
        savedProfile = saveProfile(data);
      }

      // 成功コールバックを実行
      onSuccess?.(savedProfile);
      
      // 新規作成の場合はフォームをリセット
      if (!existingProfile) {
        reset();
      }
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
      // TODO: エラー表示の実装
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {existingProfile ? 'プロフィール編集' : '赤ちゃんのプロフィール登録'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 名前入力フィールド */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')} // React Hook Formに登録
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
            placeholder="赤ちゃんのお名前を入力してください"
          />
          {/* エラーメッセージ表示 */}
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* 誕生日入力フィールド */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
            誕生日 <span className="text-red-500">*</span>
          </label>
          <input
            id="birthDate"
            type="date"
            {...register('birthDate')} // React Hook Formに登録
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.birthDate ? 'border-red-500' : ''
            }`}
          />
          {/* エラーメッセージ表示 */}
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
          )}
        </div>

        {/* ボタン */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-md font-medium text-white ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? '保存中...' : existingProfile ? '更新' : '登録'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>

      {/* 入力ヒント */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">入力のヒント</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 名前は50文字以内で入力してください</li>
          <li>• 誕生日は今日以前の日付を選択してください</li>
          <li>• 月齢に応じて離乳食のステージが自動計算されます</li>
        </ul>
      </div>
    </div>
  );
}