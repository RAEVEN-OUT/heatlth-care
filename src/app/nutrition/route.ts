import { NextRequest, NextResponse } from 'next/server';

type FdcSearchFood = { 
  fdcId: number; 
  description: string; 
  dataType?: string; 
  brandName?: string; 
};

type FdcFoodDetail = {
  description?: string;
  brandName?: string;
  labelNutrients?: {
    calories?: { value?: number };
    protein?: { value?: number };
    carbohydrates?: { value?: number };
    fat?: { value?: number };
  };
  foodNutrients?: Array<{ 
    nutrient?: { name?: string }; 
    amount?: number; 
    unitName?: string 
  }>;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const { query } = (body || {}) as { query?: string };
    
    if (!query) {
      return NextResponse.json(
        { error: 'Food query is required' }, 
        { status: 400 }
      );
    }

    const apiKey = process.env.FDC_API_KEY;
    if (!apiKey) {
      console.error('Missing FDC_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Nutrition service temporarily unavailable' }, 
        { status: 503 }
      );
    }

    // 1) Search for a food
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=1`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!searchRes.ok) {
      throw new Error(`FDC search failed: ${searchRes.status}`);
    }
    
    const searchJson = await searchRes.json() as { foods?: FdcSearchFood[] };
    const first = searchJson.foods?.[0];
    
    if (!first?.fdcId) {
      return NextResponse.json({ foods: [] });
    }

    // 2) Get details for nutrients
    const detailUrl = `https://api.nal.usda.gov/fdc/v1/food/${first.fdcId}?api_key=${apiKey}`;
    const detailRes = await fetch(detailUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!detailRes.ok) {
      throw new Error(`FDC details failed: ${detailRes.status}`);
    }
    
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
        detail.foodNutrients?.find(fn => 
          fn.nutrient?.name?.toLowerCase().includes(n)
        )?.amount ?? 0;
      
      calories = find('energy');
      protein = find('protein');
      carbs = find('carbohydrate');
      fat = find('fat');
    }

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
  } catch (error) {
    console.error('Nutrition API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nutrition data. Please try again.' }, 
      { status: 500 }
    );
  }
}