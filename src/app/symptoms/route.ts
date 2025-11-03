import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const { symptoms, age, gender } = (body || {}) as { 
      symptoms?: string; 
      age?: string; 
      gender?: string 
    };

    if (!symptoms || !age || !gender) {
      return NextResponse.json(
        { error: 'Symptoms, age, and gender are required' },
        { status: 400 }
      );
    }

    const appId = process.env.INFERMEDICA_APP_ID;
    const appKey = process.env.INFERMEDICA_APP_KEY;

    if (!appId || !appKey) {
      console.error('Missing Infermedica API credentials');
      return NextResponse.json(
        { error: 'Symptom checker service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Parse symptoms
    const parseResponse = await fetch('https://api.infermedica.com/v3/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'App-Id': appId,
        'App-Key': appKey,
      },
      body: JSON.stringify({ text: symptoms }),
    });

    if (!parseResponse.ok) {
      throw new Error(`Parse failed: ${parseResponse.status}`);
    }

    const parseData = await parseResponse.json();

    // Get diagnosis
    const diagnosisResponse = await fetch(
      'https://api.infermedica.com/v3/diagnosis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'App-Id': appId,
          'App-Key': appKey,
        },
        body: JSON.stringify({
          sex: gender,
          age: { value: parseInt(age) },
          evidence: parseData.mentions.map((m: any) => ({
            id: m.id,
            choice_id: 'present',
          })),
        }),
      }
    );

    if (!diagnosisResponse.ok) {
      throw new Error(`Diagnosis failed: ${diagnosisResponse.status}`);
    }

    const diagnosisData = await diagnosisResponse.json();
    return NextResponse.json(diagnosisData);
  } catch (error) {
    console.error('Infermedica API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze symptoms. Please try again.' },
      { status: 500 }
    );
  }
}