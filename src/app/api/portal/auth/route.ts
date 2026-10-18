import { NextResponse } from 'next/server';
import { getAllBusinesses } from '@/lib/db';
import {
  checkLoginSecurity,
  recordFailedLogin,
  resetLoginAttempts,
  unlockAccountBySuperAdmin,
} from '@/lib/security';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, action } = body;

    // Acción exclusiva para el SuperAdmin: Desbloquear cuenta
    if (action === 'unlock_account' && identifier) {
      unlockAccountBySuperAdmin(identifier);
      return NextResponse.json({ success: true, message: 'Cuenta desbloqueada exitosamente' });
    }

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Por favor ingresa tu identificador y contraseña' },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. BLINDAJE: Verificar si la cuenta se encuentra bloqueada por 5 intentos fallidos
    const securityStatus = checkLoginSecurity(cleanId);
    if (securityStatus.isLocked) {
      return NextResponse.json(
        {
          error:
            '🚨 ACCESO BLOQUEADO POR SEGURIDAD: Se superaron los 5 intentos fallidos consecutivos. Tu cuenta ha sido congelada para proteger tu información. Para desbloquear el acceso, contacta a la Administración Central de Prestigia.',
          isLocked: true,
        },
        { status: 423 } // 423 Locked
      );
    }

    const businesses = await getAllBusinesses();

    // 2. Check if identifier belongs to a BRAND OWNER (e.g. 'clinica-san-rafael' or 'admin')
    const ownerBusiness = businesses.find(
      (b) => b.id.toLowerCase() === cleanId ||
             b.id.replace(/-/g, '').toLowerCase() === cleanId.replace(/-/g, '') ||
             (cleanId === 'admin' || cleanId === 'demo')
    );

    if (ownerBusiness) {
      const validOwnerPass = ownerBusiness.password || 'admin';
      if (cleanPass === validOwnerPass) {
        // Contraseña correcta: Reseteamos los intentos fallidos
        resetLoginAttempts(cleanId);
        return NextResponse.json({
          success: true,
          role: 'owner',
          business: ownerBusiness,
          branches: ownerBusiness.branches || [],
        });
      } else {
        // Contraseña incorrecta: Registramos el fallo
        const failedRecord = recordFailedLogin(cleanId);
        if (failedRecord.isLocked) {
          return NextResponse.json(
            {
              error:
                '🚨 ACCESO BLOQUEADO: Has ingresado 5 veces la contraseña incorrecta. La cuenta ha sido bloqueada. Contacta al soporte central de Prestigia para desbloquearla.',
              isLocked: true,
            },
            { status: 423 }
          );
        }
        return NextResponse.json(
          {
            error: `Contraseña incorrecta. Te quedan ${failedRecord.remainingAttempts} intento(s) antes del bloqueo de seguridad.`,
            remainingAttempts: failedRecord.remainingAttempts,
          },
          { status: 401 }
        );
      }
    }

    // 3. Check if identifier belongs to a BRANCH or an individual BRANCH MANAGER
    for (const business of businesses) {
      if (business.branches && business.branches.length > 0) {
        for (const branch of business.branches) {
          // 3.1 Check multi-managers in branch.managers (e.g. 'andres', 'mateo', 'carolina', 'laura')
          if (branch.managers && branch.managers.length > 0) {
            const specificMgr = branch.managers.find((m) => {
              if (m.active === false) return false;
              const matchUser = m.username && m.username.toLowerCase() === cleanId;
              const matchPhone = m.phone && m.phone.replace(/\D/g, '') === cleanId;
              const matchId = m.id && m.id.toLowerCase() === cleanId;
              return Boolean(matchUser || matchPhone || matchId);
            });

            if (specificMgr) {
              if (business.plan === 'basic') {
                const isEn = (body.lang || '').toLowerCase() === 'en';
                return NextResponse.json(
                  {
                    error: isEn
                      ? '⚠️ Point of Sale / Branch screens are available starting from the Pro Plan. The Basic Plan only includes the single central Owner screen. Upgrade to Pro to enable branch manager screens.'
                      : '⚠️ El acceso para Encargados de Sede está disponible a partir del Plan Pro. En el Plan Básico solo está habilitada la pantalla central del Dueño. Actualiza a Plan Pro o Élite para habilitar accesos de encargados.',
                    upsell: true,
                    upsellTier: 'pro',
                  },
                  { status: 403 }
                );
              }

              const validMgrPass = specificMgr.password || branch.managerPassword || '1234';
              if (cleanPass === validMgrPass) {
                resetLoginAttempts(cleanId);
                return NextResponse.json({
                  success: true,
                  role: 'branch_manager',
                  business: {
                    id: business.id,
                    name: business.name,
                    plan: business.plan,
                    status: business.status,
                    category: business.category,
                    ownerName: business.ownerName,
                    ownerPhone: business.ownerPhone,
                  },
                  activeBranch: branch,
                  activeManager: specificMgr,
                  branches: [branch],
                });
              } else {
                const failedRecord = recordFailedLogin(cleanId);
                if (failedRecord.isLocked) {
                  return NextResponse.json(
                    {
                      error: '🚨 ACCESO DE ENCARGADO BLOQUEADO: Se superaron los 5 intentos fallidos.',
                      isLocked: true,
                    },
                    { status: 423 }
                  );
                }
                return NextResponse.json(
                  {
                    error: `PIN o contraseña de encargado incorrecto. Te quedan ${failedRecord.remainingAttempts} intento(s) antes del bloqueo.`,
                    remainingAttempts: failedRecord.remainingAttempts,
                  },
                  { status: 401 }
                );
              }
            }
          }

          // 3.2 Legacy branch check (by branch ID, primary managerUsername, primary managerPhone)
          const isLegacyMatch =
            branch.id.toLowerCase() === cleanId ||
            (branch.managerUsername && branch.managerUsername.toLowerCase() === cleanId) ||
            (branch.managerPhone && branch.managerPhone.replace(/\D/g, '') === cleanId);

          if (isLegacyMatch) {
            if (business.plan === 'basic') {
              const isEn = (body.lang || '').toLowerCase() === 'en';
              return NextResponse.json(
                {
                  error: isEn
                    ? '⚠️ Point of Sale / Branch screens are available starting from the Pro Plan. The Basic Plan only includes the single central Owner screen. Upgrade to Pro to enable up to 2 active screens at your location.'
                    : '⚠️ El acceso en pantallas de Local/Caja está disponible a partir del Plan Pro. En el Plan Básico solo está habilitada la pantalla central del Dueño. Actualiza tu cuenta a Plan Pro para habilitar hasta 2 pantallas en el punto de venta.',
                  upsell: true,
                  upsellTier: 'pro',
                },
                { status: 403 }
              );
            }

            const validBranchPass = branch.managerPassword || '1234';
            if (cleanPass === validBranchPass) {
              resetLoginAttempts(cleanId);
              const defaultMgr = branch.managers && branch.managers.length > 0 ? branch.managers[0] : (branch.managerName ? {
                id: `mgr-${branch.id}`,
                name: branch.managerName,
                role: branch.managerRole || 'Encargado de Sede',
                phone: branch.managerPhone,
                active: true,
              } : undefined);

              return NextResponse.json({
                success: true,
                role: 'branch_manager',
                business: {
                  id: business.id,
                  name: business.name,
                  plan: business.plan,
                  status: business.status,
                  category: business.category,
                  ownerName: business.ownerName,
                  ownerPhone: business.ownerPhone,
                },
                activeBranch: branch,
                activeManager: defaultMgr,
                branches: [branch],
              });
            } else {
              const failedRecord = recordFailedLogin(cleanId);
              if (failedRecord.isLocked) {
                return NextResponse.json(
                  {
                    error: '🚨 ACCESO DE SEDE BLOQUEADO: Se superaron los 5 intentos fallidos. La sucursal ha sido bloqueada por seguridad.',
                    isLocked: true,
                  },
                  { status: 423 }
                );
              }
              return NextResponse.json(
                {
                  error: `PIN o contraseña de sede incorrecto. Te quedan ${failedRecord.remainingAttempts} intento(s) antes del bloqueo.`,
                  remainingAttempts: failedRecord.remainingAttempts,
                },
                { status: 401 }
              );
            }
          }
        }
      }
    }

    return NextResponse.json(
      { error: 'No se encontró ninguna cuenta con ese identificador' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in portal auth:', error);
    return NextResponse.json(
      { error: 'Error interno en el servidor de autenticación' },
      { status: 500 }
    );
  }
}
