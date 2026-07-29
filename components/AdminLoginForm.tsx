"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    if (response.ok) {
      window.location.assign("/administration");
      return;
    }
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    setMessage(body?.error || "Connexion impossible.");
    setLoading(false);
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <div className="admin-login-mark"><LockKeyhole size={19} /></div>
      <p className="eyebrow">Accès privé</p>
      <h1>Administration</h1>
      <p className="admin-login-copy">
        Connectez-vous pour gérer les biens et consulter les demandes reçues.
      </p>
      <label>
        Identifiant
        <input name="username" autoComplete="username" required />
      </label>
      <label>
        Mot de passe
        <span className="password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
      </label>
      <div className="admin-login-options">
        <Link href="/connexion/mot-de-passe-oublie">Mot de passe oublié ?</Link>
      </div>
      <button className="button" disabled={loading}>
        {loading ? "Connexion…" : "Se connecter"}
      </button>
      <p className="admin-login-error" role="alert">{message}</p>
    </form>
  );
}
