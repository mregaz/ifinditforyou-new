"use client";

import React, { useState } from "react";

type FinderFormProps = {
  onClose: () => void;
};

export default function FinderForm({ onClose }: FinderFormProps) {
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, query }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur.");
      } else {
        // ✅ chiudi il popup
        onClose();
      }
    } catch (err) {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-slate-900/90 rounded-2xl p-6 border border-slate-700 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-2">
        Tu veux que je te l’envoie par e-mail ?
      </h2>
      <p className="text-slate-300 text-sm mb-4">
        Je peux chercher plus en détail et te l’envoyer automatiquement.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="ton@email.com"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          required
          rows={3}
          placeholder="Décris ce que tu cherches…"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-60 text-white font-semibold py-2 rounded-xl transition"
        >
          {loading ? "Envoi en cours..." : "Envoyer la demande"}
        </button>
      </form>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 text-slate-300 text-sm underline hover:text-white"
      >
        Fermer
      </button>
    </div>
  );
}

