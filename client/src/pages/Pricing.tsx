import React from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, CheckCircle2, ArrowRight, Wallet, Cpu, Bitcoin } from "lucide-react";

export default function Pricing() {
  const tiers = [
    {
      name: "Basic Investigation",
      price: "$34.99",
      description: "For simple investigations involving one target and limited information.",
      turnaround: "2–3 days",
      features: [
        "1 target",
        "1–2 platforms",
        "Username/profile research",
        "Basic digital footprint research",
        "Public-source verification",
        "Short findings summary"
      ],
      highlight: false
    },
    {
      name: "Advanced Investigation",
      price: "$94.99",
      description: "For investigations requiring deeper cross-platform research.",
      turnaround: "3–5 days",
      features: [
        "1 target",
        "Multiple social platforms",
        "Username & alias correlation",
        "Profile and domain research",
        "Timeline reconstruction",
        "Public-source cross-referencing",
        "Evidence organization",
        "Detailed investigation report"
      ],
      highlight: true
    },
    {
      name: "Full Intelligence Report",
      price: "$194.99",
      description: "For comprehensive OSINT/SOCMINT investigations.",
      turnaround: "5–10 days",
      features: [
        "Multi-platform investigation",
        "Digital footprint mapping",
        "Publicly available website/domain research",
        "Scam/fraud research",
        "Public blockchain research where relevant",
        "Timeline and relationship mapping",
        "Source documentation",
        "Comprehensive PDF report"
      ],
      highlight: false
    },
    {
      name: "Custom Investigation",
      price: "Custom",
      description: "For complex, large-scale, or long-term investigations.",
      turnaround: "Custom timeline",
      features: [
        "Dedicated investigation scope",
        "Custom research methodology",
        "Multiple investigators/operators",
        "Advanced evidence organization",
        "Custom reporting & communication",
        "Long-term monitoring projects"
      ],
      highlight: false
    }
  ];

  return (
    <PublicLayout>
      <div className="py-16 container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>TRANSPARENT TIERED PRICING</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Investigation Pricing & Packages</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Professional intelligence gathering tailored to your exact case requirements. Fixed pricing on standard tiers with secure cryptocurrency settlement.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`bg-slate-900/60 border rounded-2xl p-6 flex flex-col justify-between relative ${
              tier.highlight ? 'border-cyan-500 shadow-xl shadow-cyan-950/50 bg-slate-900/90' : 'border-slate-800'
            }`}>
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[10px] font-mono uppercase tracking-widest px-3 py-0.5 rounded-full">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-cyan-400 font-mono">{tier.price}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">{tier.description}</p>
                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Includes:</span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono block mb-3">Turnaround: {tier.turnaround}</span>
                <Link href="/request">
                  <Button className={`w-full font-semibold text-xs py-5 ${
                    tier.highlight ? 'bg-cyan-600 hover:bg-cyan-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}>
                    Request Tier <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Wallet className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Secure Cryptocurrency Payment Methods</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              To ensure absolute privacy and secure cross-border settlement, Aegis Intelligence accepts cryptocurrency payments settled in <strong className="text-cyan-400">USDT</strong> (equivalent token value).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl text-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                  <Bitcoin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Binance Pay</h3>
                <p className="text-xs text-slate-400">Direct USDT / crypto transfer via Binance UID or Pay ID.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl text-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Bybit Transfer</h3>
                <p className="text-xs text-slate-400">Fast internal USDT transfer or spot wallet settlement.</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl text-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Direct Wallet Transfer</h3>
                <p className="text-xs text-slate-400">USDT (TRC20 / ERC20) or BTC/ETH sent to verified operator address.</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 pt-4">
              Payment instructions, QR codes, and wallet addresses are provided securely by our operations desk upon case review and pricing agreement.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
