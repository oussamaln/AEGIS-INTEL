import React from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link, useSearch } from "wouter";
import { CheckCircle2, Shield, ArrowRight, FileText, Clock, KeyRound } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Submitted() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const refCode = params.get("ref") || "OSINT-DEMO";

  const { data: requestInfo } = trpc.osint.getRequestByRef.useQuery(
    { referenceCode: refCode },
    { enabled: !!refCode && refCode !== "OSINT-DEMO" }
  );

  return (
    <PublicLayout>
      <div className="py-20 container mx-auto px-4 max-w-2xl text-center">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-6 shadow-xl shadow-emerald-950/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
          <span>STATUS: UNDER REVIEW</span>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3">Investigation Request Received</h1>
        <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
          Your dossier has been securely encrypted and submitted to our operations desk. Our senior operators will review your objectives and contact you shortly.
        </p>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 mb-8 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-slate-400 uppercase">Unique Reference Code</span>
            <span className="font-mono font-bold text-cyan-400 text-lg bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-lg">
              {requestInfo?.referenceCode || refCode}
            </span>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100">
            <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1"><KeyRound className="w-3.5 h-3.5" /> Save this reference code</div>
            Keep it private. You will need it to track your case status and read messages from the AEGIS INTEL team.
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-mono text-slate-400 uppercase">Current Status</span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {requestInfo?.status || "NEW"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Submitted At</span>
            <span className="text-xs text-slate-300 font-mono">
              {requestInfo?.createdAt ? new Date(requestInfo.createdAt).toLocaleString() : new Date().toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-8 py-3">
              Return to Home
            </Button>
          </Link>
          <Link href={`/track?ref=${encodeURIComponent(requestInfo?.referenceCode || refCode)}`}>
            <Button variant="outline" className="w-full sm:w-auto border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 px-8 py-3">
              Track This Request
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
