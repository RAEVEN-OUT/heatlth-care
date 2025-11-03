'use client';

import React, { useState } from 'react';
import { Apple, Flame, AlertCircle } from 'lucide-react';
import type { NutritionData, NutritionalFood } from '../../types';

export default function NutritionTracker() {
  const [foodQuery, setFoodQuery] = useState<string>('');
  const [nutritionData, setNutritionData] = useState<NutritionData[]>([]);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const CALORIE_LIMIT = 2000;

  const searchFood = async () => {
    if (!foodQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: foodQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch nutrition data');
      }

      if (data.foods) {
        const newFoods: NutritionData[] = data.foods.map((food: NutritionalFood) => ({
          id: Date.now() + Math.random(),
          name: food.food_name,
          calories: food.nf_calories,
          protein: food.nf_protein,
          carbs: food.nf_total_carbohydrate,
          fat: food.nf_total_fat,
          serving: `${food.serving_qty} ${food.serving_unit}`,
        }));

        setNutritionData([...nutritionData, ...newFoods]);
        setTotalCalories(
          totalCalories + newFoods.reduce((sum, f) => sum + f.calories, 0)
        );
        setFoodQuery('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const removeFood = (id: number, calories: number) => {
    setNutritionData(nutritionData.filter((food) => food.id !== id));
    setTotalCalories(totalCalories - calories);
  };

  const clearAll = () => {
    setNutritionData([]);
    setTotalCalories(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card">
        <div className="card__header" style={{ background: 'var(--color-primary)' }}>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <Apple size={32} />
            Nutrition Tracker
          </h1>
          <p className="text-sm mt-2 text-white opacity-90">
            Track your daily calorie and macronutrient intake
          </p>
        </div>

        <div className="card__body">
          {/* Calorie Progress */}
          <div className="mb-6 p-4 rounded-lg" style={{ background: 'var(--color-bg-2)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold flex items-center gap-2">
                <Flame className="text-color-warning" size={20} />
                Daily Calories
              </span>
              <span className="text-2xl font-bold">
                {Math.round(totalCalories)} / {CALORIE_LIMIT}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min((totalCalories / CALORIE_LIMIT) * 100, 100)}%`,
                  background:
                    totalCalories > CALORIE_LIMIT
                      ? 'var(--color-error)'
                      : 'var(--color-success)',
                }}
              />
            </div>
            {totalCalories > CALORIE_LIMIT && (
              <div className="status status--error mt-3 flex items-center gap-2">
                <AlertCircle size={18} />
                You&apos;ve exceeded your daily calorie limit!
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              className="form-control flex-1"
              placeholder="Enter food (e.g., 1 apple, 200g chicken breast)"
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchFood()}
            />
            <button
              className="btn btn--primary"
              onClick={searchFood}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Food'}
            </button>
          </div>

          {error && <div className="status status--error mb-4">{error}</div>}

          {/* Food List */}
          {nutritionData.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Today&apos;s Intake</h2>
                <button className="btn btn--secondary btn--sm" onClick={clearAll}>
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {nutritionData.map((food) => (
                  <div
                    key={food.id}
                    className="card"
                    style={{ background: 'var(--color-bg-3)' }}
                  >
                    <div className="card__body">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold capitalize">{food.name}</h3>
                          <p className="text-sm text-color-text-secondary">
                            {food.serving}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>🔥 {Math.round(food.calories)} cal</span>
                            <span>🥩 {Math.round(food.protein)}g protein</span>
                            <span>🍞 {Math.round(food.carbs)}g carbs</span>
                            <span>🥑 {Math.round(food.fat)}g fat</span>
                          </div>
                        </div>
                        <button
                          className="btn btn--outline btn--sm"
                          onClick={() => removeFood(food.id, food.calories)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
