'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getMealRecords } from '@/lib/mealRecordManager';
import { MealRecord } from '@/types';
import Container from '@/components/ui/Container';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [records, setRecords] = useState<MealRecord[]>([]);

  // 全記録を取得
  const allRecords = getMealRecords();
  
  // 日付でグループ化
  const recordsByDate = allRecords.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, MealRecord[]>);

  const dates = Object.keys(recordsByDate).sort().reverse();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setRecords(recordsByDate[date] || []);
  };

  const getMealTypeLabel = (type: MealRecord['mealType']) => {
    switch (type) {
      case 'breakfast': return '朝食';
      case 'lunch': return '昼食';
      case 'dinner': return '夕食';
      case 'snack': return 'おやつ';
      default: return type;
    }
  };

  return (
    <Container maxWidth="xl" className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center py-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-xl md:text-2xl">📅</span>
          <span>食事履歴</span>
        </h1>
        <p className="text-gray-600">これまでの食事記録を日付別に確認できます</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 日付リスト */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>記録のある日付</CardTitle>
            </CardHeader>
            <CardContent>
              {dates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg mb-2">📝</p>
                  <p>まだ記録がありません</p>
                  <Button 
                    variant="primary" 
                    className="mt-4"
                    onClick={() => window.location.href = '/record'}
                  >
                    食事記録を開始する
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateSelect(date)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedDate === date
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">
                        {format(new Date(date), 'yyyy年M月d日', { locale: ja })}
                      </div>
                      <div className="text-sm opacity-70">
                        {recordsByDate[date].length}件の記録
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 選択された日付の記録詳細 */}
        <div className="lg:col-span-2">
          {selectedDate ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {format(new Date(selectedDate), 'yyyy年M月d日', { locale: ja })}の記録
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                            {getMealTypeLabel(record.mealType)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {record.time}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(record.createdAt), 'HH:mm')}記録
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">食べた食材</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {record.foods.map((food, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <span className="text-sm">{food.name}</span>
                              <span className="text-sm text-gray-600">{food.amount}g</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {record.notes && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-800 mb-1">メモ</h4>
                          <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                            {record.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  日付を選択してください
                </h3>
                <p className="text-gray-600">
                  左側から確認したい日付を選択すると、その日の食事記録が表示されます。
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}