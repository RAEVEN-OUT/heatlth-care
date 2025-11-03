import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { symptoms, age, gender } = await request.json();

    if (!symptoms || !age || !gender) {
      return NextResponse.json(
        { error: 'Symptoms, age, and gender are required' },
        { status: 400 }
      );
    }

    // Parse symptoms
    const parseResponse = await fetch('https://api.infermedica.com/v3/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'App-Id': process.env.INFERMEDICA_APP_ID || '',
        'App-Key': process.env.INFERMEDICA_APP_KEY || '',
      },
      body: JSON.stringify({ text: symptoms }),
    });

    if (!parseResponse.ok) {
      throw new Error('Failed to parse symptoms');
    }

    const parseData = await parseResponse.json();

    // Get diagnosis
    const diagnosisResponse = await fetch(
      'https://api.infermedica.com/v3/diagnosis',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'App-Id': process.env.INFERMEDICA_APP_ID || '',
          'App-Key': process.env.INFERMEDICA_APP_KEY || '',
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
      throw new Error('Failed to get diagnosis');
    }

    const diagnosisData = await diagnosisResponse.json();
    return NextResponse.json(diagnosisData);
  } catch (error) {
    console.error('Infermedica API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze symptoms' },
      { status: 500 }
    );
  }
}
