import { MealRecord, Nutrition, BabyProfile } from '@/types';
import { getMealRecords, getMealRecordsByDate } from '@/lib/mealRecordManager';
import { calculateDailyNutrition, generateNutritionAnalysis } from '@/lib/nutritionCalculator';
import { getProfile } from '@/lib/profileManager';
import { getNutritionRecommendation, calculateAgeInMonths } from '@/data/nutritionRecommendations';

/**
 * 期間別栄養分析結果
 */
export interface PeriodNutritionAnalysis {
  period: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  recordedDays: number;
  averageNutrition: Nutrition;
  recommendedNutrition: Nutrition | null;
  achievementRates: Record<keyof Nutrition, number>;
  deficientNutrients: Array<keyof Nutrition>;
  dailyAnalysis: DailyNutritionData[];
}

/**
 * 日別栄養データ
 */
export interface DailyNutritionData {
  date: string;
  nutrition: Nutrition;
  mealCount: number;
  hasRecord: boolean;
}

/**
 * 食材多様性分析結果
 */
export interface FoodDiversityAnalysis {
  period: string;
  totalFoods: number;
  uniqueFoods: string[];
  categoryDistribution: Record<string, number>;
  topFoods: Array<{ name: string; count: number }>;
  newFoodsIntroduced: string[];
}

/**
 * 成長レポートデータ
 */
export interface GrowthReportData {
  profile: BabyProfile;
  currentAge: number;
  periodAnalysis: PeriodNutritionAnalysis;
  diversityAnalysis: FoodDiversityAnalysis;
  trends: NutritionTrends;
  recommendations: string[];
}

/**
 * 栄養摂取トレンド
 */
export interface NutritionTrends {
  weeklyProgress: WeeklyProgress[];
  improvingNutrients: Array<keyof Nutrition>;
  decliningNutrients: Array<keyof Nutrition>;
  consistencyScore: number;
}

/**
 * 週別進捗データ
 */
export interface WeeklyProgress {
  week: string;
  startDate: string;
  endDate: string;
  averageNutrition: Nutrition;
  achievementRate: number;
}

/**
 * 指定期間の栄養分析を実行
 */
export function analyzePeriodNutrition(
  startDate: string, 
  endDate: string, 
  profile?: BabyProfile
): PeriodNutritionAnalysis {
  const allMeals = getMealRecords();
  
  // 期間内の食事記録をフィルタリング
  const periodMeals = allMeals.filter(meal => 
    meal.date >= startDate && meal.date <= endDate
  );

  // 期間内の日付を生成
  const dates = generateDateRange(startDate, endDate);
  
  // 日別データを作成
  const dailyAnalysis: DailyNutritionData[] = dates.map(date => {
    const dayMeals = periodMeals.filter(meal => meal.date === date);
    const nutrition = calculateDailyNutrition(dayMeals);
    
    return {
      date,
      nutrition,
      mealCount: dayMeals.length,
      hasRecord: dayMeals.length > 0
    };
  });

  // 記録がある日のデータのみで平均を計算
  const recordedDays = dailyAnalysis.filter(day => day.hasRecord);
  const averageNutrition = calculateAverageNutrition(recordedDays.map(day => day.nutrition));

  // 推奨栄養量を取得
  let recommendedNutrition: Nutrition | null = null;
  if (profile) {
    const ageMonths = calculateAgeInMonths(profile.birthDate);
    const recommendation = getNutritionRecommendation(ageMonths);
    recommendedNutrition = recommendation?.nutrition || null;
  }

  // 達成率を計算
  const achievementRates = calculateAchievementRates(averageNutrition, recommendedNutrition);
  
  // 不足栄養素を特定
  const deficientNutrients = recommendedNutrition 
    ? (Object.keys(recommendedNutrition) as Array<keyof Nutrition>).filter(
        nutrient => achievementRates[nutrient] < 80
      )
    : [];

  return {
    period: `${startDate} - ${endDate}`,
    startDate,
    endDate,
    totalDays: dates.length,
    recordedDays: recordedDays.length,
    averageNutrition,
    recommendedNutrition,
    achievementRates,
    deficientNutrients,
    dailyAnalysis
  };
}

/**
 * 食材多様性を分析
 */
