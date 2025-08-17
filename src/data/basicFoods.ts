import { BasicFood } from '@/types';

/**
 * 基本離乳食データベース
 * 10種類の基本的な離乳食材の栄養価データ（100g基準）
 */
export const basicFoods: BasicFood[] = [
  {
    name: 'お粥',
    category: 'grain',
    nutritionPer100g: {
      protein: 1.5,
      carbs: 16.0,
      fat: 0.1,
      fiber: 0.3,
      iron: 0.1,
      calcium: 3.0,
    },
  },
  {
    name: 'にんじん',
    category: 'vegetable',
    nutritionPer100g: {
      protein: 0.7,
      carbs: 9.1,
      fat: 0.2,
      fiber: 2.8,
      iron: 0.2,
      calcium: 28.0,
    },
  },
  {
    name: 'かぼちゃ',
    category: 'vegetable',
    nutritionPer100g: {
      protein: 1.9,
      carbs: 17.1,
      fat: 0.3,
      fiber: 4.1,
      iron: 0.5,
      calcium: 20.0,
    },
  },
  {
    name: 'ほうれん草',
    category: 'vegetable',
    nutritionPer100g: {
      protein: 2.2,
      carbs: 3.1,
      fat: 0.4,
      fiber: 2.8,
      iron: 2.0,
      calcium: 49.0,
    },
  },
  {
    name: '豆腐',
    category: 'protein',
    nutritionPer100g: {
      protein: 6.6,
      carbs: 1.6,
      fat: 4.2,
      fiber: 0.4,
      iron: 0.9,
      calcium: 86.0,
    },
  },
  {
    name: '鶏ささみ',
    category: 'protein',
    nutritionPer100g: {
      protein: 23.0,
      carbs: 0.0,
      fat: 0.8,
      fiber: 0.0,
      iron: 0.2,
      calcium: 3.0,
    },
  },
  {
    name: '白身魚',
    category: 'protein',
    nutritionPer100g: {
      protein: 20.6,
      carbs: 0.1,
      fat: 0.3,
      fiber: 0.0,
      iron: 0.2,
      calcium: 11.0,
    },
  },
  {
    name: 'バナナ',
    category: 'fruit',
    nutritionPer100g: {
      protein: 1.1,
      carbs: 22.5,
      fat: 0.2,
      fiber: 1.1,
      iron: 0.3,
      calcium: 6.0,
    },
  },
  {
    name: 'りんご',
    category: 'fruit',
    nutritionPer100g: {
      protein: 0.2,
      carbs: 14.6,
      fat: 0.1,
      fiber: 1.5,
      iron: 0.1,
      calcium: 3.0,
    },
  },
  {
    name: 'さつまいも',
    category: 'other',
    nutritionPer100g: {
      protein: 1.2,
      carbs: 29.7,
      fat: 0.2,
      fiber: 3.5,
      iron: 0.7,
      calcium: 40.0,
    },
  },
];

/**
 * 食材名で基本食材データを検索します
 * @param name - 食材名
 * @returns 該当する食材データ（見つからない場合はundefined）
 * 
 * @example
 * ```typescript
 * const rice = getFoodByName('お粥');
 * if (rice) {
 *   console.log(`タンパク質: ${rice.nutritionPer100g.protein}g`);
 * }
 * ```
 */
export const getFoodByName = (name: string): BasicFood | undefined => {
  return basicFoods.find(food => food.name === name);
};

/**
 * カテゴリ別に食材データを取得します
 * @param category - 食材カテゴリ（'grain' | 'vegetable' | 'protein' | 'fruit' | 'other'）
 * @returns 該当カテゴリの食材配列
 * 
 * @example
 * ```typescript
 * // 野菜類の食材を取得
 * const vegetables = getFoodsByCategory('vegetable');
 * console.log(vegetables.map(v => v.name)); // ['にんじん', 'かぼちゃ', 'ほうれん草']
 * ```
 */
export const getFoodsByCategory = (category: BasicFood['category']): BasicFood[] => {
  return basicFoods.filter(food => food.category === category);
};

/**
 * 全ての基本食材の名前一覧を取得します
 * @returns 食材名の配列
 * 
 * @example
 * ```typescript
 * const allFoodNames = getFoodNames();
 * console.log(allFoodNames); // ['お粥', 'にんじん', 'かぼちゃ', ...]
 * ```
 */
export const getFoodNames = (): string[] => {
  return basicFoods.map(food => food.name);
};