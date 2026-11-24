import { NextRequest, NextResponse } from 'next/server';
import { getAllCommercialLeads, deleteCommercialLead, deleteCommercialLeadsByFriend } from '@/lib/db';

function normalizePhoneKey(phone?: string): string {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

export async function GET(request: NextRequest) {
  try {
    const allLeads = await getAllCommercialLeads();
    const rawMasterclassLeads = allLeads.filter((l) =>
      (l.category && l.category.toLowerCase().includes('masterclass')) ||
      (l.primaryGoal && l.primaryGoal.toLowerCase().includes('masterclass'))
    );

    // Deduplicate by normalized phone (last 10 digits) or normalized email, keeping the earliest registration
    const sortedChrono = [...rawMasterclassLeads].sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );
    const seenPhones = new Set<string>();
    const seenEmails = new Set<string>();
    const masterclassLeads: typeof rawMasterclassLeads = [];

    for (const lead of sortedChrono) {
      const phoneKey = normalizePhoneKey(lead.phone);
      const emailKey = (lead.email || '').trim().toLowerCase();

      const isDupPhone = phoneKey.length >= 7 && seenPhones.has(phoneKey);
      const isDupEmail = emailKey.length > 0 && seenEmails.has(emailKey);
      if (isDupPhone || isDupEmail) continue;

      if (phoneKey.length >= 7) seenPhones.add(phoneKey);
      if (emailKey) seenEmails.add(emailKey);
      masterclassLeads.push(lead);
    }

    // Present newest first in UI
    masterclassLeads.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    const referralMap: Record<string, { code: string; count: number; leads: any[] }> = {};

    masterclassLeads.forEach((lead) => {
      let ref = 'directo';
      if (lead.notes) {
        try {
          const parsed = JSON.parse(lead.notes);
          if (parsed.referredBy) {
            ref = String(parsed.referredBy).toLowerCase().trim();
          }
        } catch {
          const m = lead.notes.match(/referredBy["']?:\s*["']?([a-zA-Z0-9_-]+)/);
          if (m && m[1]) ref = m[1].toLowerCase().trim();
        }
      } else if (lead.primaryGoal && lead.primaryGoal.includes('Ref:')) {
        const parts = lead.primaryGoal.split('Ref:');
        if (parts[1]) ref = parts[1].trim().toLowerCase();
      }

      if (!referralMap[ref]) {
        referralMap[ref] = { code: ref, count: 0, leads: [] };
      }
      referralMap[ref].count += 1;
      referralMap[ref].leads.push({
        id: lead.id,
        createdAt: lead.createdAt,
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        city: lead.city,
        country: lead.country,
        role: lead.businessName,
        status: lead.status,
        device: lead.device,
        referredBy: ref,
      });
    });

    const referralSummary = Object.values(referralMap).sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      totalLeads: masterclassLeads.length,
      referralSummary,
      allLeads: masterclassLeads,
    });
  } catch (error: any) {
    console.error('Error fetching masterclass leads:', error);
    return NextResponse.json({ error: 'Error del servidor al obtener referidos' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, friendCode } = body;

    if (leadId) {
      await deleteCommercialLead(leadId);
      return NextResponse.json({ success: true, message: 'Invitado eliminado con éxito' });
    }

    if (friendCode) {
      const count = await deleteCommercialLeadsByFriend(friendCode);
      return NextResponse.json({ success: true, message: `Aliado y sus ${count} referidos eliminados con éxito` });
    }

    return NextResponse.json({ error: 'Se requiere leadId o friendCode' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Error del servidor al eliminar' }, { status: 500 });
  }
}
