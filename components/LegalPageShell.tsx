import React from "react";

type Section = {
  title: string;
  body: React.ReactNode;
};

type FaqItem = {
  q: string;
  a: React.ReactNode;
};

type Props = {
  title: string;
  updatedAt?: string;
  sections: Section[];
  faqTitle?: string;
  faq?: FaqItem[];
  footerNote?: string;
};

export default function LegalPageShell({
  title,
  updatedAt,
  sections,
  faqTitle = "Domande frequenti",
  faq,
  footerNote,
}: Props) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <main className="mx-auto w-full max-w-3xl space-y-10 px-4 py-12 md:px-8 md:py-16">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
          {updatedAt && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 md:text-base">
              Ultimo aggiornamento: {updatedAt}
            </p>
          )}
        </header>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-slate-950/40">
          {sections.map((s, i) => (
            <div key={i} className="space-y-2">
              <h2 className="text-lg font-semibold tracking-tight">{s.title}</h2>

              <div className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
                {s.body}
              </div>

              {i !== sections.length - 1 && (
                <div className="h-px bg-slate-200 dark:bg-slate-800" />
              )}
            </div>
          ))}
        </section>

        {faq && faq.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold tracking-tight">{faqTitle}</h2>

            <div className="mt-4 space-y-3">
              {faq.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-semibold">{item.q}</span>
                    <span className="text-xs text-slate-500 group-open:hidden dark:text-slate-400">
                      +
                    </span>
                    <span className="hidden text-xs text-slate-500 group-open:inline dark:text-slate-400">
                      –
                    </span>
                  </summary>

                  <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 md:text-base">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {footerNote && (
          <footer className="text-xs text-slate-500 dark:text-slate-500">
            {footerNote}
          </footer>
        )}
      </main>
    </div>
  );
}
