import React, { useState } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicLayout } from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clock3, FileSearch, KeyRound, MessageSquareText, Search, ShieldCheck } from "lucide-react";

const statusMeta: Record<string, { label: string; description: string; className: string }> = {
  NEW: { label: "Pending review", description: "Your request is in the review queue.", className: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10" },
  REVIEWING: { label: "Under review", description: "Our team is reviewing the case scope.", className: "text-amber-300 border-amber-500/30 bg-amber-500/10" },
  WAITING_FOR_CLIENT: { label: "Information needed", description: "Please read the latest message from our team.", className: "text-amber-300 border-amber-500/30 bg-amber-500/10" },
  PAYMENT_REQUIRED: { label: "Payment required", description: "Your review is complete and awaits payment confirmation.", className: "text-blue-300 border-blue-500/30 bg-blue-500/10" },
  PAID: { label: "Payment confirmed", description: "Payment has been confirmed.", className: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
  INVESTIGATING: { label: "Investigation in progress", description: "Your case is actively being investigated.", className: "text-violet-300 border-violet-500/30 bg-violet-500/10" },
  COMPLETED: { label: "Completed", description: "Your investigation has been completed.", className: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
  REFUNDED: { label: "Refunded", description: "Your case has been refunded.", className: "text-rose-300 border-rose-500/30 bg-rose-500/10" },
  CANCELLED: { label: "Closed", description: "Your request has been closed.", className: "text-slate-300 border-slate-500/30 bg-slate-500/10" },
};

export default function TrackCase() {
  const search = useSearch();
  const initialReference = new URLSearchParams(search).get("ref")?.trim().toUpperCase() || "";
  const [referenceInput, setReferenceInput] = useState(initialReference);
  const [activeReference, setActiveReference] = useState(initialReference);

  const tracking = trpc.osint.getRequestByRef.useQuery(
    { referenceCode: activeReference },
    { enabled: Boolean(activeReference), retry: false }
  );

  const submitTracking = (event: React.FormEvent) => {
    event.preventDefault();
    setActiveReference(referenceInput.trim().toUpperCase());
  };

  const request = tracking.data;
  const currentStatus = request ? (statusMeta[request.status] || statusMeta.NEW) : undefined;

  return (
    <PublicLayout>
      <section className="container max-w-4xl py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <FileSearch className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Track Your Investigation Request</h1>
          <p className="text-sm text-slate-400 leading-relaxed mt-4">
            Enter the private reference code you received after submitting your request to view its current status and messages from the AEGIS INTEL team.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 md:p-7 shadow-2xl shadow-cyan-950/20">
          <form onSubmit={submitTracking} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={referenceInput}
                onChange={(event) => setReferenceInput(event.target.value.toUpperCase())}
                placeholder="Example: OSINT-AB12CD34"
                aria-label="Investigation reference code"
                className="pl-10 h-11 bg-slate-950 border-slate-700 text-white font-mono placeholder:text-slate-600"
              />
            </div>
            <Button type="submit" disabled={!referenceInput.trim()} className="h-11 bg-cyan-600 hover:bg-cyan-500 text-white min-w-36">
              <Search className="w-4 h-4 mr-2" /> Track request
            </Button>
          </form>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            Keep your reference code private. This page displays only client-safe status information and messages; investigation details and evidence remain protected.
          </p>
        </div>

        {tracking.isFetching && (
          <div className="mt-8 text-center text-sm text-slate-400 font-mono">SECURELY RETRIEVING CASE STATUS…</div>
        )}

        {tracking.error && activeReference && !tracking.isFetching && (
          <div className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
            <p className="text-rose-200 font-semibold">We could not find that reference code.</p>
            <p className="text-sm text-rose-100/70 mt-2">Check that the code is complete and try again. If you need help, contact AEGIS INTEL.</p>
          </div>
        )}

        {request && currentStatus && !tracking.isFetching && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Case reference</p>
                  <p className="mt-1 font-mono text-lg font-bold text-cyan-300">{request.referenceCode}</p>
                </div>
                <div className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 border text-xs font-semibold ${currentStatus.className}`}>
                  <ShieldCheck className="w-3.5 h-3.5" /> {currentStatus.label}
                </div>
              </div>
              <p className="mt-5 text-sm text-slate-300">{currentStatus.description}</p>
              <p className="mt-2 text-xs text-slate-500">Submitted {new Date(request.createdAt).toLocaleString()}.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300"><MessageSquareText className="w-4 h-4" /></div>
                <div>
                  <h2 className="font-bold text-white">Case Updates</h2>
                  <p className="text-xs text-slate-500">Status changes and messages from the investigation team.</p>
                </div>
              </div>
              <div className="relative ml-2 border-l border-slate-800 space-y-6">
                {request.updates.map((update, index) => (
                  <div key={`${update.createdAt}-${index}`} className="relative pl-6">
                    <span className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="text-xs font-semibold text-cyan-200">{update.status ? (statusMeta[update.status]?.label || update.status) : "Message from AEGIS INTEL"}</span>
                      <span className="text-[11px] font-mono text-slate-500"><Clock3 className="w-3 h-3 inline mr-1" />{new Date(update.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{update.message}</p>
                  </div>
                ))}
                {request.updates.length === 0 && <p className="pl-6 text-sm text-slate-500">No updates have been posted yet.</p>}
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 text-center text-sm text-slate-400">
          Do not have a reference code yet? <Link href="/request" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">Submit an investigation request</Link>.
        </div>
      </section>
    </PublicLayout>
  );
}
