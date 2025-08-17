import {
  saveMealRecord,
  getMealRecord,
  getMealRecords,
  updateMealRecord,
  deleteMealRecord,
  getMealRecordsByDate,
  generateMealRecordId
} from '@/lib/mealRecordManager';
import { MealRecord, FoodItem } from '@/types';

describe('食事記録管理ロジック', () => {
  const mockFoodItems: FoodItem[] = [
    {
      name: 'お粥',
      amount: 50,
      nutrition: {
        protein: 0.75,
        carbs: 8.0,
        fat: 0.05,
        fiber: 0.15,
        iron: 0.05,
        calcium: 1.5
      }
    },
    {
      name: 'にんじん',
      amount: 20,
      nutrition: {
        protein: 0.14,
        carbs: 1.82,
        fat: 0.04,
        fiber: 0.56,
        iron: 0.04,
        calcium: 5.6
      }
    }
  ];

  const validMealRecord: MealRecord = {
    id: 'meal-test-123',
    date: '2024-08-17',
    mealType: 'breakfast',
    foods: mockFoodItems,
    notes: 'よく食べました',
    createdAt: '2024-08-17T08:00:00.000Z',
    updatedAt: '2024-08-17T08:00:00.000Z'
  };

  // テスト前にlocalStorageをクリア
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('generateMealRecordId 関数', () => {
    test('一意のIDを生成できる', () => {
      const id1 = generateMealRecordId();
      const id2 = generateMealRecordId();

      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });

    test('IDが正しい形式で生成される', () => {
      const id = generateMealRecordId();
      expect(id).toMatch(/^meal-\d+-[a-z0-9]+$/);
    });
  });

  describe('saveMealRecord 関数', () => {
    test('新しい食事記録を正常に保存できる', () => {
      const newMeal = {
        date: '2024-08-17',
        mealType: 'lunch' as const,
        foods: [mockFoodItems[0]],
        notes: 'お昼ご飯'
      };

      const savedMeal = saveMealRecord(newMeal);

      expect(savedMeal).toHaveProperty('id');
      expect(savedMeal).toHaveProperty('createdAt');
      expect(savedMeal).toHaveProperty('updatedAt');
      expect(savedMeal.date).toBe('2024-08-17');
      expect(savedMeal.mealType).toBe('lunch');
      expect(savedMeal.foods).toEqual([mockFoodItems[0]]);
      expect(savedMeal.notes).toBe('お昼ご飯');
      expect(typeof savedMeal.id).toBe('string');
      expect(savedMeal.id.length).toBeGreaterThan(0);
    });

    test('IDが指定された場合はそのIDで保存', () => {
      const mealWithId = {
        id: 'custom-meal-456',
        date: '2024-08-17',
        mealType: 'dinner' as const,
        foods: mockFoodItems,
        notes: '夕食'
      };

      const savedMeal = saveMealRecord(mealWithId);

      expect(savedMeal.id).toBe('custom-meal-456');
      expect(savedMeal.mealType).toBe('dinner');
    });

    test('localStorageに正しく保存される', () => {
      const meal = {
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: mockFoodItems,
        notes: '朝食'
      };

      const savedMeal = saveMealRecord(meal);
      const storedData = localStorage.getItem('mealRecords');
      
      expect(storedData).not.toBeNull();
      const parsedData = JSON.parse(storedData!);
      expect(Array.isArray(parsedData)).toBe(true);
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0].id).toBe(savedMeal.id);
      expect(parsedData[0].date).toBe('2024-08-17');
    });

    test('複数の食事記録を保存できる', () => {
      const meal1 = {
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[0]]
      };

      const meal2 = {
        date: '2024-08-17',
        mealType: 'lunch' as const,
        foods: [mockFoodItems[1]]
      };

      const saved1 = saveMealRecord(meal1);
      const saved2 = saveMealRecord(meal2);

      expect(saved1.id).not.toBe(saved2.id);

      const storedData = localStorage.getItem('mealRecords');
      const parsedData = JSON.parse(storedData!);
      expect(parsedData).toHaveLength(2);
    });
  });

  describe('getMealRecord 関数', () => {
    test('保存された食事記録を正常に取得できる', () => {
      // 事前に食事記録を保存
      const savedMeal = saveMealRecord({
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: mockFoodItems
      });

      const retrievedMeal = getMealRecord(savedMeal.id);

      expect(retrievedMeal).not.toBeNull();
      expect(retrievedMeal?.id).toBe(savedMeal.id);
      expect(retrievedMeal?.date).toBe('2024-08-17');
      expect(retrievedMeal?.mealType).toBe('breakfast');
      expect(retrievedMeal?.foods).toEqual(mockFoodItems);
    });

    test('存在しない記録の場合はnullを返す', () => {
      const meal = getMealRecord('nonexistent-id');
      expect(meal).toBeNull();
    });

    test('不正なJSONデータの場合はnullを返す', () => {
      localStorage.setItem('mealRecords', '不正なJSON');
      const meal = getMealRecord('any-id');
      expect(meal).toBeNull();
    });
  });

  describe('getMealRecords 関数', () => {
    test('すべての食事記録を取得できる', () => {
      // 複数の食事記録を保存
      const meal1 = saveMealRecord({
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[0]]
      });

      const meal2 = saveMealRecord({
        date: '2024-08-17',
        mealType: 'lunch' as const,
        foods: [mockFoodItems[1]]
      });

      const allMeals = getMealRecords();

      expect(allMeals).toHaveLength(2);
      expect(allMeals.find(m => m.id === meal1.id)).toBeTruthy();
      expect(allMeals.find(m => m.id === meal2.id)).toBeTruthy();
    });

    test('記録が存在しない場合は空配列を返す', () => {
      const meals = getMealRecords();
      expect(meals).toEqual([]);
    });

    test('日付順（新しい順）で取得できる', () => {
      const meal1 = saveMealRecord({
        date: '2024-08-15',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[0]]
      });

      const meal2 = saveMealRecord({
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[1]]
      });

      const meal3 = saveMealRecord({
        date: '2024-08-16',
        mealType: 'lunch' as const,
        foods: [mockFoodItems[0]]
      });

      const allMeals = getMealRecords();

      expect(allMeals).toHaveLength(3);
      expect(allMeals[0].date).toBe('2024-08-17'); // 最新
      expect(allMeals[1].date).toBe('2024-08-16');
      expect(allMeals[2].date).toBe('2024-08-15'); // 最古
    });
  });

  describe('updateMealRecord 関数', () => {
    test('既存の食事記録を正常に更新できる', () => {
      // 事前に食事記録を保存
      const originalMeal = saveMealRecord({
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[0]],
        notes: '朝食（更新前）'
      });

      const updates = {
        mealType: 'lunch' as const,
        foods: mockFoodItems,
        notes: 'ランチ（更新後）'
      };

      const updatedMeal = updateMealRecord(originalMeal.id, updates);

      expect(updatedMeal).not.toBeNull();
      expect(updatedMeal?.id).toBe(originalMeal.id);
      expect(updatedMeal?.date).toBe(originalMeal.date); // 日付は変更されない
      expect(updatedMeal?.mealType).toBe('lunch');
      expect(updatedMeal?.foods).toEqual(mockFoodItems);
      expect(updatedMeal?.notes).toBe('ランチ（更新後）');
      expect(updatedMeal?.createdAt).toBe(originalMeal.createdAt);
      expect(updatedMeal?.updatedAt).not.toBe(originalMeal.updatedAt);
    });

    test('記録が存在しない場合はnullを返す', () => {
      const updatedMeal = updateMealRecord('nonexistent-id', { notes: '存在しない' });
      expect(updatedMeal).toBeNull();
    });
  });

  describe('deleteMealRecord 関数', () => {
    test('食事記録を正常に削除できる', () => {
      // 事前に食事記録を保存
      const savedMeal = saveMealRecord({
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: mockFoodItems
      });

      const result = deleteMealRecord(savedMeal.id);
      expect(result).toBe(true);

      // 削除後は取得できないことを確認
      const meal = getMealRecord(savedMeal.id);
      expect(meal).toBeNull();
    });

    test('記録が存在しない場合はfalseを返す', () => {
      const result = deleteMealRecord('nonexistent-id');
      expect(result).toBe(false);
    });

    test('複数記録から特定の記録のみ削除', () => {
      const meal1 = saveMealRecord({
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[0]]
      });

      const meal2 = saveMealRecord({
        date: '2024-08-17',
        mealType: 'lunch' as const,
        foods: [mockFoodItems[1]]
      });

      const result = deleteMealRecord(meal1.id);
      expect(result).toBe(true);

      // meal1は削除されているが、meal2は残っている
      expect(getMealRecord(meal1.id)).toBeNull();
      expect(getMealRecord(meal2.id)).not.toBeNull();

      const allMeals = getMealRecords();
      expect(allMeals).toHaveLength(1);
      expect(allMeals[0].id).toBe(meal2.id);
    });
  });

  describe('getMealRecordsByDate 関数', () => {
    test('指定した日付の食事記録を取得できる', () => {
      // 異なる日付の食事記録を保存
      const meal1 = saveMealRecord({
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[0]]
      });

      const meal2 = saveMealRecord({
        date: '2024-08-17',
        mealType: 'lunch' as const,
        foods: [mockFoodItems[1]]
      });

      const meal3 = saveMealRecord({
        date: '2024-08-16',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[0]]
      });

      const targetDateMeals = getMealRecordsByDate('2024-08-17');

      expect(targetDateMeals).toHaveLength(2);
      expect(targetDateMeals.find(m => m.id === meal1.id)).toBeTruthy();
      expect(targetDateMeals.find(m => m.id === meal2.id)).toBeTruthy();
      expect(targetDateMeals.find(m => m.id === meal3.id)).toBeFalsy();
    });

    test('該当する日付の記録がない場合は空配列を返す', () => {
      const meals = getMealRecordsByDate('2024-08-20');
      expect(meals).toEqual([]);
    });

    test('食事の種類順（breakfast, lunch, dinner, snack）で並ぶ', () => {
      const mealSnack = saveMealRecord({
        date: '2024-08-17',
        mealType: 'snack' as const,
        foods: [mockFoodItems[0]]
      });

      const mealBreakfast = saveMealRecord({
        date: '2024-08-17',
        mealType: 'breakfast' as const,
        foods: [mockFoodItems[1]]
      });

      const mealDinner = saveMealRecord({
        date: '2024-08-17',
        mealType: 'dinner' as const,
        foods: [mockFoodItems[0]]
      });

      const mealLunch = saveMealRecord({
        date: '2024-08-17',
        mealType: 'lunch' as const,
        foods: [mockFoodItems[1]]
      });

      const dayMeals = getMealRecordsByDate('2024-08-17');

      expect(dayMeals).toHaveLength(4);
      expect(dayMeals[0].mealType).toBe('breakfast');
      expect(dayMeals[1].mealType).toBe('lunch');
      expect(dayMeals[2].mealType).toBe('dinner');
      expect(dayMeals[3].mealType).toBe('snack');
    });
  });
});