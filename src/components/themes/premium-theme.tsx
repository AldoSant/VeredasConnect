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
		<div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#fbf7ef] px-6 py-16 text-[#251b12]">
			{/* Advanced Animated Mesh Background */}
			<div className="absolute inset-0 z-0 overflow-hidden">
				<div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] rounded-full bg-[#ead09a]/35 blur-[150px]" />
				<div className="absolute right-[-10%] bottom-[-20%] h-[1200px] w-[1200px] rounded-full bg-[#f6e4c1]/45 blur-[180px]" />
				<div className="absolute top-[20%] right-[-5%] h-[600px] w-[600px] rounded-full bg-[#c9d7bb]/25 blur-[120px]" />
				<div className="absolute inset-0 bg-[linear-gradient(rgba(86,61,31,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(86,61,31,0.045)_1px,transparent_1px)] bg-[size:64px_64px]" />
			</div>

			<div className="relative z-10 flex w-full max-w-lg flex-col items-center">
				{/* Avatar with Premium Border */}
				<div className="relative mb-8 group">
					<div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#e2c381] via-[#fff3dc] to-[#b98e45] opacity-80 blur-md transition-opacity duration-500 group-hover:opacity-100" />
					<div className="relative h-32 w-32 overflow-hidden rounded-full border border-[#e4d0ad] shadow-[0_25px_80px_rgba(86,61,31,0.18)]">
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
							<div className="flex h-full w-full items-center justify-center bg-[#fffaf1]">
								<span className="text-4xl font-bold text-[#9a6a2f]">
									{displayName?.[0]?.toUpperCase() ?? "?"}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Identity Section */}
				<div className="mb-10 text-center">
					<h1 className="mb-2 bg-gradient-to-b from-[#251b12] to-[#765a38] bg-clip-text text-4xl font-extrabold tracking-tighter text-transparent">
						{displayName || `@${slug}`}
					</h1>
					{(jobTitle || company) && (
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#eadcc5] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9a6a2f]">
							{jobTitle} {jobTitle && company && "•"} {company}
						</div>
					)}
					{bio && (
						<p className="mx-auto max-w-md text-base font-medium leading-relaxed text-[#6a5845]">
							{bio}
						</p>
					)}
				</div>

				{/* Primary CTA: Save Contact */}
				<div className="w-full mb-12">
					<a
						href={isPreview ? "#" : apiPath(`/api/vcard/${slug}`)}
						className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#2c2117] p-5 font-bold text-[#fffaf1] shadow-[0_20px_50px_rgba(86,61,31,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#3b2a1d] active:scale-95 ${
							isPreview ? "cursor-default" : ""
						}`}
					>
						<DownloadCloud className="h-5 w-5" />
						<span>SALVAR CONTATO NA AGENDA</span>
						<div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
					</a>
				</div>

				{/* Links Grid/List */}
				<div className="w-full space-y-4">
					{links.map((item) => {
						if (item.type === "header") {
							return (
								<h2
									key={item.id}
									className="pt-8 pb-2 text-center text-xs font-black uppercase tracking-[0.2em] text-[#9a6a2f]"
								>
									{item.title}
								</h2>
							);
						}

						if (item.type === "divider") {
							return (
								<div
									key={item.id}
									className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[#d8c2a0] to-transparent"
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
								className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-[#eadcc5] bg-white/78 p-5 shadow-[0_16px_50px_rgba(86,61,31,0.08)] backdrop-blur-xl transition-all duration-500 hover:translate-y-[-2px] hover:border-[#c9a86a] hover:bg-white active:scale-[0.98]"
							>
								{/* Glass shine effect */}
								<div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-[#fff3dc]/70 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

								<div className="flex items-center gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eadcc5] bg-[#fffaf1] text-[#9a6a2f] transition-transform duration-500 group-hover:scale-110">
										<ExternalLink className="h-5 w-5" />
									</div>
									<span className="text-lg font-bold text-[#251b12] transition-colors group-hover:text-[#251b12]">
										{item.title}
									</span>
								</div>

								<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="h-2 w-2 rounded-full bg-[#c9a86a] shadow-[0_0_10px_rgba(201,168,106,0.8)]" />
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
							className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#eadcc5] bg-white/75 py-4 transition-colors hover:bg-white"
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
							className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#eadcc5] bg-white/75 py-4 transition-colors hover:bg-white"
						>
							<MessageCircle className="h-5 w-5 text-[#9a6a2f]" />
							<span className="text-sm font-bold uppercase tracking-tight">WhatsApp</span>
						</a>
					)}
				</div>

				{/* Lead Capture */}
				{leadFormActive && (
					<div className="mt-16 w-full rounded-3xl border border-[#eadcc5] bg-white/75 p-8 backdrop-blur-md">
						<LeadFormCard slug={slug} title={leadFormTitle || "Vamos trabalhar juntos?"} />
					</div>
				)}

				{/* Testimonials */}
				{!isPreview && testimonials && testimonials.length > 0 && (
					<div className="w-full mt-16">
						<h3 className="mb-8 text-center text-sm font-black uppercase tracking-widest text-[#9a6a2f]">
							Depoimentos
						</h3>
						<TestimonialsSection items={testimonials} />
					</div>
				)}

				{/* Footer */}
				<div className="mt-24 mb-8 text-center">
					<p className="text-xs font-medium uppercase tracking-widest text-[#9b8268]">
						Powered by <span className="font-bold text-[#6a5845]">Veredas Connect</span>
					</p>
				</div>
			</div>
		</div>
	);
}
