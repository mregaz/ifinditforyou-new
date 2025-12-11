// app/en/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | iFindItForYou",
  description: "Read the terms of service for using iFindItForYou.",
};

export default function TermsPageEn() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4 text-sm text-slate-600">
        Last updated: <strong>3 November 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          Welcome to <strong>iFindItForYou</strong>. By using this website and
          its related services, you agree to the following Terms of Service.
          Please read them carefully before using the platform.
        </p>

        <h2 className="text-xl font-semibold mt-6">1. Service description</h2>
        <p>
          iFindItForYou provides an assisted search service that combines AI
          tools and, where needed, human review to deliver filtered and
          summarised results based on your request.
        </p>

        <h2 className="text-xl font-semibold mt-6">2. Permitted use</h2>
        <p>
          You may use the service only for lawful and personal purposes. You
          must not use iFindItForYou for illegal, misleading or harmful
          activities, or in ways that may damage third parties or the service
          itself.
        </p>

        <h2 className="text-xl font-semibold mt-6">3. Free plan and PRO plan</h2>
        <p>
          The <strong>Free</strong> plan offers a limited number of free
          searches. The <strong>PRO</strong> plan is subscription-based and
          allows a broader use of the service, as described on the pricing page.
          Prices may change over time; in case of relevant changes we will
          notify you appropriately.
        </p>

        <h2 className="text-xl font-semibold mt-6">4. Payments and billing</h2>
        <p>
          Payments for the PRO plan are processed via Stripe. Payment details
          are not stored by iFindItForYou but by the payment provider. The
          subscription renews automatically at each billing period until you
          cancel it.
        </p>

        <h2 className="text-xl font-semibold mt-6">5. No advice</h2>
        <p>
          The information provided by the service is for informational purposes
          only. iFindItForYou does not provide legal, medical, financial or
          professional advice. You should always verify critical information
          with official sources or qualified professionals.
        </p>

        <h2 className="text-xl font-semibold mt-6">6. Limitation of liability</h2>
        <p>
          While we strive to provide high-quality results, we cannot guarantee
          the accuracy, completeness or timeliness of all information returned.
          iFindItForYou is not liable for any direct or indirect damages
          resulting from the use of the service.
        </p>

        <h2 className="text-xl font-semibold mt-6">7. Changes to the terms</h2>
        <p>
          We may update these Terms of Service at any time. In case of
          significant changes, we will inform you via the website or by email.
          By continuing to use the service after such changes, you accept the
          updated terms.
        </p>

        <h2 className="text-xl font-semibold mt-6">8. Contact</h2>
        <p>
          If you have any questions about these Terms of Service, you can
          contact us using the email address provided on the contact page.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. All rights reserved.
      </div>
    </main>
  );
}
