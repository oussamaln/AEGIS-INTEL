import React, { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, ArrowLeft, ArrowRight, Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { storagePut } from "@/lib/storage"; // Note: frontend helper or direct forge storage upload

export default function RequestPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    contactMethod: "Email",
    contactValue: "",
    targetPlatform: "Instagram",
    targetUsername: "",
    targetUrl: "",
    targetEmail: "",
    targetPhone: "",
    targetDomain: "",
    targetWallet: "",
    goal: "",
    additionalInfo: "",
    consent: false,
    attachments: [] as Array<{ filename: string; storageKey: string; mimeType: string; size: number }>,
  });

  const submitMutation = trpc.osint.submitRequest.useMutation({
    onSuccess: (data) => {
      toast.success("Investigation request submitted successfully!");
      setLocation(`/submitted?ref=${data.referenceCode}`);
    },
    onError: (err) => {
      toast.error(`Submission failed: ${err.message}`);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, PDF, and TXT are accepted.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setUploading(true);
    try {
      // Read file as ArrayBuffer and upload via storagePut helper or API
      const buffer = await file.arrayBuffer();
      // We can use storagePut directly since storagePut is client/server safe or we call a helper
      const res = await storagePut(file.name, new Uint8Array(buffer), file.type);
      setForm(prev => ({
        ...prev,
        attachments: [...prev.attachments, {
          filename: file.name,
          storageKey: res.key,
          mimeType: file.type,
          size: file.size,
        }]
      }));
      toast.success(`Attached ${file.name}`);
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.contactMethod || !form.contactValue) {
        toast.error("Please provide both preferred contact method and identifier.");
        return;
      }
    } else if (step === 2) {
      if (!form.goal || form.goal.length < 10) {
        toast.error("Please provide an investigation goal of at least 10 characters.");
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      toast.error("You must agree to the lawful consent terms before submitting.");
      return;
    }
    submitMutation.mutate({
      contactMethod: form.contactMethod,
      contactValue: form.contactValue,
      targetPlatform: form.targetPlatform || undefined,
      targetUsername: form.targetUsername || undefined,
      targetUrl: form.targetUrl || undefined,
      targetEmail: form.targetEmail || undefined,
      targetPhone: form.targetPhone || undefined,
      targetDomain: form.targetDomain || undefined,
      targetWallet: form.targetWallet || undefined,
      goal: form.goal,
      additionalInfo: form.additionalInfo || undefined,
      consent: form.consent,
      attachments: form.attachments,
    });
  };

  return (
    <PublicLayout>
      <div className="py-16 container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>SECURE INTAKE PORTAL</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Request an Investigation</h1>
          <p className="text-slate-400 text-sm">
            Complete the steps below to securely submit your case dossier for operator review.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-10">
          {[
            { num: 1, label: "Contact" },
            { num: 2, label: "Target & Goal" },
            { num: 3, label: "Evidence" },
            { num: 4, label: "Review" },
          ].map(s => (
            <div key={s.num} className={`p-3 rounded-xl border text-center transition-all ${
              step === s.num 
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 font-semibold' 
                : step > s.num 
                ? 'bg-slate-900 border-slate-700 text-slate-300' 
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <span className="block text-xs font-mono">STEP 0{s.num}</span>
              <span className="text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Contact */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">1. Preferred Contact Information</h2>
                <p className="text-xs text-slate-400">How should our operations desk contact you regarding case scoping and pricing?</p>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-xs uppercase tracking-wider">Preferred Contact Method *</Label>
                  <Select value={form.contactMethod} onValueChange={v => setForm({...form, contactMethod: v})}>
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Telegram">Telegram</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-xs uppercase tracking-wider">Contact Identifier / Handle *</Label>
                  <Input 
                    value={form.contactValue} 
                    onChange={e => setForm({...form, contactValue: e.target.value})} 
                    placeholder="e.g. client@domain.com or @telegram_handle"
                    className="bg-slate-950 border-slate-800 text-white"
                    required
                  />
                  <span className="text-[11px] text-slate-400">Must match your chosen contact method so operators can securely reach you.</span>
                </div>
              </div>
            )}

            {/* Step 2: Target & Goal */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">2. Target Information & Investigation Goal</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200 text-xs uppercase tracking-wider">Target Platform</Label>
                    <Select value={form.targetPlatform} onValueChange={v => setForm({...form, targetPlatform: v})}>
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Snapchat">Snapchat</SelectItem>
                        <SelectItem value="Telegram">Telegram</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="X">X (Twitter)</SelectItem>
                        <SelectItem value="Discord">Discord</SelectItem>
                        <SelectItem value="Website/Domain">Website/Domain</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Crypto Wallet">Crypto Wallet</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200 text-xs uppercase tracking-wider">Target Username / Handle</Label>
                    <Input 
                      value={form.targetUsername} 
                      onChange={e => setForm({...form, targetUsername: e.target.value})} 
                      placeholder="e.g. suspect_account"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200 text-xs uppercase tracking-wider">Target Profile URL</Label>
                    <Input 
                      value={form.targetUrl} 
                      onChange={e => setForm({...form, targetUrl: e.target.value})} 
                      placeholder="https://instagram.com/target"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200 text-xs uppercase tracking-wider">Target Email</Label>
                    <Input 
                      value={form.targetEmail} 
                      onChange={e => setForm({...form, targetEmail: e.target.value})} 
                      placeholder="target@domain.com"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200 text-xs uppercase tracking-wider">Target Phone</Label>
                    <Input 
                      value={form.targetPhone} 
                      onChange={e => setForm({...form, targetPhone: e.target.value})} 
                      placeholder="+1234567890"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200 text-xs uppercase tracking-wider">Target Domain / Website</Label>
                    <Input 
                      value={form.targetDomain} 
                      onChange={e => setForm({...form, targetDomain: e.target.value})} 
                      placeholder="fraudulent-site.com"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200 text-xs uppercase tracking-wider">Crypto Wallet Address</Label>
                    <Input 
                      value={form.targetWallet} 
                      onChange={e => setForm({...form, targetWallet: e.target.value})} 
                      placeholder="0x... or T..."
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-xs uppercase tracking-wider">Investigation Goal *</Label>
                  <Textarea 
                    rows={4}
                    value={form.goal} 
                    onChange={e => setForm({...form, goal: e.target.value})} 
                    placeholder="Explain clearly what you want to uncover, verify, or track..."
                    className="bg-slate-950 border-slate-800 text-white resize-none"
                    required
                  />
                  <span className="text-[11px] text-slate-400">Minimum 10 characters required. Be specific about your objectives.</span>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 text-xs uppercase tracking-wider">Additional Information & Context</Label>
                  <Textarea 
                    rows={3}
                    value={form.additionalInfo} 
                    onChange={e => setForm({...form, additionalInfo: e.target.value})} 
                    placeholder="Aliases, past interactions, dates, alternate handles, or notes..."
                    className="bg-slate-950 border-slate-800 text-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Evidence */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">3. Evidence & Document Uploads</h2>
                <p className="text-xs text-slate-400">Attach screenshots, chat logs, transaction receipts, or reference documents (JPG, PNG, PDF, TXT up to 10MB each).</p>

                <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-950/40">
                  <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white mb-1">Click to upload or drag files here</p>
                  <p className="text-xs text-slate-400 mb-4">Supported: JPG, PNG, PDF, TXT (Max 10MB)</p>
                  
                  <Input 
                    type="file" 
                    onChange={handleFileUpload} 
                    accept=".jpg,.jpeg,.png,.pdf,.txt"
                    className="max-w-xs mx-auto bg-slate-900 border-slate-800 text-xs file:bg-cyan-600 file:text-white file:border-0 file:rounded-md cursor-pointer"
                  />
                  {uploading && <div className="mt-3 flex items-center justify-center gap-2 text-xs text-cyan-400"><Loader2 className="w-4 h-4 animate-spin" /> Uploading secure file...</div>}
                </div>

                {form.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Attached Files ({form.attachments.length})</h3>
                    <div className="space-y-2">
                      {form.attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-950 border border-slate-800 px-4 py-3 rounded-lg text-xs">
                          <span className="font-mono text-cyan-300 truncate max-w-xs">{att.filename}</span>
                          <span className="text-slate-400">{(att.size / 1024).toFixed(1)} KB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">4. Review & Lawful Consent</h2>
                
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-900 pb-3">
                    <div>
                      <span className="text-slate-400 block">Contact Method:</span>
                      <span className="font-semibold text-white">{form.contactMethod} ({form.contactValue})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Target Platform:</span>
                      <span className="font-semibold text-white">{form.targetPlatform || "N/A"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Investigation Goal:</span>
                    <p className="text-slate-200 mt-1 bg-slate-900 p-3 rounded-lg leading-relaxed">{form.goal}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Attached Evidence:</span>
                    <span className="font-semibold text-white">{form.attachments.length} file(s) attached</span>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-bold block mb-1 text-amber-300">Lawful Compliance Notice</span>
                    By submitting this request, you certify that the information provided is accurate and that investigations will be conducted using lawfully accessible public sources and digital intelligence protocols.
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox 
                    id="consent" 
                    checked={form.consent} 
                    onCheckedChange={(c) => setForm({...form, consent: c === true})}
                  />
                  <Label htmlFor="consent" className="text-xs text-slate-300 cursor-pointer">
                    I agree to the terms, privacy policy, and lawful investigation consent conditions *
                  </Label>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} className="border-slate-700 bg-slate-900 text-slate-200">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : <div />}

              {step < 4 ? (
                <Button type="button" onClick={nextStep} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
                  Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending || !form.consent}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8"
                >
                  {submitMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Transmitting...</> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Submit Investigation Request</>}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
