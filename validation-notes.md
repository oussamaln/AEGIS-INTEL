# Validation Notes

## 2026-08-13 — Pricing and Contact Inbox Update

- The public pricing page displays **$34.99**, **$94.99**, and **$194.99** for the three fixed-price tiers. No card displays a price-range label.
- The authenticated administrator dashboard displays the protected contact inbox with a keyword-search field, **All / New / Read / Replied / Archived** filters, a mail-client reply action, and a persisted **Replied** status with timestamp.
- Status actions were refined so a replied or archived enquiry cannot be accidentally moved back to the earlier **Read** step.
- TypeScript validation completed successfully. The final full Vitest suite passed: 5 files and 17 tests, including presentation-contract coverage for the exact prices, absence of range labels, contact-inbox controls, and reply action.
