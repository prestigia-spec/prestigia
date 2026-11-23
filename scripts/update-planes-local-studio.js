const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'masterclass-planes', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Document title
content = content.replace(
  "document.title = lang === 'en'\n        ? 'Prestigia | B2B Partner Plans & Credit Economics 2026'\n        : 'Prestigia | Planes Oficiales de Partners & Economía de Créditos 2026';",
  "document.title = lang === 'en'\n        ? 'Local Studio | B2B Partner Plans & Credit Economics 2026'\n        : 'Local Studio | Planes Oficiales de Partners & Economía de Créditos 2026';"
);

// 2. Floating action bar header
content = content.replace(
  `<Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <PrestigiaIcon className="w-8 h-8 drop-shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wider text-white">PRESTIGIA</span>`,
  `<Link href="/local-studio" className="flex items-center gap-2 group cursor-pointer">
              <PrestigiaIcon className="w-8 h-8 drop-shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wider text-white">LOCAL STUDIO</span>`
);

// 3. Header WhatsApp link
content = content.replace(
  `href={isEn ? "https://wa.me/573058314049?text=Hello%20Prestigia,%20I%20want%20to%20activate%20my%20Local%20Studio%20Partner%20Plan" : "https://wa.me/573058314049?text=Hola%20Prestigia,%20deseo%20activar%20mi%20Plan%20de%20Partner%20en%20Local%20Studio"}`,
  `href={isEn ? "https://wa.me/573058314049?text=Hello%20Luisma,%20I%20want%20to%20activate%20my%20Local%20Studio%20Partner%20Plan" : "https://wa.me/573058314049?text=Hola%20Luisma,%20deseo%20activar%20mi%20Plan%20de%20Partner%20en%20Local%20Studio"}`
);

// 4. Hero section cover
content = content.replace(
  `<div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">PRESTIGIA</h1>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    5★ SUITE
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium">
                  {isEn
                    ? 'Local Studio • B2B Commercial Partner & Agency Credit Economics'
                    : 'Local Studio • Programa Oficial de Partners & Economía de Créditos B2B'}
                </p>`,
  `<div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">LOCAL STUDIO</h1>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    {isEn ? 'AI Agency Suite' : 'Suite de Agencia IA'}
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium">
                  {isEn
                    ? 'Official Partner Program & B2B Credit Economics 2026'
                    : 'Programa Oficial de Partners, Asesores & Economía de Créditos 2026'}
                </p>`
);

// 5. Value prop text
content = content.replace(
  `{isEn\n                ? 'Prestigia Local Studio equips independent advisors`,
  `{isEn\n                ? 'Local Studio equips independent advisors`
);
content = content.replace(
  `: 'Prestigia Local Studio equipa a consultores independientes`,
  `: 'Local Studio equipa a consultores independientes`
);

// 6. Section 2 intro
content = content.replace(
  `{isEn\n              ? 'Each tab in Prestigia Local Studio automates`,
  `{isEn\n              ? 'Each tab in Local Studio automates`
);
content = content.replace(
  `: 'Cada pestaña de Prestigia Local Studio automatiza`,
  `: 'Cada pestaña de Local Studio automatiza`
);

// 7. Market cost reality
content = content.replace(
  `<span>{isEn ? 'Market Cost Reality: Traditional Agency Software vs. Prestigia Local Studio' : 'Realidad de Costos en el Mercado: Software de Agencia Tradicional vs. Prestigia Local Studio'}</span>`,
  `<span>{isEn ? 'Market Cost Reality: Traditional Agency Software vs. Local Studio' : 'Realidad de Costos en el Mercado: Software de Agencia Tradicional vs. Local Studio'}</span>`
);
content = content.replace(
  `Prestigia unites everything into one single operational engine with no mandatory monthly fees:`,
  `Local Studio unites everything into one single operational engine with no mandatory monthly fees:`
);
content = content.replace(
  `Prestigia une todo el flujo en una sola plataforma sin mensualidades forzadas:`,
  `Local Studio une todo el flujo en una sola plataforma sin mensualidades forzadas:`
);
content = content.replace(
  `{isEn ? '3. The Prestigia Local Studio Advantage' : '3. La Ventaja Prestigia Local Studio'}`,
  `{isEn ? '3. The Local Studio Advantage' : '3. La Ventaja Local Studio'}`
);

// 8. Commissions label
content = content.replace(
  /<span className="text-slate-400">\{isEn \? 'Prestigia Recurring Commission:' : 'Comisión Prestigia Recurrente:'\}<\/span>/g,
  `<span className="text-slate-400">{isEn ? 'Monthly Recurring Commission:' : 'Comisión Mensual Recurrente:'}</span>`
);

// 9. Double monetization title
content = content.replace(
  `<span>{isEn ? '3. The Double Monetization Model: Upfront Setup + Lifetime Recurring Prestigia MRR' : '3. El Modelo de Doble Monetización: Setup Inmediato + Renta Recurrente Mensual Prestigia'}</span>`,
  `<span>{isEn ? '3. The Double Monetization Model: Upfront Setup + Lifetime Monthly Recurring MRR' : '3. El Modelo de Doble Monetización: Setup Inmediato + Renta Recurrente Mensual de Software'}</span>`
);

// 10. Footer section
content = content.replace(
  `<span>{isEn ? 'Prestigia Technologies Enterprise • Authorized Partner Network' : 'Prestigia Technologies Enterprise • Red Autorizada de Partners B2B'}</span>`,
  `<span>{isEn ? 'Local Studio Enterprise • Authorized Partner Network' : 'Local Studio Enterprise • Red Autorizada de Partners B2B'}</span>`
);
content = content.replace(
  `Prestigia Local Studio is developed, hosted, and maintained under enterprise SLA standards by Technological Solutions Software.`,
  `Local Studio is developed, hosted, and maintained under enterprise SLA standards by Technological Solutions Software.`
);
content = content.replace(
  `Prestigia Local Studio es desarrollado, alojado y respaldado bajo estándares corporativos por Technological Solutions Software.`,
  `Local Studio es desarrollado, alojado y respaldado bajo estándares corporativos por Technological Solutions Software.`
);
content = content.replace(
  `Prestigia &copy; 2026 &bull; {isEn ? 'All rights reserved.' : 'Todos los derechos reservados.'}`,
  `Local Studio &copy; 2026 &bull; {isEn ? 'All rights reserved.' : 'Todos los derechos reservados.'}`
);
content = content.replace(
  `href={isEn ? "https://wa.me/573058314049?text=Hello%20Prestigia,%20I%20want%20to%20activate%20my%20Local%20Studio%20Partner%20Plan" : "https://wa.me/573058314049?text=Hola%20Prestigia,%20deseo%20activar%20mi%20Plan%20de%20Partner%20en%20Local%20Studio"}`,
  `href={isEn ? "https://wa.me/573058314049?text=Hello%20Luisma,%20I%20want%20to%20activate%20my%20Local%20Studio%20Partner%20Plan" : "https://wa.me/573058314049?text=Hola%20Luisma,%20deseo%20activar%20mi%20Plan%20de%20Partner%20en%20Local%20Studio"}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated masterclass-planes to speak 100% of Local Studio!');
