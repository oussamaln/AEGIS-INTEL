import React from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, Shield, Globe, FileSearch, CheckCircle2, ArrowRight } from "lucide-react";

export default function Services() {
  return (
    <PublicLayout>
      <div className="py-16 container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <span>OPERATIONAL CAPABILITIES</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Professional Investigation Services</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Aegis Intelligence provides rigorous open-source intelligence (OSINT) and social media intelligence (SOCMINT) services for legal, corporate, and private clients worldwide.
          </p>
        </div>

        <div className="space-y-12">
          {/* Service 1 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Social Media Intelligence (SOCMINT)</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Comprehensive analysis of digital identities across Instagram, TikTok, Facebook, Snapchat, Telegram, X (Twitter), and Discord. We map alias connections, profile histories, check-in timelines, and associated metadata to uncover true identities and operational patterns.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Cross-platform username correlation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Historical archive & cached profile recovery</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Relationship & engagement network mapping</li>
              </ul>
            </div>
            <div className="bg-[#070a10] border border-slate-800 rounded-xl p-6 text-center">
              <span className="text-xs font-mono text-cyan-400 uppercase">Turnaround</span>
              <span className="block text-2xl font-bold text-white mt-1">3 - 5 Days</span>
              <Link href="/request">
                <Button className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
                  Request SOCMINT Case
                </Button>
              </Link>
            </div>
          </div>

          {/* Service 2 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <FileSearch className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Scam & Fraud Research</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Investigating fraudulent online storefronts, investment scams, romance fraud rings, and phishing operations. We gather verifiable evidence packages, payment routing markers, and perpetrator infrastructure details suitable for legal counsel and law enforcement reporting.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Fraudulent storefront & merchant profiling</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Communication channel & phone attribution</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Law-enforcement ready PDF dossier compilation</li>
              </ul>
            </div>
            <div className="bg-[#070a10] border border-slate-800 rounded-xl p-6 text-center">
              <span className="text-xs font-mono text-cyan-400 uppercase">Turnaround</span>
              <span className="block text-2xl font-bold text-white mt-1">4 - 7 Days</span>
              <Link href="/request">
                <Button className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
                  Request Fraud Case
                </Button>
              </Link>
            </div>
          </div>

          {/* Service 3 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Domain & Blockchain Research</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Analysis of suspicious web domains, registrar history, hosting infrastructure, and public cryptocurrency transaction flows. We trace public wallet movements, exchange touchpoints, and related cluster heuristics across major public blockchains.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Domain infrastructure & historical DNS analysis</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Public crypto wallet transaction tracing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Exchange touchpoint identification</li>
              </ul>
            </div>
            <div className="bg-[#070a10] border border-slate-800 rounded-xl p-6 text-center">
              <span className="text-xs font-mono text-cyan-400 uppercase">Turnaround</span>
              <span className="block text-2xl font-bold text-white mt-1">3 - 6 Days</span>
              <Link href="/request">
                <Button className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
                  Request Domain/Crypto Case
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-10">
          <h3 className="text-2xl font-bold text-white mb-3">Have a Custom Investigation Requirement?</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Our operators handle bespoke intelligence tasks. Submit your case details securely for professional assessment.
          </p>
          <Link href="/request">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-8">
              Start Investigation Request <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
