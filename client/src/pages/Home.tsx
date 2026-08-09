import React from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Search, Lock, FileSearch, Globe, Database, ArrowRight, CheckCircle2, AlertTriangle, Cpu } from "lucide-react";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6">
            <Cpu className="w-3.5 h-3.5" />
            <span>ADVANCED OPEN SOURCE & SOCMINT INVESTIGATION UNIT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Digital Intelligence & <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Target Investigation Services
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Professional intelligence gathering, fraud analysis, digital footprint tracing, and verified threat research conducted by experienced operators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/request">
              <Button size="lg" className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-8 py-6 text-base shadow-xl shadow-cyan-900/40 border border-cyan-400/40 group">
                Request an Investigation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white px-8 py-6 text-base">
                Explore Services
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-800/80 text-left">
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <span className="block text-2xl font-bold text-cyan-400 font-mono">100%</span>
              <span className="text-xs text-slate-400">Confidential & Secure</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <span className="block text-2xl font-bold text-cyan-400 font-mono">24/7</span>
              <span className="text-xs text-slate-400">Secure Intake Portal</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <span className="block text-2xl font-bold text-cyan-400 font-mono">PDF</span>
              <span className="text-xs text-slate-400">Verified Dossier Reports</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl">
              <span className="block text-2xl font-bold text-cyan-400 font-mono">Lawful</span>
              <span className="text-xs text-slate-400">Strict Ethical Standards</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      py-24 bg-[#070a10] border-t border-slate-800
      <section className="py-24 bg-[#070a10] border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">Core Capabilities</h2>
            <h3 className="text-3xl font-bold text-white">Comprehensive Intelligence Operations</h3>
            <p className="text-slate-400 mt-2">Specialized OSINT methodologies tailored to uncover actionable digital evidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Social Media (SOCMINT)</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Deep analysis of cross-platform profiles, user activity timelines, hidden relationship graphs, and metadata attribution across Instagram, TikTok, X, and Telegram.
              </p>
              <Link href="/services" className="text-cyan-400 text-sm font-semibold flex items-center gap-1 hover:underline">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Scam & Fraud Research</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Tracing fraudulent entities, rogue online storefronts, investment scams, and phishing operations. Gathering verifiable attribution dossiers for legal and law enforcement use.
              </p>
              <Link href="/services" className="text-cyan-400 text-sm font-semibold flex items-center gap-1 hover:underline">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Domain & Crypto Tracing</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Investigating suspicious domain registrations, infrastructure linkages, and public cryptocurrency transaction flows across major blockchains.
              </p>
              <Link href="/services" className="text-cyan-400 text-sm font-semibold flex items-center gap-1 hover:underline">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Investigation Process */}
      <section className="py-24 bg-[#0a0e17] border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3">Operational Workflow</h2>
            <h3 className="text-3xl font-bold text-white">How Our Investigation Process Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl relative">
              <div className="text-3xl font-mono font-bold text-cyan-500/40 mb-4">01</div>
              <h4 className="font-bold text-white mb-2">Secure Submission</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Submit target details and objectives through our encrypted intake wizard. Receive a unique reference code.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl relative">
              <div className="text-3xl font-mono font-bold text-cyan-500/40 mb-4">02</div>
              <h4 className="font-bold text-white mb-2">Review & Scope</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Our senior operators review your case requirements, assess feasibility, and establish agreement pricing.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl relative">
              <div className="text-3xl font-mono font-bold text-cyan-500/40 mb-4">03</div>
              <h4 className="font-bold text-white mb-2">Manual Operation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Experienced investigators deploy advanced OSINT techniques and database analysis to compile findings.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl relative">
              <div className="text-3xl font-mono font-bold text-cyan-500/40 mb-4">04</div>
              <h4 className="font-bold text-white mb-2">Dossier Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Receive a secure, comprehensive PDF intelligence report containing verified evidence and attribution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund & Ethics Statement */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Transparent Terms & Ethical Standards</h3>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto mb-8">
            Intelligence investigations rely on publicly available data and lawful research methods. Results depend on available digital footprints. We maintain strict privacy compliance and publish clear refund terms for cases where objectives cannot be investigated.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/faq">
              <Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
                Read FAQ & Refund Policy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
