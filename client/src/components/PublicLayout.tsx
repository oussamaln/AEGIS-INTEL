import React from "react";
import { Link, useLocation } from "wouter";
import { Shield, Lock, Terminal, FileText, HelpCircle, Mail, UserCheck } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background grid motif */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-slate-800 bg-[#0a0e17]/80 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AEGIS INTEL
              </span>
              <span className="block text-[10px] tracking-widest text-slate-400 uppercase">OSINT & SOCMINT OPS</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <Link href="/" className={`hover:text-cyan-400 transition-colors ${location === '/' ? 'text-cyan-400 font-semibold' : ''}`}>Home</Link>
            <Link href="/services" className={`hover:text-cyan-400 transition-colors ${location === '/services' ? 'text-cyan-400 font-semibold' : ''}`}>Services</Link>
            <Link href="/pricing" className={`hover:text-cyan-400 transition-colors ${location === '/pricing' ? 'text-cyan-400 font-semibold' : ''}`}>Pricing</Link>
            <Link href="/track" className={`hover:text-cyan-400 transition-colors ${location === '/track' ? 'text-cyan-400 font-semibold' : ''}`}>Track Case</Link>
            <Link href="/faq" className={`hover:text-cyan-400 transition-colors ${location === '/faq' ? 'text-cyan-400 font-semibold' : ''}`}>FAQ</Link>
            <Link href="/contact" className={`hover:text-cyan-400 transition-colors ${location === '/contact' ? 'text-cyan-400 font-semibold' : ''}`}>Contact</Link>

          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/request">
              <Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-900/30 border border-cyan-400/30">
                Request Investigation
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-[#070a10] py-12 text-slate-400 text-sm">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-slate-100 tracking-wider">AEGIS INTEL</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional open-source intelligence, social media intelligence, scam tracking, and digital asset verification for individuals, legal teams, and corporations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs tracking-wider uppercase">Operations</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Digital Forensics</Link></li>
              <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Scam & Fraud Tracking</Link></li>
              <li><Link href="/services" className="hover:text-cyan-400 transition-colors">SOCMINT Profiling</Link></li>
              <li><Link href="/services" className="hover:text-cyan-400 transition-colors">Blockchain Tracing</Link></li>
              <li><Link href="/track" className="hover:text-cyan-400 transition-colors">Track a Case</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs tracking-wider uppercase">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/faq" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/faq" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/faq" className="hover:text-cyan-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="/faq" className="hover:text-cyan-400 transition-colors">Evidence Handling</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs tracking-wider uppercase">Secure Status</h4>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Node Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono">● SECURE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Encryption:</span>
                <span className="text-cyan-400 font-mono">TLS 1.3 / AES-256</span>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 border-t border-slate-800/60 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Aegis Intelligence Services. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-mono text-[11px]">Authorized investigative operations only. Lawful compliance verified.</p>
        </div>
      </footer>
    </div>
  );
}
