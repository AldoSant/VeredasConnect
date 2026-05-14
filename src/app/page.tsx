import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Globe } from "lucide-react";

export default function Home() {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030303] text-white font-sans selection:bg-indigo-500/30">
			{/* Dynamic Background Mesh */}
			<div className="absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] rounded-full bg-indigo-600/20 blur-[150px] animate-pulse" />
				<div className="absolute bottom-[-20%] right-[-10%] h-[1200px] w-[1200px] rounded-full bg-emerald-600/15 blur-[180px] animate-pulse delay-1000" />
				<div className="absolute top-[20%] right-[-5%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse delay-700" />
				<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
			</div>

			<div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-20 text-center">
				{/* Premium Badge */}
				<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-xl animate-fade-in-up">
					<Sparkles className="h-4 w-4" />
					<span>Veredas Connect — Digital Identity</span>
				</div>

				<div className="space-y-8">
					<h1 className="text-6xl font-black tracking-tighter md:text-8xl lg:text-9xl bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent leading-tight">
						Impacto Visual <br className="hidden md:block" />
						Sem Precedentes.
					</h1>
					<p className="mx-auto max-w-3xl text-xl text-white/50 md:text-2xl font-medium leading-relaxed">
						Crie uma página de links que não é apenas funcional, mas uma obra de arte digital. 
						<span className="text-white"> Velocidade extrema, design premium e efeitos visuais avassaladores.</span>
					</p>
				</div>

				<div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center w-full max-w-md">
					<Link
						href="/signup"
						className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-10 py-5 text-lg font-bold text-black transition-all hover:scale-[1.03] active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
					>
						<span>Começar Agora</span>
						<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Link>
					
					<Link
						href="/login"
						className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-lg font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
					>
						Entrar
					</Link>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-12">
					{[
						{ icon: Zap, label: "Fast as Light" },
						{ icon: Shield, label: "Lead Capture" },
						{ icon: BarChart3, label: "Analytics 2.0" },
						{ icon: Globe, label: "Global Edge" }
					].map((f, i) => (
						<div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
							<f.icon className="h-6 w-6 text-indigo-400" />
							<span className="text-xs font-black uppercase tracking-widest text-white/40">{f.label}</span>
						</div>
					))}
				</div>

				{/* Premium Preview Mockup */}
				<div className="mt-20 relative w-full max-w-4xl">
					<div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
					<div className="relative rounded-[2rem] border border-white/10 bg-zinc-900/40 p-2 shadow-2xl backdrop-blur-2xl overflow-hidden">
						<div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
							<div className="h-3 w-3 rounded-full bg-red-500/50" />
							<div className="h-3 w-3 rounded-full bg-yellow-500/50" />
							<div className="h-3 w-3 rounded-full bg-green-500/50" />
							<div className="ml-4 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
								linkbio.app/seu-nome
							</div>
						</div>
						<div className="aspect-video w-full bg-[#030303] flex items-center justify-center p-8">
							<div className="w-full h-full rounded-xl border border-white/5 bg-white/5 flex flex-col items-center justify-center gap-4">
								<div className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 animate-pulse" />
								<div className="h-4 w-32 bg-white/10 rounded-full" />
								<div className="h-2 w-48 bg-white/5 rounded-full" />
								<div className="grid grid-cols-1 gap-2 w-64 mt-4">
									<div className="h-10 w-full bg-white/10 rounded-lg" />
									<div className="h-10 w-full bg-white/10 rounded-lg" />
									<div className="h-10 w-full bg-white/10 rounded-lg" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
