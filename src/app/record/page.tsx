'use client';

import { useState } from 'react';
import { MealRecordForm } from '@/components/MealRecordForm';
import { getProfile } from '@/lib/profileManager';
import Container from '@/components/ui/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function RecordPage() {
  const [showForm, setShowForm] = useState(false);
  const profile = getProfile();

  if (!profile) {
    return (
      <Container>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="text-center">
            <div className="text-2xl mb-4">⚠️</div>
            <CardTitle className="text-yellow-800 mb-2">プロフィールが登録されていません</CardTitle>
            <p className="text-yellow-700 mb-4">食事記録を行うには、まずプロフィールを登録してください。</p>
            <Button variant="primary" onClick={() => window.location.href = '/profile'}>
              プロフィールを登録する
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (showForm) {
    return (
      <Container maxWidth="md">
        <MealRecordForm 
          onSuccess={() => {
            setShowForm(false);
            // 成功メッセージなどの処理
          }}
          onCancel={() => setShowForm(false)}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-xl md:text-2xl">📝</span>
          <span>食事記録</span>
        </h1>
        <p className="text-gray-600">{profile.name}ちゃんの食事を記録しましょう</p>
      </div>

      {/* アクションカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 新規記録カード */}
        <Card hover className="border-2 border-green-200 bg-green-50">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">➕</span>
            </div>
            <h3 className="text-xl font-bold text-green-800 mb-2">新しい食事を記録</h3>
            <p className="text-green-700 mb-6 leading-relaxed">
              今日食べた離乳食を記録して、栄養バランスを管理しましょう。
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              記録を開始する
            </Button>
          </CardContent>
        </Card>

        {/* 履歴確認カード */}
        <Card hover className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-2">過去の記録を確認</h3>
            <p className="text-blue-700 mb-6 leading-relaxed">
              これまでの食事記録を日付別に確認できます。
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/history'}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              履歴を見る
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* クイックアクセス */}
      <Card>
        <CardHeader>
          <CardTitle>クイックアクセス</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowForm(true)}
              className="flex-col py-4 h-auto"
            >
              <span className="text-xl mb-1">🍚</span>
              <span className="text-sm">朝食記録</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(true)}
              className="flex-col py-4 h-auto"
            >
              <span className="text-xl mb-1">🥄</span>
              <span className="text-sm">昼食記録</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(true)}
              className="flex-col py-4 h-auto"
            >
              <span className="text-xl mb-1">🍽️</span>
              <span className="text-sm">夕食記録</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowForm(true)}
              className="flex-col py-4 h-auto"
            >
              <span className="text-xl mb-1">🍪</span>
              <span className="text-sm">おやつ記録</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ヒントカード */}
      <Card variant="outlined" className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h3 className="font-medium text-purple-800 mb-2">記録のコツ</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 食事の直後に記録すると忘れずに済みます</li>
                <li>• 量は大体の目安で構いません（小さじ、中さじなど）</li>
                <li>• 赤ちゃんの反応や様子もメモに残しておくと便利です</li>
                <li>• 毎日継続することで成長パターンが見えてきます</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}