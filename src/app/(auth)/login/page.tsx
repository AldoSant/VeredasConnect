import Link from "next/link";
import { Suspense } from "react";
import { GoogleButton } from "@/components/auth/google-button";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-1 text-center">
				<h1 className="text-2xl font-bold tracking-tight text-[#251b12]">
					Acesse sua presença premium
				</h1>
				<p className="text-sm text-[#251b12]/50">
					Entre para ajustar sua página, links e contatos.
				</p>
			</div>

			{/* Google Button */}
			<GoogleButton />

			{/* Divider */}
			<div className="flex items-center gap-3">
				<div className="h-px flex-1 bg-[#eadcc5]" />
				<span className="text-xs font-medium text-[#251b12]/40 uppercase tracking-widest">ou</span>
				<div className="h-px flex-1 bg-[#eadcc5]" />
			</div>

			{/* Email/password form */}
			<Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-white/5" />}>
				<LoginForm />
			</Suspense>

			{/* Footer */}
			<p className="text-center text-sm text-[#251b12]/40">
				Ainda não tem conta?{" "}
				<Link
					href="/signup"
					className="font-semibold text-[#9a6a2f] transition-colors hover:text-[#6d471f]"
				>
					Criar conta
				</Link>
			</p>
		</div>
	);
}
