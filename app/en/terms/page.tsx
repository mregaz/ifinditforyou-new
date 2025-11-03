// app/en/terms/page.tsx

export const metadata = {
  title: "Terms and Conditions | iFindItForYou",
  description:
    "Read the terms and conditions for using iFindItForYou. Learn how we manage data and what your rights are as a user.",
};

export default function TermsPageEn() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-white">Terms and Conditions</h1>

      <p className="mb-6 text-gray-300">
        Last updated: <strong>November 3, 2025</strong>
      </p>

      <section className="space-y-6">
        <p>
          Welcome to <strong>iFindItForYou</strong>! By using our website and the
          related services, you agree to the terms and conditions described below.
          Please read them carefully before using the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          1. Purpose of the Service
        </h2>
        <p>
          iFindItForYou provides a search and content optimization service. Our goal
          is to deliver accurate and relevant results based on the user’s input and
          preferences.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          2. Use of the Service
        </h2>
        <p>
          You agree to use the service lawfully and in compliance with applicable
          regulations. You must not use the website for illegal, defamatory or
          harmful activities.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          3. Accounts and Security
        </h2>
        <p>
          If the service requires an account, you are responsible for keeping your
          credentials confidential and for all activities carried out through your
          account.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          4. Intellectual Property
        </h2>
        <p>
          All content on this website, including texts, images, logos and trademarks,
          is owned by iFindItForYou or by their respective rights holders. Any
          unauthorized reproduction is prohibited.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          5. Limitation of Liability
        </h2>
        <p>
          iFindItForYou does not guarantee that the service will always be available
          or error-free. We shall not be liable for any damages arising from the use
          or inability to use the website.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          6. Privacy and Data Protection
        </h2>
        <p>
          For information on how we process your personal data, please read our{" "}
          <a href="/en/privacy" className="text-blue-400 underline hover:text-blue-300">
            Privacy Policy
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          7. Changes to These Terms
        </h2>
        <p>
          iFindItForYou may update these Terms and Conditions at any time. Changes
          will be published on this page with the date of the latest update.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          8. Contact
        </h2>
        <p>
          For any questions about these Terms and Conditions, please contact us at:{" "}
          <a
            href="mailto:info@ifinditforyou.com"
            className="text-blue-400 underline hover:text-blue-300"
          >
            info@ifinditforyou.com
          </a>
          .
        </p>
      </section>

      <div className="mt-12 text-sm text-gray-400 border-t border-gray-700 pt-6">
        <p>© 2025 iFindItForYou. All rights reserved.</p>
      </div>
    </main>
  );
}

