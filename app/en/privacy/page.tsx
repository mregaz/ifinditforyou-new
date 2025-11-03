// app/en/privacy/page.tsx

export const metadata = {
  title: "Privacy Policy | iFindItForYou",
  description: "How iFindItForYou collects, uses and protects your personal data.",
};

export default function PrivacyEn() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-white">Privacy Policy</h1>

      <p className="mb-6 text-gray-300">
        Last updated: <strong>November 3, 2025</strong>
      </p>

      <p className="mb-6">
        This Privacy Policy explains how <strong>iFindItForYou</strong> (“we”, “us”)
        collects and processes your personal data when you use our website and
        services.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">1. Data we collect</h2>
      <p>
        We may collect: your contact details (such as email), the content of messages
        you send us via forms, and technical data strictly necessary to operate the
        website.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
        2. Why we process your data
      </h2>
      <p>
        We process your personal data to reply to your requests, improve the service,
        and ensure the security of the platform.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
        3. Sharing of data
      </h2>
      <p>
        We do not sell your personal data. We may share it only with trusted service
        providers (for example email or hosting providers) and only for the purposes
        listed above.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">4. Your rights</h2>
      <p>
        You can ask to access, correct or delete your personal data by contacting us
        at{" "}
        <a
          href="mailto:info@ifinditforyou.com"
          className="text-blue-400 underline hover:text-blue-300"
        >
          info@ifinditforyou.com
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
        5. Changes to this policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. If we do, we will update
        the date at the top of this page.
      </p>

      <div className="mt-12 text-sm text-gray-400 border-t border-gray-700 pt-6">
        <p>© 2025 iFindItForYou. All rights reserved.</p>
      </div>
    </main>
  );
}

