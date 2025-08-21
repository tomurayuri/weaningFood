'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BabyProfile } from '@/types';
import { saveProfile, updateProfile } from '@/lib/profileManager';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

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
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">👶</span>
          {existingProfile ? 'プロフィール編集' : '赤ちゃんのプロフィール登録'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 名前入力フィールド */}
          <Input
            label="お名前"
            required
            {...register('name')} // React Hook Formに登録
            error={errors.name?.message}
            placeholder="赤ちゃんのお名前を入力してください"
            leftIcon={
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          {/* 誕生日入力フィールド */}
          <Input
            label="誕生日"
            type="date"
            required
            {...register('birthDate')} // React Hook Formに登録
            error={errors.birthDate?.message}
            leftIcon={
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />

          {/* ボタン */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? '保存中...' : existingProfile ? '✏️ 更新' : '📝 登録'}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={onCancel}
              >
                キャンセル
              </Button>
            )}
          </div>
        </form>

          {/* 入力ヒント */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">💡</span>
              <h3 className="text-sm font-medium text-blue-800">入力のヒント</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 名前は50文字以内で入力してください</li>
              <li>• 誕生日は今日以前の日付を選択してください</li>
              <li>• 月齢に応じて離乳食のステージが自動計算されます</li>
            </ul>
          </div>
        </CardContent>
      </Card>
  );
}

export default ProfileForm;