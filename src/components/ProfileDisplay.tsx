'use client';

import { BabyProfile } from '@/types';
import { getAgeInfo } from '@/lib/profileManager';

/**
 * プロフィール表示コンポーネントのプロパティ
 */
interface ProfileDisplayProps {
  /** 表示するプロフィールデータ */
  profile: BabyProfile;
  /** 編集ボタンクリック時のコールバック */
  onEdit?: () => void;
  /** 削除ボタンクリック時のコールバック */
  onDelete?: () => void;
}

/**
 * 赤ちゃんのプロフィール情報を表示するコンポーネント
 * 月齢と離乳食ステージも自動計算して表示
 * 
 * @example
 * ```tsx
 * <ProfileDisplay 
 *   profile={babyProfile} 
 *   onEdit={() => setIsEditing(true)}
 *   onDelete={() => handleDelete()}
 * />
 * ```
 */
export function ProfileDisplay({ profile, onEdit, onDelete }: ProfileDisplayProps) {
  // 月齢と離乳食ステージ情報を計算
  const ageInfo = getAgeInfo(profile);

  // 日付を読みやすい形式にフォーマット
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      return '不明';
    }
    
    const date = new Date(dateString);
    
    // Invalid Dateの場合の処理
    if (isNaN(date.getTime())) {
      return '不明';
    }
    
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ステージ別の色設定
  const getStageColor = (stage: string) => {
    switch (stage) {
      case '離乳食前':
        return 'bg-gray-100 text-gray-800';
      case '初期':
        return 'bg-green-100 text-green-800';
      case '中期':
        return 'bg-blue-100 text-blue-800';
      case '後期':
        return 'bg-orange-100 text-orange-800';
      case '完了期':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800">プロフィール</h2>
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
      </div>

      {/* 基本情報 */}
      <div className="space-y-4">
        {/* 名前 */}
        <div>
          <label className="block text-sm font-medium text-gray-600">お名前</label>
          <p className="text-lg font-semibold text-gray-800 mt-1">{profile.name}</p>
        </div>

        {/* 誕生日 */}
        <div>
          <label className="block text-sm font-medium text-gray-600">誕生日</label>
          <p className="text-lg text-gray-800 mt-1">{formatDate(profile.birthDate)}</p>
        </div>

        {/* 月齢 */}
        <div>
          <label className="block text-sm font-medium text-gray-600">月齢</label>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {ageInfo.ageMonths}ヶ月
          </p>
        </div>

        {/* 離乳食ステージ */}
        <div>
          <label className="block text-sm font-medium text-gray-600">離乳食ステージ</label>
          <div className="mt-1">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStageColor(ageInfo.stage)}`}>
              {ageInfo.stageDescription}
            </span>
          </div>
        </div>

        {/* 1日の食事回数 */}
        <div>
          <label className="block text-sm font-medium text-gray-600">1日の推奨食事回数</label>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {ageInfo.mealsPerDay === 0 ? 'まだ離乳食は始まりません' : `${ageInfo.mealsPerDay}回`}
          </p>
        </div>
      </div>

      {/* 離乳食ガイド */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          {ageInfo.stage}のポイント
        </h3>
        <div className="text-sm text-blue-700">
          {ageInfo.stage === '離乳食前' && (
            <p>まだ母乳やミルクの時期です。5ヶ月頃から離乳食を始める準備をしましょう。</p>
          )}
          {ageInfo.stage === '初期' && (
            <p>ペースト状の食べ物から始めましょう。1日1回、機嫌の良い時間に与えてください。</p>
          )}
          {ageInfo.stage === '中期' && (
            <p>舌でつぶせる硬さの食べ物を1日2回与えます。いろいろな味に慣れさせましょう。</p>
          )}
          {ageInfo.stage === '後期' && (
            <p>歯ぐきでつぶせる硬さの食べ物を1日3回与えます。手づかみ食べも始まります。</p>
          )}
          {ageInfo.stage === '完了期' && (
            <p>大人の食事とほぼ同じものが食べられます。1日3回の食事とおやつを与えましょう。</p>
          )}
        </div>
      </div>

      {/* 作成・更新日時 */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p>作成日: {formatDate(profile.createdAt)}</p>
        {profile.updatedAt && profile.updatedAt !== profile.createdAt && (
          <p>更新日: {formatDate(profile.updatedAt)}</p>
        )}
      </div>
    </div>
  );
}