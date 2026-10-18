import { NextResponse } from 'next/server';
import { getBusinessBranding, saveBusinessBranding } from '@/lib/db';
import { BrandIdentity } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'clinica-san-rafael';

    const branding = await getBusinessBranding(businessId);
    return NextResponse.json({
      success: true,
      branding: branding || {
        logoUrl: '',
        primaryColor: '#6366F1',
        accentColor: '#4F46E5',
      },
    });
  } catch (error) {
    console.error('Error fetching branding:', error);
    return NextResponse.json({ error: 'Error al consultar branding' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, branding } = body;

    if (!businessId || !branding) {
      return NextResponse.json(
        { error: 'businessId y branding son requeridos' },
        { status: 400 }
      );
    }

    const updated = await saveBusinessBranding(businessId, branding as BrandIdentity);
    return NextResponse.json({ success: true, branding: updated });
  } catch (error) {
    console.error('Error saving branding:', error);
    return NextResponse.json({ error: 'Error al guardar branding' }, { status: 500 });
  }
}
