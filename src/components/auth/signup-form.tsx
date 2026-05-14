"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { slugSchema } from "@/lib/validations";
import { SlugInput } from "./slug-input";

const inputClass =
	"w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 backdrop-blur-sm";

const labelClass = "block text-xs font-medium text-white/60 mb-1.5 tracking-wide";

const fieldError = (msg: string) => (
	<p className="mt-1.5 text-xs text-red-400">{msg}</p>
);

interface FormErrors {
	name?: string;
	email?: string;
	password?: string;
	slug?: string;
	general?: string;
}

export function SignupForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [slug, setSlug] = useState("");
	const [errors, setErrors] = useState<FormErrors>({});
	const [loading, setLoading] = useState(false);

	const validate = (): boolean => {
		const newErrors: FormErrors = {};

		if (!name.trim()) newErrors.name = "Name is required";
		if (!email.trim()) newErrors.email = "Email is required";
		if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

		const slugResult = slugSchema.safeParse(slug);
		if (!slugResult.success) {
			newErrors.slug = slugResult.error.issues[0]?.message ?? "Invalid username";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);
		setErrors({});

		try {
			// 1. Create User via NextAuth credentials (auto-register)
			const res = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (res?.error) {
				setErrors({ general: "Failed to create account" });
				setLoading(false);
				return;
			}

			// 2. Create profile with slug
			const profileRes = await fetch("/api/profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ slug, displayName: name }),
			});

			if (!profileRes.ok) {
				const data = await profileRes.json();
				setErrors({ general: data.error || "Failed to create profile" });
				setLoading(false);
				return;
			}

			// 3. Redirect to editor
			router.push("/editor");
			router.refresh();
		} catch {
			setErrors({ general: "Something went wrong. Please try again." });
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="signup-name" className={labelClass}>Your Name</label>
				<input
					id="signup-name"
					type="text"
					placeholder="Ana Silva"
					value={name}
					onChange={(e) => setName(e.target.value)}
					aria-label="Name"
					autoComplete="name"
					className={inputClass}
				/>
				{errors.name && fieldError(errors.name)}
			</div>

			<div>
				<label htmlFor="signup-email" className={labelClass}>Email</label>
				<input
					id="signup-email"
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					aria-label="Email"
					autoComplete="email"
					className={inputClass}
				/>
				{errors.email && fieldError(errors.email)}
			</div>

			<div>
				<label htmlFor="signup-password" className={labelClass}>Password</label>
				<input
					id="signup-password"
					type="password"
					placeholder="At least 8 characters"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					aria-label="Password"
					autoComplete="new-password"
					className={inputClass}
				/>
				{errors.password && fieldError(errors.password)}
			</div>

			<SlugInput value={slug} onChange={setSlug} error={errors.slug} />

			{errors.general && (
				<p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-center text-sm text-red-400">
					{errors.general}
				</p>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-60"
			>
				{loading ? "Creating Account…" : "Create Account"}
			</button>
		</form>
	);
}
