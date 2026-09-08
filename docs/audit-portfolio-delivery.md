# Audit portfolio and delivery — 8 September 2026

## Calculation scope

The user enters an exact integer property count within the selected range (1, 2–4, 5–15, 16+). No midpoint such as 18 is inferred from 16+. Multi-property selection requires a count before continuing.

The remaining questions describe one representative property. Nightly rate, occupancy, floor area, availability and annual operating costs are **per property**. The public preview and final report show portfolio totals and retain a separate per-property breakdown.

- Gross revenue, annual costs, owner net, gain, low/high scenarios and sold property-nights scale with count.
- Nightly rate, occupancy, channel fee rates and AUREVIA commission (25%) do not scale.
- The 70% occupancy and future blended 8% distribution costs are user-provided operating assumptions, not observed market performance or guarantees.
- Net is before tax. Per-property rounded net is multiplied by count so its breakdown reconciles exactly.
- Monthly average is total annual gross divided by 12, rounded once.
- The location and property assumptions apply to every property in this extrapolation. This is **not** an individual valuation of heterogeneous properties. Differences in neighbourhood, type, calendar and costs require follow-up during the appointment. This caveat is visible in all three languages.
- Negative net results are preserved. Executive findings separate the additional-night and pricing contributions to gross revenue, rather than claiming a net improvement unconditionally.

## Shared declared-rate scenario and channel costs (v6)

The public simulator and audit call `calculateRevenueOptimization` from `lib/simulator.ts`. Pricing now uses the owner's declared rate multiplied by 1.20, rounded to cents. It is a fixed uplift, not a cap on a separate property estimate. Locality, standing and amenity coefficients never stack onto this rate. Without a declared current rate, the existing unvalidated property/locality launch reference is retained without a further uplift. Target occupancy remains AUREVIA's stated 70%. No joint price/occupancy calibration is available. Both apps round sold nights to the nearest whole night.

Arithmetic example, not a market observation: seven properties represented by one home in Nervi, a declared €160 nightly rate and 40% occupancy over 365 available nights. Current gross is €23,360 per property (146 nights), or €163,520 total. The scenario is €192 ×256 = €49,152 per property, or €344,064 total. The local €190 reference does not enter that calculation or appear as a competing price in the public report. Gross and net can stagnate or fall with high historical occupancy; signed revenue-driver contributions are preserved.

Airbnb-only, Booking-only, direct-only, several platforms and direct-plus-platforms remain distinct choices. Selecting a channel is sufficient to continue: costs are optional and their editor is collapsed by default. “Préciser mes frais” opens one optional owner-declared average booking-fee percentage (commissions and payment fees divided by accommodation revenue, excluding management). Owners who want precision can explicitly open the per-channel breakdown: shares then refer to revenue, must sum to 100%, and every active channel needs an effective fee. An explicit zero is accepted. The owner can defer even a partially completed breakdown; its inputs are unmounted so native validation cannot trap them. Changing the channel selection switches back to unknown costs; old averages are cleared and retained detailed values are ignored unless explicitly reselected. Legacy detailed answers remain readable.

Missing fees do not become zero or 8%: current gross and future projections remain available, while current net and net gain stay unknown until actual costs are supplied. Average and detailed costs are mutually exclusive; they are never stacked. The internal dossier records the selected input mode and evidence basis, and includes only the applied average or breakdown. Historical rate, occupancy and annual costs start blank. Private pools, shared pools and jacuzzis are distinguished for the review; they do not change the +20% rule. Only the launch fallback retains the inherited private-pool coefficient.

Current revenue uses declared current occupancy, not target occupancy. Every rented property accepts an editable current management rate from 0% to 50%, including decimal percentages and primarily self-managed properties. Zero means no management fee; the declared rate is deducted from current gross alongside separately entered platform fees. Not-yet-rented properties have zero current occupancy, revenue and percentage management commission. Both future commissions currently use gross revenue; the contractual base of AUREVIA's 25% remains to be confirmed.

The performance step explicitly distinguishes available rental history from a not-yet-rented property. Owners can change this choice without losing their entries. In history mode, nightly rate, occupancy and management fees remain editable, regardless of earlier launch/listing answers. Without history, those fields are hidden rather than forced to disabled zeroes; only annual costs are requested. An active/managed property without a current listing retains its history, but unknown historical channel costs leave current net and net gain unavailable, never silently commission-free. The internal dossier retains the history flag.

Public and internal monthly plans share the same allocation and reconcile to annual nights and revenue, including cent amounts. The calendar is indicative, not observed bookings or a validated seasonal pricing strategy. Stored reports must carry calculation version `declared-rate-plus-20-v6`; older uncapped results are not displayed as updated reports. The internal dossier contains channel shares and costs, exact shared optimization output, signed revenue drivers, pool type and explicit evidence gaps. Sensitivity bands are ±25% for the existing Nervi district scenario and ±35% for locality fallback; they are conventions, not statistical confidence intervals.

