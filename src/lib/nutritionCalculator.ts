import { Nutrition, MealRecord, NutritionAnalysis } from '@/types';
import { getFoodByName } from '@/data/basicFoods';

/**
 * 基本食材の栄養価を100g基準から実際の分量に換算して計算します
 * @param foodName - 食材名（基本食材データベースに登録されている名前）
 * @param amount - 分量（グラム）
 * @returns 計算された栄養価
 * 
 * @example
 * ```typescript
 * // お粥50gの栄養価を計算
 * const nutrition = calculateFoodNutrition('お粥', 50);
 * console.log(nutrition.protein); // 0.75g (1.5g × 50/100)
 * ```
 */
export function calculateFoodNutrition(foodName: string, amount: number): Nutrition {
  // 分量が0以下の場合はゼロ栄養価を返す
  if (amount <= 0) {
    return {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      iron: 0,
      calcium: 0
    };
  }

  // 基本食材データベースから食材情報を取得
  const food = getFoodByName(foodName);
  if (!food) {
    // 存在しない食材の場合はゼロ栄養価を返す
    return {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      iron: 0,
      calcium: 0
    };
  }

  // 100g基準から実際の分量への比率を計算
  const ratio = amount / 100;
  return {
    protein: food.nutritionPer100g.protein * ratio,
    carbs: food.nutritionPer100g.carbs * ratio,
    fat: food.nutritionPer100g.fat * ratio,
    fiber: food.nutritionPer100g.fiber * ratio,
    iron: food.nutritionPer100g.iron * ratio,
    calcium: food.nutritionPer100g.calcium * ratio
  };
}

/**
 * 食事記録から総栄養価を計算します
 * @param meal - 食事記録（食材リストを含む）
 * @returns 食事の総栄養価
 * 
 * @example
 * ```typescript
 * // 朝食の栄養価を計算
 * const breakfast = {
 *   foods: [
 *     { name: 'お粥', amount: 50, nutrition: {...} },
 *     { name: 'にんじん', amount: 20, nutrition: {...} }
 *   ]
 * };
 * const totalNutrition = calculateMealNutrition(breakfast);
 * ```
 */
export function calculateMealNutrition(meal: MealRecord): Nutrition {
  // ゼロ栄養価のベース値
  const emptyNutrition: Nutrition = {
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    iron: 0,
    calcium: 0
  };

  // 食材が空の場合はゼロ栄養価を返す
  if (!meal.foods || meal.foods.length === 0) {
    return emptyNutrition;
  }

  // 全食材の栄養価を合計
  return meal.foods.reduce((total, food) => ({
    protein: total.protein + food.nutrition.protein,
    carbs: total.carbs + food.nutrition.carbs,
    fat: total.fat + food.nutrition.fat,
    fiber: total.fiber + food.nutrition.fiber,
    iron: total.iron + food.nutrition.iron,
    calcium: total.calcium + food.nutrition.calcium
  }), emptyNutrition);
}

/**
 * 1日の複数食事記録から総栄養価を計算します
 * @param meals - 1日分の食事記録配列（朝食、昼食、夕食、おやつなど）
 * @returns 1日の総栄養価
 * 
 * @example
 * ```typescript
 * // 1日の栄養価を計算
 * const dailyMeals = [breakfast, lunch, dinner];
 * const dailyNutrition = calculateDailyNutrition(dailyMeals);
 * console.log(`1日のタンパク質摂取量: ${dailyNutrition.protein}g`);
 * ```
 */
export function calculateDailyNutrition(meals: MealRecord[]): Nutrition {
  // ゼロ栄養価のベース値
  const emptyNutrition: Nutrition = {
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    iron: 0,
    calcium: 0
  };

  // 食事記録が空の場合はゼロ栄養価を返す
  if (!meals || meals.length === 0) {
    return emptyNutrition;
  }

  // 各食事の栄養価を計算して合計
  return meals
    .map(calculateMealNutrition)
    .reduce((total, mealNutrition) => ({
      protein: total.protein + mealNutrition.protein,
      carbs: total.carbs + mealNutrition.carbs,
      fat: total.fat + mealNutrition.fat,
      fiber: total.fiber + mealNutrition.fiber,
      iron: total.iron + mealNutrition.iron,
      calcium: total.calcium + mealNutrition.calcium
    }), emptyNutrition);
}

/**
 * 実際の栄養摂取量と推奨量を比較して不足栄養素を特定します
 * @param actual - 実際の栄養摂取量
 * @param recommended - 推奨栄養摂取量
 * @returns 不足している栄養素の配列
 * 
 * @example
 * ```typescript
 * const actual = { protein: 5, carbs: 40, fat: 3, fiber: 2, iron: 1, calcium: 100 };
 * const recommended = { protein: 10, carbs: 50, fat: 5, fiber: 3, iron: 3, calcium: 200 };
 * const deficient = analyzeNutritionDeficiency(actual, recommended);
 * // ['protein', 'carbs', 'fat', 'fiber', 'iron', 'calcium'] が返される
 * ```
 */
export function analyzeNutritionDeficiency(
  actual: Nutrition, 
  recommended: Nutrition
): Array<keyof Nutrition> {
  const deficientNutrients: Array<keyof Nutrition> = [];
  
  // 各栄養素について実際の摂取量と推奨量を比較
  (Object.keys(recommended) as Array<keyof Nutrition>).forEach(nutrient => {
    if (actual[nutrient] < recommended[nutrient]) {
      deficientNutrients.push(nutrient);
    }
  });
  
  return deficientNutrients;
}

/**
 * 包括的な栄養分析レポートを生成します
 * @param actual - 実際の栄養摂取量
 * @param recommended - 推奨栄養摂取量
 * @returns 栄養分析レポート（摂取量、推奨量、達成率、不足栄養素を含む）
 * 
 * @example
 * ```typescript
 * const actual = { protein: 5, carbs: 50, fat: 5, fiber: 2, iron: 2, calcium: 150 };
 * const recommended = { protein: 10, carbs: 50, fat: 5, fiber: 3, iron: 3, calcium: 200 };
 * const analysis = generateNutritionAnalysis(actual, recommended);
 * 
 * console.log(analysis.achievementRate.protein); // 50 (50%達成)
 * console.log(analysis.deficientNutrients); // ['protein', 'fiber', 'iron', 'calcium']
 * ```
 */
export function generateNutritionAnalysis(
  actual: Nutrition,
  recommended: Nutrition
): NutritionAnalysis {
  // 各栄養素の達成率を計算（小数点以下切り捨て）
  const achievementRate = (Object.keys(recommended) as Array<keyof Nutrition>)
    .reduce((rates, nutrient) => {
      const rate = Math.floor((actual[nutrient] / recommended[nutrient]) * 100);
      rates[nutrient] = rate;
      return rates;
    }, {} as Record<keyof Nutrition, number>);

  // 不足栄養素を特定
  const deficientNutrients = analyzeNutritionDeficiency(actual, recommended);

  return {
    totalNutrition: actual,
    recommendedNutrition: recommended,
    achievementRate,
    deficientNutrients
  };
}