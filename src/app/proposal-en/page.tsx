'use client';

import React from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Flame,
  Globe,
  HeartPulse,
  HelpCircle,
  MapPin,
  MessageCircle,
  Printer,
  QrCode,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
  Wrench,
  Zap,
} from 'lucide-react';

export default function ProposalEnPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#070A12] text-white selection:bg-indigo-500 selection:text-white pb-16">
      
      {/* Global Print Styles - Preserves Full Dark Mode Visual Identity with Zero White Margins */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 0 !important;
            size: A4 portrait;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #070A12 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .proposal-page {
            padding: 14mm 16mm !important;
            box-sizing: border-box !important;
            min-height: 100vh !important;
          }
        }
      ` }} />

      {/* Action Bar (Only visible on screen, hidden when printing to PDF) */}
      <div className="print:hidden sticky top-0 z-50 bg-[#0D1424]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm">
              P
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wider">PRESTIGIA GLOBAL</span>
              <span className="text-[10px] ml-2 text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-medium">
                Official B2B Commercial Proposal (USD)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF / Print</span>
            </button>
            <a
              href="/"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Back to Hub
            </a>
          </div>
        </div>
      </div>

      {/* Main Printable Document */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 print:p-0 print:m-0 print:space-y-8 print:max-w-none">
        
        {/* ========================================================================= */}
        {/* PAGE 1: COVER & EXECUTIVE DIAGNOSIS */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page print:page-break-after">
          
          {/* Header */}
          <header className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 flex items-center justify-center font-black text-white text-xl shadow-xl shadow-purple-600/25 print:text-white">
                P
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  PRESTIGIA <span className="text-purple-400">PRO GLOBAL</span>
                </h1>
                <p className="text-xs text-slate-400 font-semibold tracking-wide">
                  LOCAL BUSINESS INFRASTRUCTURE, REPUTATION DEFENSE & HIGH-CONVERSION COMMERCE
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                30-DAY FOUNDING PILOT
              </span>
            </div>
          </header>

          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>MARKET DIAGNOSIS: THE SILENT LEAK OF LOCAL BUYERS & CLIENTS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              <span className="text-purple-400">88% of local customers</span> check Google Maps reviews before visiting a business or booking a service.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              Whether you run a <strong>restaurant, medical spa, dental office, retail store, or an in-home service (carpet/upholstery cleaning, plumbing, locksmithing, HVAC or mobile detailing)</strong>: receiving <strong>a single 1-star public Google review</strong> diverts up to <strong>70% of potential new clients</strong> straight to your local competitors.
            </p>
          </div>

          {/* DUAL MARKET ARCHITECTURE */}
          <div className="space-y-3">
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Specialized Infrastructure Built for Both Commercial Models:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0D1424] border border-indigo-500/30 space-y-2 text-left">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Store className="w-4 h-4" />
                  <span>For Brick-and-Mortar Storefronts</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Restaurants, bistros, spas, barbershops, clinics & boutiques. Dynamic Smart QR displays placed on dining tables, reception counters, or checkout registers to capture happy reviews at payment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0D1424] border border-cyan-500/30 space-y-2 text-left">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Truck className="w-4 h-4" />
                  <span>For In-Home Services & Mobile Pros</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Carpet/upholstery cleaners, plumbers, locksmiths, electricians & mobile mechanics. Digital Smart QR on your smartphone screen to collect 5★ ratings at the client's home upon job completion.
                </p>
              </div>
            </div>
          </div>

          {/* Psychological Pain Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-black text-lg">
                ❌
              </div>
              <h3 className="font-bold text-white text-base">
                The Public Grievance Bias
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unhappy clients actively go online to vent on Google Maps, damaging years of hard work. In contrast, 90% of satisfied customers never leave a review simply out of laziness or search friction.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
                ⚡
              </div>
              <h3 className="font-bold text-white text-base">
                100% Digital Delivery Under 24 Hours
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                No delayed postal shipments. You receive an audited Google Maps profile, a blazing-fast official website, and an <strong>HD Smart QR Digital Suite</strong> ready for your mobile screen or local printing.
              </p>
            </div>
          </div>

          {/* The Core Promise */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0D1424] to-indigo-950/60 border border-purple-500/30 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>THE PRESTIGIA GLOBAL SOLUTION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Reputation Armor + Predictable Local Customers on Autopilot
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We multiply your 5-star Google Maps reviews, algorithmically block 100% of public negative complaints, and turn one-time buyers into loyal repeat clients via your brand-new official mobile web hub.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PAGE 2: THE SMART BIFURCATION CIRCUIT (3 STEPS) */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page print:page-break-after">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Point-of-Sale Conversion Engineering
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              The Intelligent Bifurcation Circuit
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Everything occurs in under 10 seconds directly on the customer's phone without requiring any app downloads or friction.
            </p>
          </div>

          {/* 3-Step Visual Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-black text-sm flex items-center justify-center">
                    1
                  </span>
                  <QrCode className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">
                  Smart QR Tap / Scan
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The client scans the QR code from your in-store acrylic display or directly from your phone screen. The branded interface opens in <strong>less than 1.0 second</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 text-[11px] text-slate-400 font-medium">
                ⚡ Zero friction: no app downloads required.
              </div>
            </div>

            {/* Step 2: Positive Routing */}
            <div className="p-5 rounded-2xl bg-[#0D1424] border border-emerald-500/40 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center">
                    2A
                  </span>
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>
                <h4 className="font-extrabold text-emerald-400 text-base">
                  Satisfied Client (4 or 5★)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instant redirection to Google Maps. <strong>Opens directly the review modal with 5 stars pre-selected</strong> so the customer only needs to tap "Post".
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 text-[11px] text-emerald-300 font-semibold">
                📈 Guaranteed climb to the Top 3 local rankings.
              </div>
            </div>

            {/* Step 3: Negative Routing */}
            <div className="p-5 rounded-2xl bg-[#0D1424] border border-red-500/40 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 font-black text-sm flex items-center justify-center">
                    2B
                  </span>
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                </div>
                <h4 className="font-extrabold text-red-400 text-base">
                  Unhappy Client (1 to 3★)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Google Maps is 100% blocked.</strong> A private resolution form captures Name, Phone & Incident details routed directly to ownership.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-950/40 text-[11px] text-red-300 font-semibold">
                🛡️ Zero public damage. Real-time alert in &lt;10s.
              </div>
            </div>

          </div>

          {/* The Post-Review Powerhouse */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Post-Review Commercial Hub</span>
              </div>
              <h4 className="font-black text-white text-base sm:text-lg">
                Official Lightning-Fast Mobile Website Included
              </h4>
              <p className="text-xs text-slate-300">
                Loads in <strong className="text-white">&lt;1.2 seconds</strong> with your service/product catalog, direct WhatsApp / call button, and seamless links to Instagram, TikTok, and Facebook.
              </p>
            </div>
            <div className="shrink-0 px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-extrabold">
              Reviews + Followers + Sales
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PAGE 3: PLANS COMPARISON (USD) & FOUNDING PILOT OFFER */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Transparent Investment & High Return On Investment
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Global Subscription Plans (USD)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Golden Rule: The setup fee covers the <strong className="text-white">permanent ownership</strong> of your Website and Google Maps profile. The monthly fee covers the <strong className="text-white">live cloud reputation radar, hosting and continuous support</strong>.
            </p>
          </div>

          {/* Plans Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-800 text-xs sm:text-sm rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-[#0D1424] text-slate-300 border-b border-slate-800">
                  <th className="p-3.5 font-bold">Feature / Module</th>
                  <th className="p-3.5 font-bold text-center">Global Basic Plan</th>
                  <th className="p-3.5 font-bold text-center bg-purple-950/40 text-purple-300 border-x border-purple-500/30">
                    Global Pro Plan (Recommended)
                  </th>
                  <th className="p-3.5 font-bold text-center">Setup Only</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#0A0F1D] text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Smart QR Code Suite</td>
                  <td className="p-3 text-center">HD Digital Suite in Owner Portal</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    HD Mobile Suite + Vector Print Files for Displays
                  </td>
                  <td className="p-3 text-center text-slate-500">Static QR without radar</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Google Maps Optimization</td>
                  <td className="p-3 text-center">Verified setup & audit</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    Surgical ranking optimization for Top 3
                  </td>
                  <td className="p-3 text-center">Standard setup</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Anti-Complaint Shield</td>
                  <td className="p-3 text-center">1 to 3★ routed to private inbox</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    Priority 1 to 3★ + instant WhatsApp/SMS alert (&lt;10s)
                  </td>
                  <td className="p-3 text-center text-red-400">Disabled (open to Google)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">AI Review Reply Assistant</td>
                  <td className="p-3 text-center text-slate-500">Standard templates</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    AI crafts tailored responses in 5 seconds
                  </td>
                  <td className="p-3 text-center text-slate-500">100% manual</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Commercial Mobile Website</td>
                  <td className="p-3 text-center">Continuous hosting & catalog</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    Live Google Reviews Wall + Full Social Hub
                  </td>
                  <td className="p-3 text-center">Fixed ownership (no support)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Content & Pricing Updates</td>
                  <td className="p-3 text-center">Up to 2/month (prices & info)</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    1 weekly update (new work photos, promos)
                  </td>
                  <td className="p-3 text-center text-slate-500">Not included</td>
                </tr>
                <tr className="border-t-2 border-purple-500/50 bg-[#0D1424] font-extrabold text-sm">
                  <td className="p-4 text-white">
                    Monthly Subscription Fee
                    <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                      (Starts Day 31 • Month 1 is $0 USD)
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-xs text-slate-500 line-through font-semibold">$40 USD</div>
                    <div className="text-purple-300 font-black text-base">$19 <span className="text-xs font-normal">USD/mo</span></div>
                    <div className="text-[10px] text-emerald-400 font-bold tracking-tight mt-0.5">50% OFF ($0.63/day)</div>
                  </td>
                  <td className="p-4 text-center bg-purple-950/30 border-x border-purple-500/40">
                    <div className="text-xs text-slate-500 line-through font-semibold">$60 USD</div>
                    <div className="text-emerald-400 font-black text-lg">$29 <span className="text-xs font-normal">USD/mo</span></div>
                    <div className="text-[10px] text-amber-300 font-bold tracking-tight mt-0.5">50% OFF ($0.96/day)</div>
                  </td>
                  <td className="p-4 text-center text-slate-400">
                    <div className="font-bold text-sm">$0 USD/mo</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">No recurring support</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* The Infallible Pilot Offer Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-purple-900/80 via-[#0D1424] to-indigo-950/70 border-2 border-purple-500 shadow-2xl space-y-6 text-left">
            
            {/* Traditional Agency Contrast Banner */}
            <div className="p-3.5 rounded-2xl bg-purple-950/70 border border-purple-400/30 flex items-center gap-3 text-xs text-slate-200">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 font-black text-sm shrink-0">
                💡
              </div>
              <div>
                <strong className="text-white">Real Market Contrast:</strong> Traditional web agencies charge between <strong className="text-amber-300 font-bold">$300 and $800 USD</strong> solely for a basic website (without an optimized Google Maps presence, Smart QR, anti-complaint radar, or AI review management). We deliver the entire conversion ecosystem for a fraction of that cost.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/30 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  🔥 50% LAUNCH DISCOUNT (LIMITED TO FIRST 5 BUSINESSES PER CITY/NICHE)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                  30-Day Founding Pilot Program
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 line-through font-semibold">$199 USD</div>
                <div className="text-2xl sm:text-4xl font-black text-emerald-400">
                  $99 USD
                </div>
                <span className="text-[10px] text-slate-300 font-medium">One-Time Setup Fee (50% OFF)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Everything delivered within 24 hours:</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>High-Resolution Digital Smart QR Suite</strong> downloadable in your portal (ready for mobile display or local printing).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Official Google Maps Profile Audited & Optimized</strong> to rank in your local area's Top 3 search pack.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Commercial Mobile Website (&lt;1.2s speed)</strong> with service catalog & WhatsApp/Call button (permanent ownership).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>30 Days 100% Free Pro Platform ($0 USD)</strong> with automated complaint radar and real-time owner alerts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Lifetime Grandfathered 50% Rate:</strong> After the trial, maintain your discounted rate ($19 Basic or $29 Pro) forever.</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Lifetime Top Placement on Prestigia Global Directory:</strong> Featured as a "Verified Trusted Business" in your city's official Yellow Pages 2.0.</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Lifetime Access to the Cross-Selling Network:</strong> Direct partner recommendations and customer exchange with allied local businesses at no extra cost.</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><em>VIP Hardware Upgrade (Optional):</em> Luxury acrylic counter plaque or PVC NFC card shipped to your door for +$25 USD.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>The Win-Win Agreement:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You only pay the deeply discounted setup fee ($99 USD). In exchange, all we ask is:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Display the QR in your store or show it on your phone after completing every service.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Post 2 weekly social media stories highlighting your new official website and services.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Record a quick 30-second video testimonial on Day 28 with your results.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-slate-700 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <strong className="text-white">Zero strings attached on Day 30:</strong> You own your website and Google Maps profile permanently from Day 1. If you decide not to continue with the software radar, there is never any penalty.
              </div>
              <button
                onClick={handlePrint}
                className="print:hidden shrink-0 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition shadow-lg shadow-purple-500/20"
              >
                Print Official Proposal
              </button>
            </div>
          </div>

          {/* Objection Handling Cheat Sheet */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest text-center">
              Frequently Asked Questions from International Business Owners
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"How do I receive alerts in the US, Canada, or UK?"</strong>
                <p className="text-slate-300">
                  Prestigia Pro is natively integrated with international country calling codes (+1 US/CA, +44 UK, +52 MX, etc.). Urgent customer feedback arrives instantly to your standard WhatsApp or mobile number regardless of where you operate.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"How do I print my Smart QR codes locally?"</strong>
                <p className="text-slate-300">
                  Inside your Owner Portal, you can download vector-quality print files (PDF & PNG). You can easily take them to any local print shop (FedEx Office, Staples, local copy center) to print them as stickers, window decals, or table stands.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"What happens if I pause my monthly subscription?"</strong>
                <p className="text-slate-300">
                  Your Google Maps profile and website remain online because you own them permanently. Pausing the monthly plan simply pauses the live anti-complaint radar until you choose to reactivate it.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"How fast is turnaround and delivery?"</strong>
                <p className="text-slate-300">
                  Full deployment of your mobile website, Google Maps optimization, and activation of your Digital Smart QR Suite is delivered within <strong>24 to 48 business hours</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Call to Action */}
          <footer className="text-center pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Prestigia Global • Commercial Infrastructure & Local Reputation Defense • All rights reserved.
            </p>
          </footer>

        </section>

      </main>
    </div>
  );
}
