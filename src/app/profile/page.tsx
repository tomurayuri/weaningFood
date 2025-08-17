'use client';

import { useState, useEffect } from 'react';
import { BabyProfile } from '@/types';
import { getProfile, deleteProfile } from '@/lib/profileManager';
import { ProfileForm } from '@/components/ProfileForm';
import { ProfileDisplay } from '@/components/ProfileDisplay';

/**
 * プロフィール管理ページ
 * プロフィールの表示・作成・編集・削除を行う統合ページ
 */
export default function ProfilePage() {
  // 状態管理
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * ページ読み込み時にプロフィールを取得
   */
  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile = getProfile();
        setProfile(savedProfile);
        // プロフィールが存在しない場合は作成モードにする
        if (!savedProfile) {
          setIsEditing(true);
        }
      } catch (error) {
        console.error('プロフィール読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /**
   * プロフィール保存成功時の処理
   */
  const handleSaveSuccess = (savedProfile: BabyProfile) => {
    setProfile(savedProfile);
    setIsEditing(false);
  };

  /**
   * 編集キャンセル時の処理
   */
  const handleCancel = () => {
    if (profile) {
      // 既存プロフィールがある場合は表示モードに戻る
      setIsEditing(false);
    } else {
      // プロフィールがない場合はそのまま（作成は必須）
      // 必要に応じてホームページに戻る処理を追加
    }
  };

  /**
   * プロフィール削除の確認
   */
  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  /**
   * プロフィール削除実行
   */
  const handleDelete = () => {
    try {
      deleteProfile();
      setProfile(null);
      setIsEditing(true); // 削除後は作成モードに
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('プロフィール削除エラー:', error);
    }
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
          <h1 className="text-3xl font-bold text-gray-800">赤ちゃんのプロフィール</h1>
          <p className="mt-2 text-gray-600">
            離乳食記録のために赤ちゃんの情報を{profile ? '確認・編集' : '登録'}してください
          </p>
        </div>

        {/* メインコンテンツ */}
        {isEditing ? (
          // 編集・作成モード
          <ProfileForm
            existingProfile={profile || undefined}
            onSuccess={handleSaveSuccess}
            onCancel={profile ? handleCancel : undefined} // 新規作成時はキャンセルボタンを非表示
          />
        ) : profile ? (
          // 表示モード（プロフィールが存在する場合）
          <ProfileDisplay
            profile={profile}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDeleteConfirm}
          />
        ) : (
          // エラー状態（通常は発生しない）
          <div className="text-center">
            <p className="text-gray-600">プロフィールが見つかりません</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              新規作成
            </button>
          </div>
        )}

        {/* 削除確認ダイアログ */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                プロフィールを削除しますか？
              </h3>
              <p className="text-gray-600 mb-6">
                削除すると、これまでの離乳食記録もすべて失われます。この操作は元に戻せません。
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ナビゲーション */}
        {profile && !isEditing && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">プロフィール登録完了！次のステップに進みましょう</p>
            <div className="space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
                離乳食記録を始める
              </button>
              <button className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
                栄養情報を見る
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}