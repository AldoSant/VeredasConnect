import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fbf7ef] px-4 py-12">
			{/* Background mesh gradients — matches landing page */}
			<div className="absolute top-[-15%] left-[-10%] h-[550px] w-[550px] rounded-full bg-[#ead09a]/45 blur-[130px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#f6e4c1]/45 blur-[150px] pointer-events-none" />
			<div className="absolute top-[40%] left-[40%] h-[400px] w-[400px] rounded-full bg-[#c9d7bb]/30 blur-[150px] pointer-events-none" />

			{/* Logo */}
			<Link href="/" className="relative z-10 mb-10 flex items-center gap-2 group">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 border border-[#eadcc5] backdrop-blur-md transition-colors group-hover:bg-white/15">
					<LinkIcon className="h-4 w-4 text-[#251b12]" />
				</div>
				<span className="text-lg font-bold tracking-tight text-[#251b12]">Veredas Connect</span>
			</Link>

			{/* Auth card */}
			<div className="relative z-10 w-full max-w-md rounded-2xl border border-[#eadcc5] bg-white/80 p-8 shadow-[0_30px_100px_rgba(86,61,31,0.12)] backdrop-blur-2xl">
				{children}
			</div>
		</div>
	);
}
