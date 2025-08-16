export interface Nutrition {
  protein: number;      // タンパク質(g)
  carbs: number;       // 炭水化物(g)
  fat: number;         // 脂質(g)
  fiber: number;       // 食物繊維(g)
  iron: number;        // 鉄分(mg)
  calcium: number;     // カルシウム(mg)
}

export interface Food {
  name: string;        // 食材名
  amount: number;      // 分量(g)
  nutrition: Nutrition;
}

export interface MealRecord {
  id: string;
  date: string;        // 食事日 (YYYY-MM-DD)
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';
  mealLabel: '朝食' | '昼食' | '夕食' | 'おやつ（午前）' | 'おやつ（午後）';
  foods: Food[];
  memo: string;        // メモ
  createdAt?: string;
  updatedAt?: string;
}

export interface BabyProfile {
  id?: string;
  name: string;        // 名前
  birthDate: string;   // 誕生日 (YYYY-MM-DD)
  createdAt?: string;
  updatedAt?: string;
}

export interface BasicFood {
  name: string;
  nutritionPer100g: Nutrition;
  category: 'grain' | 'vegetable' | 'protein' | 'fruit' | 'other';
}

export interface NutritionRecommendation {
  ageMonths: number;
  mealsPerDay: number;
  nutrition: Nutrition;
}

export type MealType = MealRecord['mealType'];
export type MealLabel = MealRecord['mealLabel'];

export interface NutritionAnalysis {
  totalNutrition: Nutrition;
  recommendedNutrition: Nutrition;
  achievementRate: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    iron: number;
    calcium: number;
  };
  deficientNutrients: Array<keyof Nutrition>;
}

export interface DailyNutrition {
  date: string;
  totalNutrition: Nutrition;
  mealCount: number;
}