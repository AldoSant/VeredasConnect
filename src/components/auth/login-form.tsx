"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { safeInternalPath } from "@/lib/paths";

const inputClass =
	"w-full rounded-xl border border-[#eadcc5] bg-white/80 px-4 py-3 text-sm text-[#251b12] placeholder:text-[#251b12]/30 outline-none transition-all focus:border-[#b98e45] focus:ring-2 focus:ring-[#c9a86a]/20 backdrop-blur-sm";

const labelClass = "block text-xs font-medium text-[#6a5845] mb-1.5 tracking-wide";

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = safeInternalPath(searchParams?.get("callbackUrl"));

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (res?.error) {
				setError("E-mail ou senha inválidos");
				setLoading(false);
				return;
			}

			router.push(callbackUrl);
			router.refresh();
		} catch {
			setError("Não foi possível entrar. Tente novamente.");
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="email" className={labelClass}>
					Email
				</label>
				<input
					id="email"
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					aria-label="Email"
					autoComplete="email"
					className={inputClass}
				/>
			</div>

			<div>
				<label htmlFor="password" className={labelClass}>
					Senha
				</label>
				<input
					id="password"
					type="password"
					placeholder="Sua senha"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					aria-label="Password"
					autoComplete="current-password"
					className={inputClass}
				/>
			</div>

			{error && (
				<p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center text-sm text-red-600">
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full rounded-xl bg-[#2c2117] px-4 py-3 text-sm font-semibold text-[#fffaf1] transition-all hover:bg-[#3b2a1d] active:scale-[0.98] disabled:opacity-60"
			>
				{loading ? "Entrando…" : "Entrar"}
			</button>
		</form>
	);
}
