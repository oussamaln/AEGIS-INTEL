import React from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, HelpCircle } from "lucide-react";

export default function FAQ() {
  return (
    <PublicLayout>
      <div className="py-16 container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Everything you need to know about our investigation process, data security, payment methods, and refund policies.
          </p>
        </div>

        <div className="space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-slate-900/60 border border-slate-800 rounded-xl px-6">
              <AccordionTrigger className="text-white font-semibold hover:text-cyan-400 py-4 text-left">
                How does the investigation request and review process work?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-sm leading-relaxed pb-4">
                When you submit an investigation request through our secure wizard, you receive a unique reference code (e.g., #OSINT-A1B2C3). Our senior operators review your target information and investigation goals within 24 hours. We then contact you via your preferred method (WhatsApp, Telegram, email, etc.) to discuss scope, pricing, and payment instructions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-slate-900/60 border border-slate-800 rounded-xl px-6">
              <AccordionTrigger className="text-white font-semibold hover:text-cyan-400 py-4 text-left">
                How are payments handled?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-sm leading-relaxed pb-4">
                For MVP version 1, payments are coordinated securely through cryptocurrency (USDT, BTC, ETH) or other agreed manual channels after our operators review and price your case. Once payment is confirmed by our team, the case moves into active investigation status.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-slate-900/60 border border-slate-800 rounded-xl px-6">
              <AccordionTrigger className="text-white font-semibold hover:text-cyan-400 py-4 text-left">
                How is my evidence and personal data protected?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-sm leading-relaxed pb-4">
                All submitted files (JPG, PNG, PDF, TXT) and case notes are stored in private, encrypted object storage accessible solely by authenticated staff operators. We maintain strict confidentiality and never expose client details or internal files publicly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-slate-900/60 border border-slate-800 rounded-xl px-6">
              <AccordionTrigger className="text-white font-semibold hover:text-cyan-400 py-4 text-left">
                What is your refund policy?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-sm leading-relaxed pb-4">
                Intelligence investigations rely on publicly available data and digital footprints. While our operators use advanced OSINT methodologies, results depend on available data. If an investigation cannot be initiated or completed due to lack of public records or technical infeasibility, our operators will officially mark the case refunded and record the detailed reason.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-slate-900/60 border border-slate-800 rounded-xl px-6">
              <AccordionTrigger className="text-white font-semibold hover:text-cyan-400 py-4 text-left">
                How do I receive my final report?
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-sm leading-relaxed pb-4">
                Upon completion of the investigation, our operators compile a comprehensive PDF intelligence dossier containing verified findings and evidence. The report is securely delivered to you via your preferred contact channel or communicated through your case reference.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </PublicLayout>
  );
}
