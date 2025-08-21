import Link from 'next/link';
import Container from '@/components/ui/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Home() {
  const features = [
    {
      href: '/profile',
      icon: '👶',
      title: 'プロフィール',
      description: '赤ちゃんの基本情報を登録・管理',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      iconBg: 'bg-blue-100'
    },
    {
      href: '/record',
      icon: '📝',
      title: '食事記録',
      description: '毎日の離乳食を簡単記録',
      color: 'bg-green-50 text-green-600 border-green-200',
      iconBg: 'bg-green-100'
    },
    {
      href: '/history',
      icon: '📅',
      title: '履歴',
      description: '過去の食事記録をカレンダーで確認',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      iconBg: 'bg-purple-100'
    },
    {
      href: '/analysis',
      icon: '📊',
      title: '栄養分析',
      description: '栄養バランスをチャートで確認',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      iconBg: 'bg-orange-100'
    },
    {
      href: '/report',
      icon: '📋',
      title: '成長レポート',
      description: '詳細な成長・栄養レポート',
      color: 'bg-red-50 text-red-600 border-red-200',
      iconBg: 'bg-red-100'
    }
  ];

  const statusItems = [
    { status: 'completed', label: 'プロフィール管理 - 赤ちゃんの基本情報登録' },
    { status: 'completed', label: '食事記録 - 毎日の離乳食を簡単記録' },
    { status: 'completed', label: '履歴表示 - カレンダー形式で過去の記録を確認' },
    { status: 'completed', label: '栄養分析 - リアルタイムでの栄養バランス確認' },
    { status: 'completed', label: '成長レポート - 詳細な栄養摂取レポート' },
    { status: 'development', label: 'MicroCMS連携 - クラウド同期 (開発中)' }
  ];

  return (
    <Container maxWidth="xl" className="space-y-8">
      {/* ヘッダーセクション */}
      <div className="text-center py-8 md:py-12">
        <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
          <span className="text-lg md:text-xl">🍼</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          離乳食記録アプリ
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          赤ちゃんの健やかな成長をサポートする、栄養管理と記録のアプリケーション
        </p>
      </div>

      {/* 機能カードグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, index) => (
          <Link key={index} href={feature.href}>
            <Card hover className={`h-full border-2 ${feature.color}`}>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${feature.iconBg} rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-lg md:text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* 設定カード */}
        <Card variant="outlined" className="h-full border-2 bg-gray-50 text-gray-600 border-gray-200">
          <CardContent className="flex flex-col items-center text-center p-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-lg md:text-xl">⚙️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">設定</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              アプリの設定と詳細情報
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 機能ステータス */}
      <Card>
        <CardHeader>
          <CardTitle>機能一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statusItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-4 ${
                  item.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span className="text-gray-700 text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ウェルカムメッセージ */}
      <Card variant="elevated" className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="text-center p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <span className="text-xl">🎉</span>
            <span>ようこそ！</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            赤ちゃんの離乳食記録を始めましょう。まずはプロフィールを登録して、
            <br className="hidden md:block" />
            日々の食事記録を通して成長をサポートしていきましょう。
          </p>
        </CardContent>
      </Card>
    </Container>
=======
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BabyProfile } from '@/types';
import { getProfile, getAgeInfo } from '@/lib/profileManager';
import { getMealRecords } from '@/lib/mealRecordManager';

/**
 * ホームページ
 * アプリのメイン画面で、プロフィール情報と主要機能へのナビゲーションを提供
 */
export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentMealsCount, setRecentMealsCount] = useState(0);

  /**
   * プロフィールと最近の食事記録を読み込み
   */
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProfile = getProfile();
        setProfile(savedProfile);

        // 最近の食事記録数を取得（今日から7日間）
        const allMeals = getMealRecords();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentMeals = allMeals.filter(meal => {
          const mealDate = new Date(meal.date);
          return mealDate >= sevenDaysAgo;
        });
        
        setRecentMealsCount(recentMeals.length);
      } catch (error) {
        console.error('データ読み込みエラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * 今日の日付を取得
   */
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // プロフィールがない場合の初期設定画面
  if (!loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <div className="text-6xl mb-6">👶</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            離乳食記録アプリへようこそ
          </h1>
          <p className="text-gray-600 mb-8">
            まずは赤ちゃんのプロフィールを登録して、離乳食の記録を始めましょう。
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            プロフィールを設定する
          </button>
        </div>
      </div>
    );
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

  const ageInfo = profile ? getAgeInfo(profile) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            こんにちは、{profile?.name}ちゃん！
          </h1>
          {ageInfo && (
            <div className="flex items-center justify-center space-x-4 text-gray-600">
              <span>{ageInfo.ageMonths}ヶ月</span>
              <span>•</span>
              <span>{ageInfo.stageDescription}</span>
            </div>
          )}
        </div>

        {/* 今日の食事記録状況 */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">今日の記録状況</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">記録した食事</p>
              <p className="text-2xl font-bold text-gray-800">0回</p>
            </div>
            {ageInfo && ageInfo.mealsPerDay > 0 && (
              <div>
                <p className="text-sm text-gray-600">推奨食事回数</p>
                <p className="text-2xl font-bold text-gray-800">{ageInfo.mealsPerDay}回</p>
              </div>
            )}
            <button
              onClick={() => router.push(`/meals/new?date=${getTodayDate()}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              記録する
            </button>
          </div>
        </div>

        {/* 主要機能メニュー */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 食事記録作成 */}
          <div 
            onClick={() => router.push('/meals/new')}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🍼</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">食事記録を作成</h3>
                <p className="text-sm text-gray-600">今日の離乳食を記録しましょう</p>
              </div>
            </div>
            <div className="text-blue-600 text-sm font-medium">
              食材選択・栄養価計算 →
            </div>
          </div>

          {/* 履歴確認 */}
          <div 
            onClick={() => router.push('/meals')}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">履歴を確認</h3>
                <p className="text-sm text-gray-600">過去の食事記録を振り返る</p>
              </div>
            </div>
            <div className="text-green-600 text-sm font-medium">
              過去{recentMealsCount}件の記録 →
            </div>
          </div>

          {/* カレンダー表示 */}
          <div 
            onClick={() => router.push('/meals/calendar')}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">カレンダー表示</h3>
                <p className="text-sm text-gray-600">月単位で記録を確認</p>
              </div>
            </div>
            <div className="text-purple-600 text-sm font-medium">
              記録状況を一目で確認 →
            </div>
          </div>

          {/* プロフィール設定 */}
          <div 
            onClick={() => router.push('/profile')}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">👶</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">プロフィール設定</h3>
                <p className="text-sm text-gray-600">赤ちゃんの情報を管理</p>
              </div>
            </div>
            <div className="text-orange-600 text-sm font-medium">
              月齢・推奨栄養量の確認 →
            </div>
          </div>
        </div>

        {/* 離乳食ガイド */}
        {ageInfo && (
          <div className="max-w-2xl mx-auto bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-3">
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
        )}
      </div>
    </div>
  );
}