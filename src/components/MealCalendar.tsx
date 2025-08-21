'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MealRecord } from '@/types';
import { getMealRecords } from '@/lib/mealRecordManager';

/**
 * カレンダーコンポーネントのプロパティ
 */
interface MealCalendarProps {
  /** 表示年月（YYYY-MM形式） */
  initialMonth?: string;
  /** 日付クリック時のコールバック */
  onDateClick?: (date: string) => void;
}

/**
 * 食事記録カレンダーコンポーネント
 * 月単位のカレンダーに食事記録がある日をハイライト表示
 */
export function MealCalendar({ initialMonth, onDateClick }: MealCalendarProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(initialMonth || new Date().toISOString().slice(0, 7));
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [recordDates, setRecordDates] = useState<Set<string>>(new Set());

  /**
   * 食事記録を読み込み
   */
  useEffect(() => {
    const loadMeals = () => {
      try {
        const allMeals = getMealRecords();
        setMeals(allMeals);

        // 記録がある日付のセットを作成
        const dates = new Set(allMeals.map(meal => meal.date));
        setRecordDates(dates);
      } catch (error) {
        console.error('食事記録読み込みエラー:', error);
      }
    };

    loadMeals();
  }, []);

  /**
   * 指定月の日付配列を生成
   */
  const generateCalendarDays = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDate = new Date(firstDay);
    
    // 月初の曜日に合わせて前月の日付を追加
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push({
        date: current.toISOString().split('T')[0],
        day: current.getDate(),
        isCurrentMonth: current.getMonth() === month - 1,
        isToday: current.toDateString() === new Date().toDateString()
      });
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  /**
   * 月を変更
   */
  const changeMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1, 1);
    
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    const newMonth = newDate.toISOString().slice(0, 7);
    setCurrentMonth(newMonth);
  };

  /**
   * 日付クリック処理
   */
  const handleDateClick = (date: string) => {
    if (onDateClick) {
      onDateClick(date);
    } else {
      router.push(`/meals/${date}`);
    }
  };

  /**
   * 指定日の食事記録数を取得
   */
  const getMealCountForDate = (date: string): number => {
    return meals.filter(meal => meal.date === date).length;
  };

  /**
   * 月名を表示形式にフォーマット
   */
  const formatMonthName = (yearMonth: string): string => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long'
    });
  };

  const calendarDays = generateCalendarDays(currentMonth);
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* カレンダーヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeMonth('prev')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800">
          {formatMonthName(currentMonth)}
        </h2>
        
        <button
          onClick={() => changeMonth('next')}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((weekday) => (
          <div key={weekday} className="p-2 text-center text-sm font-medium text-gray-600">
            {weekday}
          </div>
        ))}
      </div>

      {/* カレンダーボディ */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const hasRecords = recordDates.has(day.date);
          const mealCount = getMealCountForDate(day.date);
          
          return (
            <button
              key={day.date}
              onClick={() => handleDateClick(day.date)}
              className={`
                relative p-2 h-12 text-sm rounded-md transition-colors
                ${day.isCurrentMonth 
                  ? 'text-gray-800 hover:bg-gray-100' 
                  : 'text-gray-300'
                }
                ${day.isToday 
                  ? 'bg-blue-100 text-blue-800 font-semibold' 
                  : ''
                }
                ${hasRecords 
                  ? 'bg-green-50 border border-green-200' 
                  : ''
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              disabled={!day.isCurrentMonth}
            >
              <span className="block">{day.day}</span>
              
              {/* 食事記録があることを示すドット */}
              {hasRecords && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className={`
                    w-1.5 h-1.5 rounded-full
                    ${mealCount >= 3 
                      ? 'bg-green-600' 
                      : mealCount >= 2 
                        ? 'bg-yellow-500' 
                        : 'bg-orange-500'
                    }
                  `} />
                </div>
              )}
              
              {/* 食事回数表示（記録がある場合のみ） */}
              {hasRecords && mealCount > 0 && (
                <span className="absolute top-1 right-1 text-xs text-green-600 font-medium">
                  {mealCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">凡例</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded mr-2"></div>
            <span className="text-gray-600">今日</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded mr-2"></div>
            <span className="text-gray-600">記録あり</span>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 ml-0.5"></div>
            <span className="text-gray-600">3回以上</span>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 ml-0.5"></div>
            <span className="text-gray-600">2回</span>
          </div>
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 ml-0.5"></div>
            <span className="text-gray-600">1回</span>
          </div>
        </div>
      </div>
    </div>
  );
}