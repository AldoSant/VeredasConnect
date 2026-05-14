import Link from "next/link";
import { GoogleButton } from "@/components/auth/google-button";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-1 text-center">
				<h1 className="text-2xl font-bold tracking-tight text-white">Claim your link</h1>
				<p className="text-sm text-white/50">Create your premium link-in-bio page in seconds</p>
			</div>

			{/* Google Button */}
			<GoogleButton />

			{/* Divider */}
			<div className="flex items-center gap-3">
				<div className="h-px flex-1 bg-white/10" />
				<span className="text-xs font-medium text-white/40 uppercase tracking-widest">or</span>
				<div className="h-px flex-1 bg-white/10" />
			</div>

			{/* Signup form */}
			<SignupForm />

			{/* Footer */}
			<p className="text-center text-sm text-white/40">
				Already have an account?{" "}
				<Link
					href="/login"
					className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
