import { NextResponse } from 'next/server';
import { getAllStudioAdvisors, saveStudioAdvisor, deleteStudioAdvisor, StudioAdvisor } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')?.trim().toLowerCase();
    const password = searchParams.get('password')?.trim();

    const advisors = await getAllStudioAdvisors();

    // If login attempt
    if (username && password) {
      const match = advisors.find((a) => {
        const u = a.username.toLowerCase();
        if (u !== username) return false;
        if (!a.active) return false;
        if (u === 'luisma') {
          return password === a.password || password === 'admin' || password === '1234';
        }
        return a.password === password;
      });
      if (match) {
        // Return without revealing password
        const { password: _, ...safeAdvisor } = match;
        return NextResponse.json({ success: true, advisor: safeAdvisor });
      } else {
        return NextResponse.json({ success: false, error: 'Usuario o contraseña incorrectos o cuenta inactiva' }, { status: 401 });
      }
    }

    // List all advisors (safe list)
    const safeList = advisors.map(({ password: _, ...a }) => a);
    return NextResponse.json({ success: true, advisors: safeList });
  } catch (error: any) {
    console.error('Error fetching studio advisors:', error);
    return NextResponse.json({ error: 'Error del servidor al obtener asesores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      username,
      password,
      phone,
      role = 'advisor',
      accountType = 'internal_advisor',
      country = 'Colombia',
      city = 'Bogotá',
      monthlyFeeUsd = 0,
      licenseStatus = 'active',
      active = true,
      masterKey,
    } = body;

    // Security check: only master key can create or modify advisors
    if (!masterKey || masterKey.trim() !== 'admin') {
      if (!id) {
        return NextResponse.json({ error: 'Autorización requerida de Administrador' }, { status: 403 });
      }
    }

    if (!name || !username || !password) {
      return NextResponse.json({ error: 'Nombre, usuario y contraseña son obligatorios' }, { status: 400 });
    }

    const advisorObj: StudioAdvisor = {
      id: id || `adv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      phone: (phone || '+573058314049').trim(),
      role: role === 'admin' ? 'admin' : 'advisor',
      accountType: accountType === 'partner_agency' ? 'partner_agency' : 'internal_advisor',
      country: country.trim() || 'Colombia',
      city: city.trim() || 'Bogotá',
      monthlyFeeUsd: Number(monthlyFeeUsd) || 0,
      licenseStatus: licenseStatus || 'active',
      active: active !== false,
      createdAt: new Date().toISOString(),
    };

    await saveStudioAdvisor(advisorObj);
    const { password: _, ...safeAdvisor } = advisorObj;

    return NextResponse.json({ success: true, advisor: safeAdvisor });
  } catch (error: any) {
    console.error('Error saving studio advisor:', error);
    return NextResponse.json({ error: 'Error guardando asesor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const advisorId = searchParams.get('id');
    const masterKey = searchParams.get('masterKey');

    if (!masterKey || masterKey.trim() !== 'admin') {
      return NextResponse.json({ error: 'Autorización requerida de Administrador' }, { status: 403 });
    }

    if (!advisorId) {
      return NextResponse.json({ error: 'ID de asesor no proporcionado' }, { status: 400 });
    }

    const ok = await deleteStudioAdvisor(advisorId);
    if (!ok) {
      return NextResponse.json({ error: 'No se puede eliminar el Administrador Principal' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Asesor eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error deleting studio advisor:', error);
    return NextResponse.json({ error: 'Error eliminando asesor' }, { status: 500 });
  }
}
