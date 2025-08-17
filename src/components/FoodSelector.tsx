'use client';

import { useState } from 'react';
import { FoodItem } from '@/types';
import { getFoodByName } from '@/data/basicFoods';
import { calculateFoodNutrition } from '@/lib/nutritionCalculator';

/**
 * 食材選択コンポーネントのプロパティ
 */
interface FoodSelectorProps {
  /** 選択済み食材リスト */
  selectedFoods: FoodItem[];
  /** 食材追加時のコールバック */
  onAddFood: (food: FoodItem) => void;
  /** 食材削除時のコールバック */
  onRemoveFood: (index: number) => void;
  /** 食材更新時のコールバック */
  onUpdateFood: (index: number, updatedFood: FoodItem) => void;
}

/**
 * 食材選択と分量入力を行うコンポーネント
 * よく使う食材はボタン形式で表示し、その他はカスタム入力
 */
export function FoodSelector({ selectedFoods, onAddFood, onRemoveFood, onUpdateFood }: FoodSelectorProps) {
  // よく使う基本食材（ボタン表示用）
  const commonFoods = [
    'お粥', 'にんじん', 'かぼちゃ', 'ほうれん草',
    '豆腐', '鶏ささみ', '白身魚', 'バナナ',
    'りんご', 'さつまいも'
  ];

  // カスタム食材入力の状態
  const [customFoodName, setCustomFoodName] = useState('');
  const [customFoodAmount, setCustomFoodAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState<string | null>(null);
  const [tempAmount, setTempAmount] = useState('');

  /**
   * よく使う食材のボタンクリック時
   */
  const handleCommonFoodClick = (foodName: string) => {
    setShowAmountInput(foodName);
    setTempAmount('');
  };

  /**
   * 分量入力後の追加処理
   */
  const handleAddCommonFood = (foodName: string) => {
    const amount = parseFloat(tempAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    addFoodWithAmount(foodName, amount);
    setShowAmountInput(null);
    setTempAmount('');
  };

  /**
   * カスタム食材の追加
   */
  const handleAddCustomFood = () => {
    if (!customFoodName || !customFoodAmount) {
      return;
    }

    const amount = parseFloat(customFoodAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    addFoodWithAmount(customFoodName, amount);
    setCustomFoodName('');
    setCustomFoodAmount('');
  };

  /**
   * 食材と分量で食材アイテムを作成・追加
   */
  const addFoodWithAmount = (foodName: string, amount: number) => {
    const foodData = getFoodByName(foodName);
    if (!foodData) {
      // カスタム食材の場合はデフォルト栄養価（ゼロ）
      const newFood: FoodItem = {
        name: foodName,
        amount: amount,
        nutrition: {
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          iron: 0,
          calcium: 0
        }
      };
      onAddFood(newFood);
      return;
    }

    // 分量に応じて栄養価を計算
    const nutrition = calculateFoodNutrition(foodName, amount);

    const newFood: FoodItem = {
      name: foodName,
      amount: amount,
      nutrition: nutrition
    };

    onAddFood(newFood);
  };

  /**
   * 既存食材の分量を更新
   */
  const handleUpdateAmount = (index: number, newAmount: string) => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    const currentFood = selectedFoods[index];
    
    // 基本食材かどうかチェック
    const foodData = getFoodByName(currentFood.name);
    let nutrition;
    
    if (foodData) {
      nutrition = calculateFoodNutrition(currentFood.name, amount);
    } else {
      // カスタム食材の場合は栄養価をゼロのまま維持
      nutrition = {
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        iron: 0,
        calcium: 0
      };
    }

    const updatedFood: FoodItem = {
      ...currentFood,
      amount: amount,
      nutrition: nutrition
    };

    onUpdateFood(index, updatedFood);
  };

  /**
   * 栄養価を表示形式にフォーマット
   */
  const formatNutrition = (value: number): string => {
    return value < 1 ? value.toFixed(2) : value.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* 基本的な離乳食（ボタン形式） */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">基本的な離乳食</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {commonFoods.map((foodName) => (
            <button
              key={foodName}
              onClick={() => handleCommonFoodClick(foodName)}
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <span className="text-gray-400 mr-2">+</span>
              <span className="text-gray-800 font-medium">{foodName}</span>
            </button>
          ))}
        </div>

        {/* 分量入力モーダル */}
        {showAmountInput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4 w-full">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                {showAmountInput}の分量を入力
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分量（グラム）
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={tempAmount}
                    onChange={(e) => setTempAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 50"
                    autoFocus
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAmountInput(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => handleAddCommonFood(showAmountInput)}
                    disabled={!tempAmount || parseFloat(tempAmount) <= 0}
                    className={`flex-1 px-4 py-2 rounded-md text-white font-medium ${
                      !tempAmount || parseFloat(tempAmount) <= 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* カスタム食材 */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">カスタム食材</h3>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={customFoodName}
            onChange={(e) => setCustomFoodName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="カスタム食材"
          />
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={customFoodAmount}
            onChange={(e) => setCustomFoodAmount(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="量(g)"
          />
          <button
            onClick={handleAddCustomFood}
            disabled={!customFoodName || !customFoodAmount}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              !customFoodName || !customFoodAmount
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500'
            }`}
          >
            追加
          </button>
        </div>
      </div>

      {/* 選択済み食材リスト */}
      {selectedFoods.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">今日の離乳食</h3>
          
          <div className="space-y-3">
            {selectedFoods.map((food, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{food.name}</h4>
                  <button
                    onClick={() => onRemoveFood(index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 分量調整 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分量（グラム）
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={food.amount}
                      onChange={(e) => handleUpdateAmount(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 栄養価表示（基本食材のみ） */}
                  {getFoodByName(food.name) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        栄養価
                      </label>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>タンパク質:</span>
                          <span>{formatNutrition(food.nutrition.protein)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>炭水化物:</span>
                          <span>{formatNutrition(food.nutrition.carbs)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>脂質:</span>
                          <span>{formatNutrition(food.nutrition.fat)}g</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 合計栄養価表示 */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-3">合計栄養価</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">タンパク質:</span>
                <span className="font-medium text-blue-800">
                  {formatNutrition(selectedFoods.reduce((sum, food) => sum + food.nutrition.protein, 0))}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">炭水化物:</span>
                <span className="font-medium text-blue-800">
                  {formatNutrition(selectedFoods.reduce((sum, food) => sum + food.nutrition.carbs, 0))}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">脂質:</span>
                <span className="font-medium text-blue-800">
                  {formatNutrition(selectedFoods.reduce((sum, food) => sum + food.nutrition.fat, 0))}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">食物繊維:</span>
                <span className="font-medium text-blue-800">
                  {formatNutrition(selectedFoods.reduce((sum, food) => sum + food.nutrition.fiber, 0))}g
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">鉄分:</span>
                <span className="font-medium text-blue-800">
                  {formatNutrition(selectedFoods.reduce((sum, food) => sum + food.nutrition.iron, 0))}mg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">カルシウム:</span>
                <span className="font-medium text-blue-800">
                  {formatNutrition(selectedFoods.reduce((sum, food) => sum + food.nutrition.calcium, 0))}mg
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}