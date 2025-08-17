import { basicFoods, getFoodByName, getFoodsByCategory, getFoodNames } from '@/data/basicFoods';
import { BasicFood } from '@/types';

describe('基本食材データベース', () => {
  describe('basicFoods データ', () => {
    test('10種類の基本食材が定義されている', () => {
      expect(basicFoods).toHaveLength(10);
    });

    test('すべての食材に必要なプロパティが含まれている', () => {
      basicFoods.forEach((food) => {
        expect(food).toHaveProperty('name');
        expect(food).toHaveProperty('category');
        expect(food).toHaveProperty('nutritionPer100g');
        
        expect(food.nutritionPer100g).toHaveProperty('protein');
        expect(food.nutritionPer100g).toHaveProperty('carbs');
        expect(food.nutritionPer100g).toHaveProperty('fat');
        expect(food.nutritionPer100g).toHaveProperty('fiber');
        expect(food.nutritionPer100g).toHaveProperty('iron');
        expect(food.nutritionPer100g).toHaveProperty('calcium');
      });
    });

    test('栄養素の値が数値型である', () => {
      basicFoods.forEach((food) => {
        const nutrition = food.nutritionPer100g;
        expect(typeof nutrition.protein).toBe('number');
        expect(typeof nutrition.carbs).toBe('number');
        expect(typeof nutrition.fat).toBe('number');
        expect(typeof nutrition.fiber).toBe('number');
        expect(typeof nutrition.iron).toBe('number');
        expect(typeof nutrition.calcium).toBe('number');
      });
    });

    test('栄養素の値が0以上である', () => {
      basicFoods.forEach((food) => {
        const nutrition = food.nutritionPer100g;
        expect(nutrition.protein).toBeGreaterThanOrEqual(0);
        expect(nutrition.carbs).toBeGreaterThanOrEqual(0);
        expect(nutrition.fat).toBeGreaterThanOrEqual(0);
        expect(nutrition.fiber).toBeGreaterThanOrEqual(0);
        expect(nutrition.iron).toBeGreaterThanOrEqual(0);
        expect(nutrition.calcium).toBeGreaterThanOrEqual(0);
      });
    });

    test('期待される食材名が含まれている', () => {
      const expectedFoods = [
        'お粥', 'にんじん', 'かぼちゃ', 'ほうれん草', '豆腐',
        '鶏ささみ', '白身魚', 'バナナ', 'りんご', 'さつまいも'
      ];
      
      const actualFoodNames = basicFoods.map(food => food.name);
      expectedFoods.forEach(foodName => {
        expect(actualFoodNames).toContain(foodName);
      });
    });
  });

  describe('getFoodByName 関数', () => {
    test('存在する食材名で検索すると正しい食材が返される', () => {
      const rice = getFoodByName('お粥');
      expect(rice).toBeDefined();
      expect(rice?.name).toBe('お粥');
      expect(rice?.category).toBe('grain');
    });

    test('存在しない食材名で検索するとundefinedが返される', () => {
      const result = getFoodByName('存在しない食材');
      expect(result).toBeUndefined();
    });

    test('空文字で検索するとundefinedが返される', () => {
      const result = getFoodByName('');
      expect(result).toBeUndefined();
    });
  });

  describe('getFoodsByCategory 関数', () => {
    test('grain カテゴリで検索すると穀物類が返される', () => {
      const grains = getFoodsByCategory('grain');
      expect(grains).toHaveLength(1);
      expect(grains[0].name).toBe('お粥');
    });

    test('vegetable カテゴリで検索すると野菜類が返される', () => {
      const vegetables = getFoodsByCategory('vegetable');
      expect(vegetables.length).toBeGreaterThan(0);
      const vegetableNames = vegetables.map(v => v.name);
      expect(vegetableNames).toContain('にんじん');
      expect(vegetableNames).toContain('かぼちゃ');
      expect(vegetableNames).toContain('ほうれん草');
    });

    test('protein カテゴリで検索するとタンパク質食品が返される', () => {
      const proteins = getFoodsByCategory('protein');
      expect(proteins.length).toBeGreaterThan(0);
      const proteinNames = proteins.map(p => p.name);
      expect(proteinNames).toContain('豆腐');
      expect(proteinNames).toContain('鶏ささみ');
      expect(proteinNames).toContain('白身魚');
    });

    test('fruit カテゴリで検索すると果物類が返される', () => {
      const fruits = getFoodsByCategory('fruit');
      expect(fruits.length).toBeGreaterThan(0);
      const fruitNames = fruits.map(f => f.name);
      expect(fruitNames).toContain('バナナ');
      expect(fruitNames).toContain('りんご');
    });
  });

  describe('getFoodNames 関数', () => {
    test('すべての食材名の配列が返される', () => {
      const foodNames = getFoodNames();
      expect(foodNames).toHaveLength(10);
      expect(foodNames).toContain('お粥');
      expect(foodNames).toContain('豆腐');
      expect(foodNames).toContain('バナナ');
    });

    test('返される配列に重複がない', () => {
      const foodNames = getFoodNames();
      const uniqueNames = [...new Set(foodNames)];
      expect(foodNames).toHaveLength(uniqueNames.length);
    });
  });
});