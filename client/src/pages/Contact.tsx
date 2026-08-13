import React, { useState } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Shield, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const submitMessage = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Contact message transmitted successfully.");
    },
    onError: error => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMessage.mutate(form);
  };

  return (
    <PublicLayout>
      <div className="py-16 container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>SECURE COMMUNICATIONS</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Contact Our Operations Desk</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Reach out for general inquiries, media relations, or partnership opportunities. For active investigations, please use our secure request wizard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Secure Signal</h3>
              <p className="text-xs text-slate-400">Encrypted communications available upon initial intake review.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Operations Desk</h3>
              <p className="text-xs text-slate-400 font-mono">ops@aegis-intelligence.example</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Response Time</h3>
              <p className="text-xs text-slate-400">Within 12 to 24 hours for verified inquiries.</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Transmitted</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you for reaching out. Our operations desk will review your message and respond accordingly.
                </p>
                <Button onClick={() => setSubmitted(false)} className="mt-4 bg-slate-800 hover:bg-slate-700 text-slate-200">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-200 text-xs uppercase tracking-wider">Your Name / Alias *</Label>
                    <Input 
                      id="name" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                      placeholder="Operator or Client"
                      className="bg-slate-950 border-slate-800 text-white" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200 text-xs uppercase tracking-wider">Contact Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                      placeholder="client@secure.domain"
                      className="bg-slate-950 border-slate-800 text-white" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-200 text-xs uppercase tracking-wider">Subject</Label>
                  <Input 
                    id="subject" 
                    value={form.subject} 
                    onChange={e => setForm({...form, subject: e.target.value})} 
                    placeholder="General Inquiry / Partnership"
                    className="bg-slate-950 border-slate-800 text-white" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-200 text-xs uppercase tracking-wider">Message *</Label>
                  <Textarea 
                    id="message" 
                    rows={5}
                    value={form.message} 
                    onChange={e => setForm({...form, message: e.target.value})} 
                    placeholder="Enter your inquiry details..."
                    className="bg-slate-950 border-slate-800 text-white resize-none" 
                    required
                  />
                </div>

                <Button type="submit" disabled={submitMessage.isPending} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-6">
                  <Send className="w-4 h-4 mr-2" /> {submitMessage.isPending ? "Transmitting…" : "Transmit Secure Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
