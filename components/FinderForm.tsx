"use client";

import React, { useState } from "react";

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
        body: JSON.stringify({
          email,
          message,
          // se nel backend ti aspetti anche la lingua:
          // lang: "it",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Errore nell’invio.");
      } else {
        // invio andato bene → chiudiamo il popup 👇
        onClose();
      }
    } catch (err) {
      setErrorMsg("Errore di rete.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-lg">
        <h2 className="mb-2 text-center text-xl font-semibold text-white">
          Vuoi che te lo mandi via email?
        </h2>
        <p className="mb-4 text-center text-slate-300 text-sm">
          L’AI non ha trovato un risultato preciso. Posso cercarlo io e
          inviartelo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white outline-none"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Descrivi brevemente cosa ti serve..."
            className="h-24 w-full rounded-lg bg-slate-800 px-3 py-2 text-white outline-none"
          />
          {errorMsg ? (
            <p className="text-sm text-orange-400">{errorMsg}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-500 py-2 font-medium text-white hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? "Invio..." : "Inviami la richiesta"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 block w-full text-center text-sm text-slate-300 hover:text-white"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}