## Visitor and internal delivery

The priorities question accepts one or several choices (revenue, free time, property care, several properties), with at least one required. New sessions retain an array; older single-string answers remain readable. Every selected priority contributes to the relevant recommendation, without multiplying financial forecasts. The internal qualification and call-preparation sections retain the complete code-and-label list; the contact summary lists all selected labels, without inventing a primary ranking.

The contact form posts the complete dossier to the existing valuation endpoint. For audits, internal inbox storage and the existing team email notification are independent: at least one must confirm reception. The visitor is never an email recipient; their address is only the reply-to address on the team notification.

On confirmed reception, a display copy passes to `/audit/grazie`, headed “Voici votre audit” in French. It retains the requested private strategy sections and booking call-to-action. Session storage is only a convenience for displaying/reloading this copy, not the authoritative lead record. Blocked storage does not break the in-app handoff. Missing or legacy sessions show an invitation to complete the questionnaire, never fictitious sample figures.

The internal dossier contains exact count, total results, per-property results, declared inputs, geography, assumptions, monthly plan and call-preparation material. If neither inbox nor team email confirms receipt, the form reports failure and does not announce that AUREVIA received it.

Full audit emails are addressed server-side to **contatto@aurevia-genova.com**, independently of `CONTACT_RECIPIENT` for ordinary forms and of any client-supplied recipient. Their subject is `Audit complet AUREVIA — Prénom Nom`. Contact details appear first; the complete report, including all private sections and all selected priorities, is included in both HTML and plain text. Null values remain explicitly unknown, not zero. The visitor is only the reply-to address and continues to open the public report on the site.

Real email requires `RESEND_API_KEY` in the server environment and a verified sending domain matching `CONTACT_FROM` (default `AUREVIA <contact@aurevia-genova.com>`). Configure local credentials only in ignored environment files; hosted credentials belong in Sites secrets, never the hosting manifest or source. At the 8 September 2026 check, no Resend key was present locally or in the hosted site's environment. Sending is therefore **not activated or delivery-verified**. A missing key is explicitly logged; inbox-only success is not evidence that an email was sent. A Resend message ID confirms provider acceptance, not arrival in the destination mailbox. No real test email has been sent, and these changes have not been published.

The HTML/plain-text payload follows the [Resend Send Email API](https://resend.com/docs/api-reference/emails/send-email). Verify an approved test message in the destination mailbox after configuring sending and publishing; do not use a real prospect for that test.

## Public report and appointment prompts

The final report invites visitors to speak with AUREVIA in the opening section and again beside the financial comparison, reserved operational topics and strategic appendix. All appointment CTAs navigate in the same tab to `/audit/appuntamento`, a dedicated AUREVIA page with the existing logo, language menu and concise Italian/French/English copy. Internal client-side navigation preserves the in-memory audit handoff when session storage is unavailable.

The appointment page embeds `NEXT_PUBLIC_BOOKING_URL`, defaulting to the user-provided `https://calendly.com/antoinedavid/contatto`. A direct Calendly link appears before the iframe and opens a new tab with `noopener noreferrer` as a fallback. Visitors can return to their audit; the calendar itself requires no stored audit. No contact data is added to the calendar URL, the iframe suppresses the referrer, and no appointment is booked automatically. The contact-page fallback is removed. Duration and booking confirmation are left to Calendly rather than promising an unverified 20-minute slot. The iframe follows [Calendly’s documented integration](https://calendly.com/help/how-to-embed-calendly-with-an-iframe); Calendly’s own cookie controls are not hidden.

Annual gross, estimated net, current performance, fees, assumptions and per-property/portfolio totals remain visible without booking. Quarterly revenue totals provide a useful seasonal overview. The monthly breakdown, two operational details and two action-plan details are reserved for the conversation, with visible topic descriptions. Redaction graphics are decorative and noninteractive; hidden prose is not rendered behind the blur. These presentation gates are not an access-control mechanism. The full dossier sent to AUREVIA is unchanged, and no market-validated strategy is claimed to be ready when it still requires review.

## Verification and limits

Run `node --test tests/audit-location.test.mjs tests/audit-navigation.test.mjs tests/audit-delivery.test.mjs tests/audit-session.test.mjs tests/audit-report.test.mjs tests/audit-appointment.test.mjs`.

Tests cover counts 3, 12, 16 and 37, invalid counts, no double-scaling of rates, negative net, neighbourhood differentiation, full internal payload, visitor-not-recipient, independent channel failures, and display-session transfer/reload/failure modes. Delivery tests use mocks; they send no real email. Actual inbox/mail reception must be checked in the deployed environment with its configured database and mail credentials. This change does not publish the local preview.

Appointment tests render the actual page in all three languages and verify the internal CTA destination, exact default calendar URL, accessible iframe, direct fallback, no appended contact data and route access without a saved audit. They do not validate live Calendly availability or make a test booking.
