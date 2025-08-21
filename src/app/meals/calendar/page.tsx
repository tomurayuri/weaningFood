'use client';

import { useRouter } from 'next/navigation';
import { MealCalendar } from '@/components/MealCalendar';

/**
 * 食事記録カレンダーページ
 */
export default function MealCalendarPage() {
  const router = useRouter();

  /**
   * 日付クリック時の処理
   */
  const handleDateClick = (date: string) => {
    router.push(`/meals/${date}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* ページタイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">食事記録カレンダー</h1>
          <p className="mt-2 text-gray-600">
            カレンダーから日別の食事記録を確認できます
          </p>
        </div>

        {/* カレンダー */}
        <div className="max-w-4xl mx-auto mb-8">
          <MealCalendar onDateClick={handleDateClick} />
        </div>

        {/* 使い方の説明 */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">カレンダーの使い方</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
              <p>日付をクリックすると、その日の詳細な食事記録を確認できます</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
              <p>緑色の背景は食事記録がある日を表示します</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
              <p>右上の数字は1日の食事記録数を表示します</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
              <p>下部のドットの色で食事回数が分かります（緑:3回以上、黄:2回、橙:1回）</p>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-2">今月の記録日数</h3>
            <p className="text-2xl font-bold text-blue-600">-日</p>
            <p className="text-xs text-gray-500 mt-1">継続して記録しましょう</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-2">連続記録日数</h3>
            <p className="text-2xl font-bold text-green-600">-日</p>
            <p className="text-xs text-gray-500 mt-1">習慣化の目安です</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-2">総食事記録数</h3>
            <p className="text-2xl font-bold text-purple-600">-件</p>
            <p className="text-xs text-gray-500 mt-1">記録の積み重ねです</p>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="text-center">
          <div className="space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button 
              onClick={() => router.push('/meals/new')}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              新しい食事記録を作成
            </button>
            <button 
              onClick={() => router.push('/meals')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              履歴一覧を見る
            </button>
            <button 
              onClick={() => router.push('/')}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}