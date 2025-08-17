import { BasicFood } from '@/types';

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

export const getFoodByName = (name: string): BasicFood | undefined => {
  return basicFoods.find(food => food.name === name);
};

export const getFoodsByCategory = (category: BasicFood['category']): BasicFood[] => {
  return basicFoods.filter(food => food.category === category);
};

export const getFoodNames = (): string[] => {
  return basicFoods.map(food => food.name);
};