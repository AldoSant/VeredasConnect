import { ArrowRight, DownloadCloud, ExternalLink, Sparkles, Star } from "lucide-react";
import Link from "next/link";

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

			{/* Main Hero Section */}
			<div className="relative z-10 w-full max-w-7xl px-6 py-24 md:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Left Column: Content */}
					<div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-10 animate-fade-in">
						{/* Eyebrow */}
						<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-xl shadow-[0_0_20px_rgba(99,102,241,0.2)]">
							<Sparkles className="h-3 md:h-4 w-3 md:w-4" />
							<span>VEREDAS CONNECT — PREMIUM DIGITAL IDENTITY</span>
						</div>

						{/* Headline */}
						<div className="space-y-6">
							<h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[1.1] bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
								Transforme seu link <br className="hidden md:block" /> em autoridade.
							</h1>
							<p className="max-w-xl text-lg md:text-xl text-white/70 font-medium leading-relaxed">
								Uma identidade digital premium para profissionais e marcas que querem presença,
								confiança e conversão em um único endereço.
							</p>
						</div>

						{/* Micro-benefits */}
						<div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-[11px] md:text-xs font-semibold uppercase tracking-widest text-white/40">
							<span>Google Sign-In seguro</span>
							<span className="opacity-30">•</span>
							<span>vCard instantâneo</span>
							<span className="opacity-30">•</span>
							<span>Analytics nativo</span>
							<span className="opacity-30">•</span>
							<span>NFC-ready</span>
						</div>

						{/* CTAs */}
						<div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
							<Link
								href="/signup"
								className="group relative flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#F5F5F5] px-10 py-5 text-base font-bold text-black transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:scale-95"
							>
								<span>Criar minha página premium</span>
								<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
								<div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
							</Link>

							<Link
								href="/login"
								className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 px-10 py-5 text-base font-bold text-white backdrop-blur-xl transition-all hover:bg-indigo-500/10 hover:border-indigo-500/50 active:scale-95"
							>
								Ver demonstração
							</Link>
						</div>

						{/* Micro-text */}
						<p className="text-xs text-white/30 font-medium">
							Sem cartão de crédito. Comece em segundos.
						</p>
					</div>

					{/* Right Column: Mockup */}
					<div className="relative group perspective-1000 animate-fade-in-right">
						{/* Ambient Glow */}
						<div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-emerald-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />

						{/* Browser Frame */}
						<div className="relative rounded-[2.5rem] border border-white/10 bg-[#0A0A0A]/80 p-2 shadow-2xl backdrop-blur-3xl overflow-hidden ring-1 ring-white/5">
							{/* Browser Header */}
							<div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
								<div className="flex gap-1.5">
									<div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/30" />
									<div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
									<div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/30" />
								</div>
								<div className="ml-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
									veredasinc.com.br/ana-veredas
								</div>
							</div>

							{/* Mockup Content (Inner Profile) */}
							<div className="relative aspect-[4/5] w-full bg-[#030303] flex flex-col items-center p-8 overflow-y-auto">
								{/* Inner Background Gradient */}
								<div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

								<div className="relative z-10 flex flex-col items-center w-full max-w-xs text-center">
									{/* Avatar */}
									<div className="relative mb-6">
										<div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 opacity-50 blur-sm animate-spin-slow" />
										<div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white/20 bg-zinc-900 flex items-center justify-center">
											<span className="text-3xl font-black text-white/40">AV</span>
										</div>
									</div>

									{/* Identity */}
									<h2 className="text-2xl font-black tracking-tight text-white mb-1">
										Ana Veredas
									</h2>
									<p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-8 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
										Consultora em Negócios Digitais
									</p>

									{/* Links Grid */}
									<div className="w-full space-y-3 mb-8">
										{["Estratégia de Marca", "Mentoria Executiva", "Workshop Digital"].map(
											(title) => (
												<div
													key={title}
													className="group/item relative w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 transition-all hover:bg-white/10 hover:translate-y-[-2px]"
												>
													<div className="flex items-center justify-between">
														<span className="text-xs font-bold text-white/90">{title}</span>
														<ExternalLink className="h-3 w-3 text-white/30" />
													</div>
													<div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover/item:translate-x-[100%]" />
												</div>
											),
										)}
									</div>

									{/* Featured vCard Button */}
									<div className="w-full mb-8">
										<div className="relative group/vcard cursor-pointer flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white p-4 font-bold text-black shadow-lg transition-all active:scale-95">
											<DownloadCloud className="h-4 w-4" />
											<span className="text-[11px] tracking-tight">SALVAR CONTATO NA AGENDA</span>
											<div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-1000 group-hover/vcard:translate-x-[100%]" />
										</div>
									</div>

									{/* Social Proof */}
									<div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
										<div className="flex gap-0.5">
											{[1, 2, 3, 4, 5].map((s) => (
												<Star key={s} className="h-2.5 w-2.5 fill-white/10 stroke-none" />
											))}
										</div>
										<span>Mais de 1.200 conexões criadas</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
