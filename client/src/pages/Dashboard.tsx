import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { isAdministrator } from "@/lib/access";
import { CONTACT_INBOX_FILTERS, filterContactInboxMessages, type ContactInboxFilter } from "@/lib/contactInbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Lock, FileText, DollarSign, Activity, Users, LogOut, CheckCircle2, Clock, AlertCircle, ArrowLeft, Download, Upload, ExternalLink, Mail } from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import { toast } from "sonner";

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The selected report could not be read."));
    reader.onload = () => {
      const value = String(reader.result ?? "");
      const separatorIndex = value.indexOf(",");
      resolve(separatorIndex >= 0 ? value.slice(separatorIndex + 1) : value);
    };
    reader.readAsDataURL(file);
  });
}

type DashboardDeniedUser = {
  email?: string | null;
  name?: string | null;
};

export function DashboardAdminApprovalRequired({
  user,
  onLogout,
}: {
  user: DashboardDeniedUser;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
        <Lock className="w-12 h-12 text-amber-400 mx-auto" />
        <h1 className="text-2xl font-bold">Administrator Approval Required</h1>
        <p className="text-slate-400 text-xs leading-relaxed">
          You are signed in as <span className="text-slate-200">{user.email || user.name || "this account"}</span>, but it does not have staff administrator access.
        </p>
        <Button variant="outline" onClick={onLogout} className="w-full border-slate-700 bg-slate-950 text-slate-300 hover:text-white">
          <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
        </Button>
        <a href="/">
          <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
            Return to Public Site
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Route matching for detail view: /dashboard/requests/:id
  const [isDetailRoute, detailParams] = useRoute("/dashboard/requests/:id");
  const reqId = isDetailRoute && detailParams?.id ? parseInt(detailParams.id) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Shield className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
          <p className="text-xs text-slate-400 font-mono">VERIFYING SECURE SESSION…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <Lock className="w-12 h-12 text-amber-400 mx-auto" />
          <h1 className="text-2xl font-bold">Staff Sign-In Required</h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            Sign in with your authorized staff account to access the Aegis Intelligence operations platform.
          </p>
          <Button onClick={() => startLogin()} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
            Sign In as Staff
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full border-slate-700 bg-slate-950 text-slate-300 hover:text-white">
              Return to Public Site
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdministrator(user)) {
    return <DashboardAdminApprovalRequired user={user} onLogout={() => logout()} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#070a10] px-6 h-16 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AEGIS INTEL // STAFF OPERATIONS
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-slate-400 font-mono">OPERATOR: {user.email || user.name}</span>
          <Button variant="outline" size="sm" onClick={() => logout()} className="border-slate-700 bg-slate-900 text-slate-300 hover:text-white">
            <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-[#070a10]/50 p-6 hidden md:block space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-cyan-400 hover:bg-slate-900">
              <Activity className="w-4 h-4 mr-2" /> Overview & Requests
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-cyan-400 hover:bg-slate-900">
              <ExternalLink className="w-4 h-4 mr-2" /> Public Website
            </Button>
          </Link>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {reqId ? <RequestDetail requestId={reqId} /> : <DashboardOverview />}
        </main>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const { data: requests, refetch } = trpc.osint.listRequests.useQuery();

  const counts = {
    new: requests?.filter(r => r.status === 'NEW').length || 0,
    reviewing: requests?.filter(r => r.status === 'REVIEWING').length || 0,
    payment: requests?.filter(r => r.status === 'PAYMENT_REQUIRED').length || 0,
    paid: requests?.filter(r => r.status === 'PAID').length || 0,
    investigating: requests?.filter(r => r.status === 'INVESTIGATING').length || 0,
    completed: requests?.filter(r => r.status === 'COMPLETED').length || 0,
    refunded: requests?.filter(r => r.status === 'REFUNDED').length || 0,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Operations Overview</h1>
        <p className="text-xs text-slate-400">Manage incoming investigation dossiers, case statuses, pricing, and report deliveries.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-mono">NEW</span>
          <span className="block text-2xl font-bold text-cyan-400 mt-1">{counts.new}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-mono">REVIEWING</span>
          <span className="block text-2xl font-bold text-amber-400 mt-1">{counts.reviewing}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-mono">PAYMENT REQ</span>
          <span className="block text-2xl font-bold text-blue-400 mt-1">{counts.payment}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-mono">PAID</span>
          <span className="block text-2xl font-bold text-emerald-400 mt-1">{counts.paid}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-mono">INVESTIGATING</span>
          <span className="block text-2xl font-bold text-purple-400 mt-1">{counts.investigating}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-mono">COMPLETED</span>
          <span className="block text-2xl font-bold text-emerald-500 mt-1">{counts.completed}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-mono">REFUNDED</span>
          <span className="block text-2xl font-bold text-rose-400 mt-1">{counts.refunded}</span>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white text-sm uppercase tracking-wider">Investigation Requests ({requests?.length || 0})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase bg-slate-950/50">
                <th className="p-4">Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4">Contact Method</th>
                <th className="p-4">Target Platform</th>
                <th className="p-4">Status</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests?.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-400">{r.referenceCode}</td>
                  <td className="p-4 text-slate-400 font-mono">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-300">{r.contactMethod} ({r.contactValue})</td>
                  <td className="p-4 text-slate-300">{r.targetPlatform || "N/A"}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold font-mono ${
                      r.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      r.status === 'NEW' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                      r.status === 'PAYMENT_REQUIRED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      r.status === 'REFUNDED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-200">{r.price ? `$${r.price}` : "Unset"}</td>
                  <td className="p-4 text-right">
                    <Link href={`/dashboard/requests/${r.id}`}>
                      <Button size="sm" variant="outline" className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
                        View Case
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {(!requests || requests.length === 0) && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No investigation requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ContactInbox />
    </div>
  );
}

function ContactInbox() {
  const utils = trpc.useUtils();
  const { data: messages, isLoading } = trpc.contact.list.useQuery();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactInboxFilter>("ALL");
  const updateStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      toast.success("Contact message status updated.");
    },
    onError: error => toast.error(error.message),
  });
  const filteredMessages = filterContactInboxMessages(messages ?? [], keyword, statusFilter);
  const statusStyle: Record<string, string> = {
    NEW: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    READ: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    REPLIED: "bg-violet-500/10 border-violet-500/30 text-violet-300",
    ARCHIVED: "bg-slate-800 border-slate-700 text-slate-400",
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /> Contact Inbox</h2>
          <p className="mt-1 text-xs text-slate-400">Public website messages. Available only to administrator accounts.</p>
        </div>
        <span className="px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px] font-mono">{messages?.filter(message => message.status === "NEW").length || 0} NEW</span>
      </div>
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/30 space-y-3">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search name, email, subject, or enquiry…"
            aria-label="Search contact inbox"
            className="border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
          />
          <p className="text-xs text-slate-400" aria-live="polite">{filteredMessages.length} of {messages?.length ?? 0} messages</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filter contact messages by status">
          {CONTACT_INBOX_FILTERS.map((filter) => (
            <Button
              key={filter}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setStatusFilter(filter)}
              className={statusFilter === filter
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
                : "border-slate-700 bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-slate-200"}
            >
              {filter === "ALL" ? "All" : filter}
            </Button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">Use “Reply by Email” to open your mail client, then mark the enquiry as replied once you have sent the response.</p>
      </div>
      <div className="divide-y divide-slate-800">
        {isLoading && <div className="p-6 text-xs text-slate-400">Loading secure inbox…</div>}
        {filteredMessages.map(message => (
          <article key={message.id} className="p-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-100 text-sm">{message.subject}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono border ${statusStyle[message.status]}`}>{message.status}</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{message.name} · <a href={`mailto:${message.email}`} className="text-cyan-400 hover:text-cyan-300">{message.email}</a> · {new Date(message.createdAt).toLocaleString()}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{message.message}</p>
              {message.repliedAt && <p className="mt-3 text-[11px] font-mono text-violet-300">Marked replied {new Date(message.repliedAt).toLocaleString()}</p>}
            </div>
            <div className="flex flex-wrap lg:flex-col gap-2 self-start">
              {message.status === "NEW" && <Button size="sm" variant="outline" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: message.id, status: "READ" })} className="border-slate-700 bg-slate-950 text-slate-300 hover:text-white">Mark Read</Button>}
              {message.status !== "ARCHIVED" && <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                className="inline-flex h-8 items-center justify-center rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3 text-xs font-medium text-cyan-200 transition-colors hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Reply by Email
              </a>}
              {message.status !== "REPLIED" && message.status !== "ARCHIVED" && <Button size="sm" variant="outline" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: message.id, status: "REPLIED" })} className="border-violet-500/30 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 hover:text-violet-100">Mark Replied</Button>}
              {message.status !== "ARCHIVED" && <Button size="sm" variant="outline" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: message.id, status: "ARCHIVED" })} className="border-slate-700 bg-slate-950 text-slate-300 hover:text-white">Archive</Button>}
            </div>
          </article>
        ))}
        {!isLoading && (!messages || messages.length === 0) && <div className="p-8 text-center text-sm text-slate-400">No contact messages have been received.</div>}
        {!isLoading && (messages?.length ?? 0) > 0 && filteredMessages.length === 0 && <div className="p-8 text-center text-sm text-slate-400">No messages match the current search and status filter.</div>}
      </div>
    </section>
  );
}

function RequestDetail({ requestId }: { requestId: number }) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.osint.getRequestDetail.useQuery({ id: requestId });

  const [status, setStatus] = useState<any>("");
  const [price, setPrice] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [clientMessage, setClientMessage] = useState("");

  // Payment form
  const [payCurrency, setPayCurrency] = useState("USDT");
  const [payAmount, setPayAmount] = useState("");
  const [payTxId, setPayTxId] = useState("");

  const updateStatusMutation = trpc.osint.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Case status updated successfully.");
      utils.osint.getRequestDetail.invalidate({ id: requestId });
    },
    onError: (err) => toast.error(err.message),
  });

  const addNoteMutation = trpc.osint.addNote.useMutation({
    onSuccess: () => {
      toast.success("Private note added.");
      setNoteContent("");
      utils.osint.getRequestDetail.invalidate({ id: requestId });
    },
    onError: (err) => toast.error(err.message),
  });

  const addClientMessageMutation = trpc.osint.addClientMessage.useMutation({
    onSuccess: () => {
      toast.success("Client update published to the reference-code tracker.");
      setClientMessage("");
      utils.osint.getRequestDetail.invalidate({ id: requestId });
    },
    onError: (err) => toast.error(err.message),
  });

  const recordPaymentMutation = trpc.osint.recordPayment.useMutation({
    onSuccess: () => {
      toast.success("Cryptocurrency payment recorded successfully.");
      setPayAmount("");
      setPayTxId("");
      utils.osint.getRequestDetail.invalidate({ id: requestId });
    },
    onError: (err) => toast.error(err.message),
  });

  const uploadReportMutation = trpc.osint.uploadReport.useMutation({
    onSuccess: () => {
      toast.success("Report uploaded and case marked COMPLETED.");
      utils.osint.getRequestDetail.invalidate({ id: requestId });
    },
    onError: (err) => toast.error(err.message),
  });

  const uploadFileMutation = trpc.osint.uploadFile.useMutation();

  const downloadAttachmentMutation = trpc.osint.getSecureDownloadUrl.useQuery(
    { type: "attachment", id: 0 },
    { enabled: false }
  );

  const handleDownload = async (type: "attachment" | "report", id: number, filename: string) => {
    try {
      const res = await utils.client.osint.getSecureDownloadUrl.query({ type, id });
      const a = document.createElement("a");
      a.href = res.url;
      a.download = filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      toast.error(`Download failed: ${err.message}`);
    }
  };

  const handleReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/pdf") {
      toast.error("Only PDF reports are allowed.");
      return;
    }
    try {
      toast.message("Uploading report PDF to secure storage...");
      const base64Data = await readFileAsBase64(file);
      const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const res = await uploadFileMutation.mutateAsync({
        filename: `reports/${Date.now()}-${safeFilename}`,
        contentType: file.type,
        base64Data,
      });
      uploadReportMutation.mutate({
        requestId,
        filename: file.name,
        storageKey: res.key,
      });
    } catch (err: any) {
      toast.error(`Report upload failed: ${err.message}`);
    }
  };

  if (isLoading || !data) {
    return <div className="text-center py-20 text-slate-400">Loading case dossier...</div>;
  }

  const { request, attachments, payments, reports, notes, clientUpdates } = data;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 text-slate-300">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Overview
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">REFERENCE:</span>
          <span className="font-mono font-bold text-cyan-400 text-base">{request.referenceCode}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Case Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Client & Target Dossier</h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Contact Method:</span>
                <span className="font-semibold text-white">{request.contactMethod} ({request.contactValue})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Current Status:</span>
                <span className="font-semibold text-cyan-400 font-mono">{request.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Platform:</span>
                <span className="font-semibold text-white">{request.targetPlatform || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Username:</span>
                <span className="font-semibold text-white">{request.targetUsername || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target URL:</span>
                <span className="font-semibold text-white truncate block">{request.targetUrl || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Email / Phone:</span>
                <span className="font-semibold text-white">{request.targetEmail || request.targetPhone || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Domain:</span>
                <span className="font-semibold text-white">{request.targetDomain || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Crypto Wallet:</span>
                <span className="font-semibold text-white truncate block">{request.targetWallet || "N/A"}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-slate-400 block text-xs mb-1">Investigation Goal:</span>
              <p className="text-slate-200 text-xs bg-slate-950 p-4 rounded-xl leading-relaxed">{request.goal}</p>
            </div>

            {request.additionalInfo && (
              <div>
                <span className="text-slate-400 block text-xs mb-1">Additional Context:</span>
                <p className="text-slate-300 text-xs bg-slate-950 p-4 rounded-xl leading-relaxed">{request.additionalInfo}</p>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Attached Evidence ({attachments.length})</h2>
            <div className="space-y-2">
              {attachments.map(att => (
                <div key={att.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs">
                  <div>
                    <span className="font-mono text-cyan-300 block">{att.filename}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{att.mimeType} • {(att.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleDownload("attachment", att.id, att.filename)} className="border-slate-700 bg-slate-900 text-slate-200">
                    <Download className="w-3.5 h-3.5 mr-1" /> Secure Download
                  </Button>
                </div>
              ))}
              {attachments.length === 0 && <p className="text-xs text-slate-500">No evidence attachments uploaded.</p>}
            </div>
          </div>

          {/* Reports */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Final PDF Reports ({reports.length})</h2>
            <div className="space-y-2">
              {reports.map(rep => (
                <div key={rep.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs">
                  <div>
                    <span className="font-mono text-emerald-400 block">{rep.filename}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Uploaded: {new Date(rep.createdAt).toLocaleString()}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleDownload("report", rep.id, rep.filename)} className="border-slate-700 bg-slate-900 text-slate-200">
                    <Download className="w-3.5 h-3.5 mr-1" /> Download Dossier
                  </Button>
                </div>
              ))}
              {reports.length === 0 && <p className="text-xs text-slate-500">No final report PDF uploaded yet.</p>}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Label className="text-xs text-slate-300 uppercase tracking-wider block mb-2">Upload Final Report (PDF)</Label>
              <Input 
                type="file" 
                accept=".pdf" 
                onChange={handleReportUpload}
                className="bg-slate-950 border-slate-800 text-xs file:bg-cyan-600 file:text-white file:border-0 file:rounded-md cursor-pointer max-w-sm"
              />
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Private Admin Notes</h2>
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Operator #{note.adminUserId}</span>
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{note.content}</p>
                </div>
              ))}
              {notes.length === 0 && <p className="text-xs text-slate-500">No private notes recorded.</p>}
            </div>

            <div className="space-y-2 pt-2">
              <Textarea 
                rows={3}
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="Add private investigator note..."
                className="bg-slate-950 border-slate-800 text-xs text-white resize-none"
              />
              <Button 
                size="sm" 
                onClick={() => { if (noteContent.trim()) addNoteMutation.mutate({ requestId, content: noteContent }); }}
                disabled={addNoteMutation.isPending}
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Add Private Note
              </Button>
            </div>
          </div>

          {/* Client-visible messages */}
          <div className="bg-cyan-950/20 border border-cyan-900/60 rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Client Status & Messages</h2>
              <p className="text-xs text-cyan-100/60 mt-1">Visible through the client’s reference code. Do not include evidence, contact details, or internal notes.</p>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {clientUpdates.map(update => (
                <div key={update.id} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-cyan-300/70 font-mono">
                    <span>{update.status ? `STATUS: ${update.status}` : "STAFF MESSAGE"}</span>
                    <span>{new Date(update.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{update.message}</p>
                </div>
              ))}
              {clientUpdates.length === 0 && <p className="text-xs text-slate-500">No client-visible updates yet.</p>}
            </div>
            <div className="space-y-2 pt-2 border-t border-cyan-900/40">
              <Textarea
                rows={3}
                value={clientMessage}
                onChange={e => setClientMessage(e.target.value)}
                placeholder="Write a clear update for the client..."
                className="bg-slate-950 border-slate-800 text-xs text-white resize-none"
              />
              <Button
                size="sm"
                onClick={() => { if (clientMessage.trim()) addClientMessageMutation.mutate({ requestId, message: clientMessage }); }}
                disabled={addClientMessageMutation.isPending || !clientMessage.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Publish Client Update
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Management Actions */}
        <div className="space-y-6">
          {/* Status & Price Management */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Case Management</h2>

            <div className="space-y-2">
              <Label className="text-xs text-slate-300 uppercase tracking-wider">Change Status</Label>
              <Select defaultValue={request.status} onValueChange={v => setStatus(v)}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white text-xs">
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="REVIEWING">REVIEWING</SelectItem>
                  <SelectItem value="WAITING_FOR_CLIENT">WAITING_FOR_CLIENT</SelectItem>
                  <SelectItem value="PAYMENT_REQUIRED">PAYMENT_REQUIRED</SelectItem>
                  <SelectItem value="PAID">PAID</SelectItem>
                  <SelectItem value="INVESTIGATING">INVESTIGATING</SelectItem>
                  <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                  <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-300 uppercase tracking-wider">Case Price ($ USD)</Label>
              <Input 
                defaultValue={request.price || ""}
                onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 500"
                className="bg-slate-950 border-slate-800 text-white text-xs"
              />
            </div>

            {status === "REFUNDED" && (
              <div className="space-y-2">
                <Label className="text-xs text-rose-400 uppercase tracking-wider">Refund Reason *</Label>
                <Textarea 
                  defaultValue={request.refundReason || ""}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="State reason for refund..."
                  className="bg-slate-950 border-slate-800 text-xs text-white resize-none"
                />
              </div>
            )}

            <Button 
              onClick={() => updateStatusMutation.mutate({
                requestId,
                status: status || request.status,
                price: price !== "" ? price : request.price || undefined,
                refundReason: status === "REFUNDED" ? refundReason : undefined,
              })}
              disabled={updateStatusMutation.isPending}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
            >
              Update Case State
            </Button>
          </div>

          {/* Record Cryptocurrency Payment */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Record Crypto Payment</h2>

            <div className="space-y-2">
              <Label className="text-xs text-slate-300 uppercase tracking-wider">Currency</Label>
              <Select value={payCurrency} onValueChange={v => setPayCurrency(v)}>
                <SelectTrigger className="bg-slate-950 border-slate-800 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white text-xs">
                  <SelectItem value="USDT">USDT (TRC20 / ERC20)</SelectItem>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-300 uppercase tracking-wider">Amount</Label>
              <Input 
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                placeholder="e.g. 500.00"
                className="bg-slate-950 border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-300 uppercase tracking-wider">Transaction ID / Hash</Label>
              <Input 
                value={payTxId}
                onChange={e => setPayTxId(e.target.value)}
                placeholder="0x... tx hash"
                className="bg-slate-950 border-slate-800 text-white text-xs"
              />
            </div>

            <Button 
              onClick={() => {
                if (!payAmount || !payTxId) {
                  toast.error("Please enter payment amount and transaction ID.");
                  return;
                }
                recordPaymentMutation.mutate({
                  requestId,
                  currency: payCurrency,
                  amount: payAmount,
                  transactionId: payTxId,
                });
              }}
              disabled={recordPaymentMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
            >
              Record Payment
            </Button>

            {payments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Recorded Payments</span>
                {payments.map(p => (
                  <div key={p.id} className="bg-slate-950 p-3 rounded-lg text-[11px] space-y-1 font-mono">
                    <div className="text-emerald-400 font-bold">{p.amount} {p.currency} ({p.status})</div>
                    <div className="text-slate-400 truncate">Tx: {p.transactionId}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
