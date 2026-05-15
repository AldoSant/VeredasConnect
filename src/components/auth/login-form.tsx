"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

const inputClass =
	"w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 backdrop-blur-sm";

const labelClass = "block text-xs font-medium text-white/60 mb-1.5 tracking-wide";

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") || "/connect/editor";

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
				setError("Invalid email or password");
				setLoading(false);
				return;
			}

			router.push(callbackUrl);
			router.refresh();
		} catch {
			setError("Something went wrong. Please try again.");
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="email" className={labelClass}>Email</label>
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
				<label htmlFor="password" className={labelClass}>Password</label>
				<input
					id="password"
					type="password"
					placeholder="Your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					aria-label="Password"
					autoComplete="current-password"
					className={inputClass}
				/>
			</div>

			{error && (
				<p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-center text-sm text-red-400">
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-60"
			>
				{loading ? "Signing in…" : "Sign In"}
			</button>
		</form>
	);
}
