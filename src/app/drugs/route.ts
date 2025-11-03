import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const drugName = searchParams.get('name');

  if (!drugName) {
    return NextResponse.json(
      { error: 'Drug name is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(drugName)}"&limit=1`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from FDA API');
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      
      return NextResponse.json({
        brandName: result.openfda?.brand_name?.[0] || 'N/A',
        genericName: result.openfda?.generic_name?.[0] || 'N/A',
        purpose: result.purpose?.[0] || 'N/A',
        warnings: result.warnings?.[0] || 'No warnings available',
        dosage: result.dosage_and_administration?.[0] || 'Consult physician',
        interactions: result.drug_interactions?.[0] || 'No interactions listed',
        sideEffects: result.adverse_reactions?.[0] || 'No side effects listed',
      });
    }

    return NextResponse.json(
      { error: 'Drug not found in FDA database' },
      { status: 404 }
    );
  } catch (error) {
    console.error('FDA API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drug information. Please try again later.' },
      { status: 500 }
    );
  }
}