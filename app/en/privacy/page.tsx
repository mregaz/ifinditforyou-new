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

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">1. Data We Collect</h2>
      <p>
        We may collect the following data: contact details (such as your email),
        messages you send via the contact form, and technical data needed to operate
        the website.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
        2. Purpose of Processing
      </h2>
      <p>We use your data to reply to your requests, improve the service and ensure security.</p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
        3. Data Sharing
      </h2>
      <p>
        We do not sell your data. We may share it only with service providers strictly necessary
        to operate the platform (e.g. email provider).
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
        4. Your Rights
      </h2>
      <p>
        You can request access, correction or deletion of your personal data by writing to{" "}
        <a
            href="mailto:info@ifinditforyou.com"
            className="text-blue-400 underline hover:text-blue-300"
          >
            info@ifinditforyou.com
          </a>.
      </p>

      <div className="mt-12 text-sm text-gray-400 border-t border-gray-700 pt-6">
        <p>© 2025 iFindItForYou.</p>
      </div>
    </main>
  );
}

