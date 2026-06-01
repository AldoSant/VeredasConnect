import { DownloadCloud, ExternalLink, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { apiPath } from "@/lib/paths";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { ThemeProps } from "@/types";
import { LeadFormCard } from "./lead-form-card";
import { TestimonialsSection } from "./testimonials-section";

export function PremiumTheme({
	slug,
	displayName,
	bio,
	avatarUrl,
	jobTitle,
	company,
	phone,
	whatsapp,
	leadFormActive,
	leadFormTitle,
	testimonials,
	links,
	isPreview,
}: ThemeProps) {
	const whatsappUrl = whatsapp ? buildWhatsAppUrl({ number: whatsapp, displayName, slug }) : null;

	return (
		<div className="relative flex min-h-screen flex-col items-center px-6 py-16 text-white overflow-hidden bg-[#030303]">
			{/* Advanced Animated Mesh Background */}
			<div className="absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] rounded-full bg-indigo-600/20 blur-[150px] animate-pulse" />
				<div className="absolute bottom-[-20%] right-[-10%] h-[1200px] w-[1200px] rounded-full bg-emerald-600/15 blur-[180px] animate-pulse delay-1000" />
				<div className="absolute top-[20%] right-[-5%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse delay-700" />
				<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
			</div>

			<div className="relative z-10 flex w-full max-w-lg flex-col items-center">
				{/* Avatar with Premium Border */}
				<div className="relative mb-8 group">
					<div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow" />
					<div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl">
						{avatarUrl ? (
							<Image
								src={avatarUrl}
								alt={displayName || "Avatar"}
								width={128}
								height={128}
								unoptimized
								className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-zinc-900">
								<span className="text-4xl font-bold text-white/50">
									{displayName?.[0]?.toUpperCase() ?? "?"}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Identity Section */}
				<div className="mb-10 text-center">
					<h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
						{displayName || `@${slug}`}
					</h1>
					{(jobTitle || company) && (
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide uppercase text-indigo-300 mb-4">
							{jobTitle} {jobTitle && company && "•"} {company}
						</div>
					)}
					{bio && (
						<p className="max-w-md mx-auto text-base font-medium text-white/60 leading-relaxed">
							{bio}
						</p>
					)}
				</div>

				{/* Primary CTA: Save Contact */}
				<div className="w-full mb-12">
					<a
						href={isPreview ? "#" : apiPath(`/api/vcard/${slug}`)}
						className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white p-5 font-bold text-black shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
							isPreview ? "cursor-default" : ""
						}`}
					>
						<DownloadCloud className="h-5 w-5" />
						<span>SALVAR CONTATO NA AGENDA</span>
						<div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
					</a>
				</div>

				{/* Links Grid/List */}
				<div className="w-full space-y-4">
					{links.map((item) => {
						if (item.type === "header") {
							return (
								<h2
									key={item.id}
									className="pt-8 pb-2 text-center text-xs font-black tracking-[0.2em] text-white/40 uppercase"
								>
									{item.title}
								</h2>
							);
						}

						if (item.type === "divider") {
							return (
								<div
									key={item.id}
									className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"
								/>
							);
						}

						const href = isPreview ? item.url : apiPath(`/api/click/${item.id}`);

						return (
							<a
								key={item.id}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:translate-y-[-2px] hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] active:scale-[0.98]"
							>
								{/* Glass shine effect */}
								<div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white group-hover:scale-110 transition-transform duration-500">
										<ExternalLink className="h-5 w-5" />
									</div>
									<span className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">
										{item.title}
									</span>
								</div>

								<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
								</div>
							</a>
						);
					})}
				</div>

				{/* Quick Contact Buttons */}
				<div className="mt-12 flex w-full gap-4">
					{phone && (
						<a
							href={`tel:${phone}`}
							className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-4 hover:bg-white/10 transition-colors"
						>
							<Phone className="h-5 w-5 text-emerald-400" />
							<span className="text-sm font-bold uppercase tracking-tight">Ligar</span>
						</a>
					)}
					{whatsappUrl && (
						<a
							href={isPreview ? "#" : whatsappUrl}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Conversar pelo WhatsApp"
							className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-4 hover:bg-white/10 transition-colors"
						>
							<MessageCircle className="h-5 w-5 text-indigo-400" />
							<span className="text-sm font-bold uppercase tracking-tight">WhatsApp</span>
						</a>
					)}
				</div>

				{/* Lead Capture */}
				{leadFormActive && (
					<div className="w-full mt-16 p-8 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 backdrop-blur-md">
						<LeadFormCard slug={slug} title={leadFormTitle || "Vamos trabalhar juntos?"} />
					</div>
				)}

				{/* Testimonials */}
				{!isPreview && testimonials && testimonials.length > 0 && (
					<div className="w-full mt-16">
						<h3 className="text-center text-sm font-black tracking-widest text-white/30 uppercase mb-8">
							Depoimentos
						</h3>
						<TestimonialsSection items={testimonials} />
					</div>
				)}

				{/* Footer */}
				<div className="mt-24 mb-8 text-center">
					<p className="text-xs font-medium text-white/30 uppercase tracking-widest">
						Powered by <span className="text-white/60 font-bold">Veredas Connect</span>
					</p>
				</div>
			</div>
		</div>
	);
}
