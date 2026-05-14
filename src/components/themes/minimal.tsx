import { DownloadCloud } from "lucide-react";
import type { ThemeProps } from "@/types";
import { LeadFormCard } from "./lead-form-card";
import { TestimonialsSection } from "./testimonials-section";

export function MinimalTheme({ slug, displayName, bio, avatarUrl, jobTitle, company, phone, whatsapp, leadFormActive, leadFormTitle, testimonials, links, isPreview }: ThemeProps) {
	return (
		<div className="relative flex min-h-full flex-col items-center px-4 py-12 text-white overflow-hidden bg-zinc-950">
			{/* Animated Background Gradients */}
			<div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-[120px]" />
			<div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-fuchsia-600/20 blur-[150px]" />

			<div className="relative z-10 flex w-full max-w-md flex-col items-center">
				{/* Avatar */}
				{avatarUrl ? (
					<div className="relative mb-6">
						<div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-75 blur-sm" />
						<img
							src={avatarUrl}
							alt={displayName || "Avatar"}
							className="relative h-24 w-24 rounded-full border-2 border-white/20 object-cover shadow-2xl"
						/>
					</div>
				) : (
					<div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 border-2 border-white/20 shadow-2xl backdrop-blur-md">
						<span className="text-3xl font-light text-white/70">
							{displayName?.[0]?.toUpperCase() ?? "?"}
						</span>
					</div>
				)}

				{/* Name */}
				{displayName && (
					<h1 className="mb-1 text-2xl font-bold tracking-tight text-white">{displayName}</h1>
				)}

				{/* Corporate Info */}
				{(jobTitle || company) && (
					<div className="mb-4 text-center">
						<span className="text-sm font-semibold text-white/90">
							{jobTitle}
							{jobTitle && company && <span className="mx-2 opacity-50">•</span>}
							{company}
						</span>
					</div>
				)}

				{/* Bio */}
				{bio && (
					<p className="mb-6 max-w-sm text-center text-sm font-medium text-white/70 leading-relaxed">
						{bio}
					</p>
				)}

				{/* Save Contact CTA */}
				<a
					href={isPreview ? "#" : `/api/vcard/${slug}`}
					className={`mb-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${
						isPreview ? "cursor-default" : ""
					}`}
				>
					<DownloadCloud className="h-5 w-5" />
					Salvar Contato
				</a>

				{/* Links Container */}
				<div className="w-full space-y-4">
					{links.map((item) => {
						if (item.type === "header") {
							return (
								<h2
									key={item.id}
									className="pt-4 pb-1 text-sm font-bold tracking-widest text-white/50 uppercase"
								>
									{item.title}
								</h2>
							);
						}

						if (item.type === "divider") {
							return <hr key={item.id} className="my-6 border-white/10" />;
						}

						// Link tracking logic: in public mode, route through /api/click
						const href = isPreview ? item.url : `/api/click/${item.id}`;

						const linkProps = isPreview
							? { as: "div", className: "cursor-pointer" }
							: { as: "a", href, target: "_blank", rel: "noopener noreferrer" };

						const Component = linkProps.as as any;

						return (
							<Component
								key={item.id}
								{...(linkProps.as === "a" ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
								className={`group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 text-center font-semibold text-white/90 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-[0_8px_32px_-8px_rgba(139,92,246,0.3)] active:scale-[0.98] ${
									isPreview ? "cursor-pointer" : ""
								}`}
							>
								{/* Subtle shine effect on hover */}
								<div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-[150%]" />
								<span className="relative z-10">{item.title}</span>
							</Component>
						);
					})}
				</div>

				{/* Global Lead Form - Disabled for launch */}
				{/* {leadFormActive && (
					<LeadFormCard slug={slug} title={leadFormTitle || "Deixe seu contato"} />
				)} */}

				{/* Testimonials / Social Proof */}
				{!isPreview && testimonials && testimonials.length > 0 && (
					<TestimonialsSection items={testimonials} />
				)}
			</div>
		</div>
	);
}
