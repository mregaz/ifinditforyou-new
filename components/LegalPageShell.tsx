import React from "react";

type FaqItem = {
  q: string;
  a: React.ReactNode;
};

type Section = {
  title: string;
  body: React.ReactNode;
};

type LegalPageShellProps = {
  title: string;
  updatedAt?: string;
  intro?: React.ReactNode;
  sections?: Section[];
  faqTitle?: string;
  faq?: FaqItem[];
  footerNote?: React.ReactNode;
};

export default function LegalPageShell({
  title,
  updatedAt,
  intro,
  sections = [],
  faqTitle = "Domande frequenti",
  faq = [],
  footerNote,
}: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>

          {updatedAt && (
            <p className="mt-3 text-sm text-slate-300 md:text-base">
              Ultimo aggiornamento: {updatedAt}
            </p>
          )}

          {intro && (
            <div className="mt-4 text-sm text-slate-300 md:text-base">
              {intro}
            </div>
          )}
        </header>

        {sections.length > 0 && (
          <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-slate-950/40">
            {sections.map((s, i) => (
              <div key={i}>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold tracking-tight">
                    {s.title}
                  </h2>
                  <div className="text-sm text-slate-300 md:text-base">
                    {s.body}
                  </div>
                </div>

                {i < sections.length - 1 && (
                  <div className="mt-6 h-px bg-slate-800" />
                )}
              </div>
            ))}
          </section>
        )}

        {faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight">{faqTitle}</h2>

            <div className="mt-4 space-y-3">
              {faq.map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border border-slate-800 bg-slate-900/40 p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-semibold text-slate-50">{item.q}</span>
                    <span className="text-xs text-slate-400 group-open:hidden">
                      +
                    </span>
                    <span className="hidden text-xs text-slate-400 group-open:inline">
                      –
                    </span>
                  </summary>
                  <div className="mt-2 text-sm text-slate-300 md:text-base">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {footerNote && (
          <footer className="mt-10 text-xs text-slate-500">{footerNote}</footer>
        )}
      </main>
    </div>
  );
}