export function analyzeFoodDiversity(
  startDate: string, 
  endDate: string
): FoodDiversityAnalysis {
  const allMeals = getMealRecords();
  
  // 期間内の食事記録をフィルタリング
  const periodMeals = allMeals.filter(meal => 
    meal.date >= startDate && meal.date <= endDate
  );

  // 全食材を抽出
  const allFoods = periodMeals.flatMap(meal => meal.foods.map(food => food.name));
  const uniqueFoods = [...new Set(allFoods)];

  // カテゴリ別分布を計算（基本食材のカテゴリ情報を使用）
  const categoryDistribution: Record<string, number> = {};
  
  // 食材使用回数をカウント
  const foodCount: Record<string, number> = {};
  allFoods.forEach(food => {
    foodCount[food] = (foodCount[food] || 0) + 1;
  });

  // 上位食材を取得
  const topFoods = Object.entries(foodCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // 新しく導入された食材を特定（前の期間との比較）
  const previousEndDate = new Date(startDate);
  previousEndDate.setDate(previousEndDate.getDate() - 1);
  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setDate(previousStartDate.getDate() - (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  
  const previousMeals = allMeals.filter(meal => 
    meal.date >= previousStartDate.toISOString().split('T')[0] && 
    meal.date <= previousEndDate.toISOString().split('T')[0]
  );
  
  const previousFoods = new Set(previousMeals.flatMap(meal => meal.foods.map(food => food.name)));
  const newFoodsIntroduced = uniqueFoods.filter(food => !previousFoods.has(food));

  return {
    period: `${startDate} - ${endDate}`,
    totalFoods: allFoods.length,
    uniqueFoods,
    categoryDistribution,
    topFoods,
    newFoodsIntroduced
  };
}

/**
 * 成長レポートを生成
 */
export function generateGrowthReport(period: 'week' | 'month' | 'custom', customStartDate?: string, customEndDate?: string): GrowthReportData | null {
  const profile = getProfile();
  if (!profile) {
    return null;
  }

  const { startDate, endDate } = calculatePeriodDates(period, customStartDate, customEndDate);
  
  const periodAnalysis = analyzePeriodNutrition(startDate, endDate, profile);
  const diversityAnalysis = analyzeFoodDiversity(startDate, endDate);
  const trends = analyzeNutritionTrends(startDate, endDate, profile);
  const recommendations = generateRecommendations(periodAnalysis, diversityAnalysis, profile);

  return {
    profile,
    currentAge: calculateAgeInMonths(profile.birthDate),
    periodAnalysis,
    diversityAnalysis,
    trends,
    recommendations
  };
}

/**
 * 栄養摂取トレンドを分析
 */
function analyzeNutritionTrends(startDate: string, endDate: string, profile: BabyProfile): NutritionTrends {
  // 週別の進捗を計算
  const weeklyProgress = calculateWeeklyProgress(startDate, endDate, profile);
  
  // 改善・悪化している栄養素を特定
  const improvingNutrients: Array<keyof Nutrition> = [];
  const decliningNutrients: Array<keyof Nutrition> = [];
  
  if (weeklyProgress.length >= 2) {
    const firstWeek = weeklyProgress[0];
    const lastWeek = weeklyProgress[weeklyProgress.length - 1];
    
    (Object.keys(firstWeek.averageNutrition) as Array<keyof Nutrition>).forEach(nutrient => {
      const change = lastWeek.averageNutrition[nutrient] - firstWeek.averageNutrition[nutrient];
      if (change > 0) {
        improvingNutrients.push(nutrient);
      } else if (change < 0) {
        decliningNutrients.push(nutrient);
      }
    });
  }

  // 一貫性スコアを計算（記録の継続性）
  const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const recordedDays = getMealRecords().filter(meal => meal.date >= startDate && meal.date <= endDate);
  const uniqueRecordedDays = new Set(recordedDays.map(meal => meal.date)).size;
  const consistencyScore = Math.round((uniqueRecordedDays / totalDays) * 100);

  return {
    weeklyProgress,
    improvingNutrients,
    decliningNutrients,
    consistencyScore
  };
}

/**
 * 週別進捗を計算
 */
function calculateWeeklyProgress(startDate: string, endDate: string, profile: BabyProfile): WeeklyProgress[] {
  const weeks: WeeklyProgress[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const currentStart = new Date(start);
  
  while (currentStart <= end) {
    const weekEnd = new Date(currentStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    if (weekEnd > end) {
      weekEnd.setTime(end.getTime());
    }
    
    const weekStartStr = currentStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    const weekAnalysis = analyzePeriodNutrition(weekStartStr, weekEndStr, profile);
    
    weeks.push({
      week: `週${weeks.length + 1}`,
      startDate: weekStartStr,
      endDate: weekEndStr,
      averageNutrition: weekAnalysis.averageNutrition,
      achievementRate: calculateOverallAchievementRate(weekAnalysis.achievementRates)
    });
    
    currentStart.setDate(currentStart.getDate() + 7);
  }
  
  return weeks;
}

/**
 * レコメンデーションを生成
 */
function generateRecommendations(
  periodAnalysis: PeriodNutritionAnalysis,
  diversityAnalysis: FoodDiversityAnalysis,
  profile: BabyProfile
): string[] {
  const recommendations: string[] = [];
  
  // 記録の継続性について
  const recordingRate = (periodAnalysis.recordedDays / periodAnalysis.totalDays) * 100;
  if (recordingRate < 70) {
    recommendations.push('食事記録をより継続的に行いましょう。毎日の記録が栄養管理に重要です。');
  }
  
  // 不足栄養素について
  if (periodAnalysis.deficientNutrients.length > 0) {
    const nutrientNames = {
      protein: 'タンパク質',
      carbs: '炭水化物',
      fat: '脂質',
      fiber: '食物繊維',
      iron: '鉄分',
      calcium: 'カルシウム'
    };
    
    const deficientNames = periodAnalysis.deficientNutrients.map(n => nutrientNames[n]);
    recommendations.push(`${deficientNames.join('、')}が不足気味です。これらを多く含む食材を増やしてみましょう。`);
  }
  
  // 食材多様性について
  if (diversityAnalysis.uniqueFoods.length < 5) {
    recommendations.push('食材の種類を増やして、栄養バランスを向上させましょう。');
  }
  
  // 新しい食材の導入について
  if (diversityAnalysis.newFoodsIntroduced.length === 0) {
    recommendations.push('新しい食材を少しずつ導入して、食の幅を広げてみましょう。');
  }
  
  return recommendations;
}

/**
 * ヘルパー関数群
 */

function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

function calculateAverageNutrition(nutritions: Nutrition[]): Nutrition {
  if (nutritions.length === 0) {
    return { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 };
  }
  
  const sum = nutritions.reduce((acc, nutrition) => ({
    protein: acc.protein + nutrition.protein,
    carbs: acc.carbs + nutrition.carbs,
    fat: acc.fat + nutrition.fat,
    fiber: acc.fiber + nutrition.fiber,
    iron: acc.iron + nutrition.iron,
    calcium: acc.calcium + nutrition.calcium
  }), { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 });
  
  return {
    protein: sum.protein / nutritions.length,
    carbs: sum.carbs / nutritions.length,
    fat: sum.fat / nutritions.length,
    fiber: sum.fiber / nutritions.length,
    iron: sum.iron / nutritions.length,
    calcium: sum.calcium / nutritions.length
  };
}

function calculateAchievementRates(actual: Nutrition, recommended: Nutrition | null): Record<keyof Nutrition, number> {
  if (!recommended) {
    return { protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0 };
  }
  
  return {
    protein: Math.min(100, Math.round((actual.protein / recommended.protein) * 100)),
    carbs: Math.min(100, Math.round((actual.carbs / recommended.carbs) * 100)),
    fat: Math.min(100, Math.round((actual.fat / recommended.fat) * 100)),
    fiber: Math.min(100, Math.round((actual.fiber / recommended.fiber) * 100)),
    iron: Math.min(100, Math.round((actual.iron / recommended.iron) * 100)),
    calcium: Math.min(100, Math.round((actual.calcium / recommended.calcium) * 100))
  };
}

function calculateOverallAchievementRate(rates: Record<keyof Nutrition, number>): number {
  const values = Object.values(rates);
  return Math.round(values.reduce((sum, rate) => sum + rate, 0) / values.length);
}

function calculatePeriodDates(period: 'week' | 'month' | 'custom', customStartDate?: string, customEndDate?: string): { startDate: string; endDate: string } {
  const today = new Date();
  
  if (period === 'custom' && customStartDate && customEndDate) {
    return { startDate: customStartDate, endDate: customEndDate };
  }
  
  if (period === 'week') {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  }
  
  if (period === 'month') {
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  }
  
  // デフォルトは週
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  };
}