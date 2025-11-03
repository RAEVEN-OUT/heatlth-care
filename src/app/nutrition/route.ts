import { NextRequest, NextResponse } from 'next/server';

type FdcSearchFood = { fdcId: number; description: string; dataType?: string; brandName?: string; };
type FdcNutrient = { nutrientName?: string; unitName?: string; value?: number; };
type FdcFoodDetail = {
  description?: string;
  brandName?: string;
  labelNutrients?: {
    calories?: { value?: number };
    protein?: { value?: number };
    carbohydrates?: { value?: number };
    fat?: { value?: number };
  };
  foodNutrients?: Array<{ nutrient?: { name?: string }; amount?: number; unitName?: string }>;
};

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json() as { query?: string };
    if (!query) return NextResponse.json({ error: 'Food query is required' }, { status: 400 });

    const apiKey = process.env.FDC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Missing FDC API key' }, { status: 500 });

    // 1) Search for a food
    const searchRes = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=1`);
    if (!searchRes.ok) return NextResponse.json({ error: 'FDC search failed' }, { status: 502 });
    const searchJson = await searchRes.json() as { foods?: FdcSearchFood[] };
    const first = searchJson.foods?.[0];
    if (!first?.fdcId) return NextResponse.json({ foods: [] });

    // 2) Get details for nutrients
    const detailRes = await fetch(`https://api.nal.usda.gov/fdc/v1/food/${first.fdcId}?api_key=${apiKey}`);
    if (!detailRes.ok) return NextResponse.json({ error: 'FDC details failed' }, { status: 502 });
    const detail = await detailRes.json() as FdcFoodDetail;

    const name = detail.description || first.description || 'Unknown Food';

    // Prefer labelNutrients when available (branded), else derive from foodNutrients
    const ln = detail.labelNutrients;
    let calories = ln?.calories?.value ?? 0;
    let protein = ln?.protein?.value ?? 0;
    let carbs = ln?.carbohydrates?.value ?? 0;
    let fat = ln?.fat?.value ?? 0;

    if (!ln && Array.isArray(detail.foodNutrients)) {
      const find = (n: string) =>
        detail.foodNutrients?.find(fn => fn.nutrient?.name?.toLowerCase().includes(n))?.amount ?? 0;
      // Values are typically per 100 g serving
      calories = find('energy');        // kcal
      protein  = find('protein');       // g
      carbs    = find('carbohydrate');  // g
      fat      = find('fat');           // g
    }

    // Normalize to NutritionData-style shape (assume 100 g)
    const foods = [{
      id: Date.now(),
      name,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      serving: '100 g',
    }];

    return NextResponse.json({ foods });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch nutrition data' }, { status: 500 });
  }
}
