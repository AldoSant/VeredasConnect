import Link from "next/link";
import { Suspense } from "react";
import { GoogleButton } from "@/components/auth/google-button";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-1 text-center">
				<h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
				<p className="text-sm text-white/50">Sign in to your account to continue</p>
			</div>

			{/* Google Button */}
			<GoogleButton />

			{/* Divider */}
			<div className="flex items-center gap-3">
				<div className="h-px flex-1 bg-white/10" />
				<span className="text-xs font-medium text-white/40 uppercase tracking-widest">or</span>
				<div className="h-px flex-1 bg-white/10" />
			</div>

			{/* Email/password form */}
			<Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-white/5" />}>
				<LoginForm />
			</Suspense>

			{/* Footer */}
			<p className="text-center text-sm text-white/40">
				Don&apos;t have an account?{" "}
				<Link
					href="/signup"
					className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
				>
					Sign up for free
				</Link>
			</p>
		</div>
	);
}
