"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { apiPath } from "@/lib/paths";
import { slugSchema } from "@/lib/validations";
import { SlugInput } from "./slug-input";

const inputClass =
	"w-full rounded-xl border border-[#eadcc5] bg-white/80 px-4 py-3 text-sm text-[#251b12] placeholder:text-[#251b12]/30 outline-none transition-all focus:border-[#b98e45] focus:ring-2 focus:ring-[#c9a86a]/20 backdrop-blur-sm";

const labelClass = "block text-xs font-medium text-[#6a5845] mb-1.5 tracking-wide";

const fieldError = (msg: string) => <p className="mt-1.5 text-xs text-red-600">{msg}</p>;

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

		if (!name.trim()) newErrors.name = "Informe seu nome";
		if (!email.trim()) newErrors.email = "Informe seu e-mail";
		if (password.length < 8) newErrors.password = "A senha precisa ter pelo menos 8 caracteres";

		const slugResult = slugSchema.safeParse(slug);
		if (!slugResult.success) {
			newErrors.slug = slugResult.error.issues[0]?.message ?? "Endereço inválido";
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
			// 1. Create User via explicit NextAuth credentials signup mode
			const res = await signIn("credentials", {
				mode: "signup",
				name,
				email,
				password,
				redirect: false,
			});

			if (res?.error) {
				setErrors({ general: "Não foi possível criar a conta" });
				setLoading(false);
				return;
			}

			// 2. Create profile with slug
			const profileRes = await fetch(apiPath("/api/profile"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ slug, displayName: name }),
			});

			if (!profileRes.ok) {
				const data = await profileRes.json();
				setErrors({ general: data.error || "Não foi possível criar o perfil" });
				setLoading(false);
				return;
			}

			// 3. Redirect to editor
			router.push("/editor");
			router.refresh();
		} catch {
			setErrors({ general: "Não foi possível concluir. Tente novamente." });
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="signup-name" className={labelClass}>
					Nome
				</label>
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
				<label htmlFor="signup-email" className={labelClass}>
					Email
				</label>
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
				<label htmlFor="signup-password" className={labelClass}>
					Senha
				</label>
				<input
					id="signup-password"
					type="password"
					placeholder="Pelo menos 8 caracteres"
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
				<p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center text-sm text-red-600">
					{errors.general}
				</p>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full rounded-xl bg-[#2c2117] px-4 py-3 text-sm font-semibold text-[#fffaf1] transition-all hover:bg-[#3b2a1d] active:scale-[0.98] disabled:opacity-60"
			>
				{loading ? "Criando conta…" : "Criar conta"}
			</button>
		</form>
	);
}
