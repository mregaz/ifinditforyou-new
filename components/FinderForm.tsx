"use client";

import { useState } from "react";

type FinderFormProps = {
  onClose: () => void;
};

export default function FinderForm({ onClose }: FinderFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg("Errore nell'invio.");
      } else {
        // chiudiamo SUBITO
        onClose();
      }
    } catch (err) {
      setErrorMsg("Errore di rete.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-md rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
        <h2 className="text-xl font-bold mb-2">Vuoi che te lo mandi via email?</h2>
        <p className="text-slate-300 text-sm mb-4">
          L&apos;AI non ha trovato un risultato preciso. Posso cercarlo manualmente e inviartelo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Descrivi brevemente cosa cerchi..."
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm min-h-[90px]"
          />
          {errorMsg && <p className="text-orange-400 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-500 hover:bg-purple-600 py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Invio..." : "Inviami la richiesta"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-slate-300 hover:text-white"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}

