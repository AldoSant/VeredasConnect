import Link from "next/link";
import { GoogleButton } from "@/components/auth/google-button";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-1 text-center">
				<h1 className="text-2xl font-bold tracking-tight text-[#251b12]">
					Crie sua identidade premium
				</h1>
				<p className="text-sm text-[#251b12]/50">
					Reserve seu endereço e publique uma presença elegante.
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

			{/* Signup form */}
			<SignupForm />

			{/* Footer */}
			<p className="text-center text-sm text-[#251b12]/40">
				Já tem conta?{" "}
				<Link
					href="/login"
					className="font-semibold text-[#9a6a2f] transition-colors hover:text-[#6d471f]"
				>
					Entrar
				</Link>
			</p>
		</div>
	);
}
