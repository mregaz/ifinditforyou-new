import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy | iFindItForYou",
  description:
    "Information on how iFindItForYou processes personal data and user searches.",
};

export default function PrivacyPageEn() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Privacy policy</h1>

      <p className="mb-4 text-sm text-slate-600">
        Last updated: <strong>3 November 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          This page explains how <strong>iFindItForYou</strong> collects and
          uses personal data of users who access the service.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          1. Data controller
        </h2>
        <p>
          The data controller is the operator of the iFindItForYou service. The
          contact details are provided on the contact page of the website.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          2. Types of data processed
        </h2>
        <p>
          When you use the service we may process the following categories of
          data:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>basic identification data (e.g. email address);</li>
          <li>
            the content of the requests you type into the search field;
          </li>
          <li>
            technical browsing data (e.g. IP address, browser type, usage logs)
            collected automatically.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          3. Purposes of processing
        </h2>
        <p>Data are processed for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>to provide the search service requested by the user;</li>
          <li>
            to manage accounts, Free and PRO plans and billing via Stripe;
          </li>
          <li>
            to improve the service and analyse usage in an aggregated form;
          </li>
          <li>
            to comply with legal obligations and respond to requests from
            competent authorities.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          4. Legal basis
        </h2>
        <p>
          Data are mainly processed on the basis of contract performance (Art. 6
          (1)(b) GDPR) and the controller’s legitimate interest in improving the
          service (Art. 6 (1)(f) GDPR). Where consent is required, it will be
          requested explicitly.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          5. Data retention
        </h2>
        <p>
          Data are stored for as long as necessary to provide the service and to
          comply with legal obligations. Searches may be anonymised or
          aggregated for statistical purposes.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. Sharing with third parties
        </h2>
        <p>
          Some data may be shared with third-party providers that help us
          deliver the service, for example:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>payment provider (Stripe);</li>
          <li>infrastructure and hosting provider;</li>
          <li>analytics and monitoring tools in aggregated form.</li>
        </ul>
        <p>
          These parties act as data processors under agreements that comply with
          GDPR requirements.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. Data subject rights
        </h2>
        <p>
          Under applicable law you may exercise your rights of access,
          rectification, erasure, restriction, objection and data portability,
          within the limits established by law. To exercise these rights, you
          can contact us using the address provided on the contact page.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          8. Changes to this policy
        </h2>
        <p>
          This privacy policy may be updated from time to time. In case of
          material changes, we will inform you through the website or by email.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. All rights reserved.
      </div>
    </main>
  );
}
