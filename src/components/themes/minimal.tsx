import { DownloadCloud } from "lucide-react";
import Image from "next/image";
import type { ThemeProps } from "@/types";
import { TestimonialsSection } from "./testimonials-section";

export function MinimalTheme({
	slug,
	displayName,
	bio,
	avatarUrl,
	jobTitle,
	company,
	testimonials,
	links,
	isPreview,
}: ThemeProps) {
	return (
		<div className="relative flex min-h-full flex-col items-center overflow-hidden bg-[#fbf7ef] px-4 py-12 text-[#251b12]">
			{/* Animated Background Gradients */}
			<div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#f3dec0]/70 blur-[120px]" />
			<div className="absolute right-[-10%] bottom-[-10%] h-[600px] w-[600px] rounded-full bg-[#e8c982]/45 blur-[150px]" />

			<div className="relative z-10 flex w-full max-w-md flex-col items-center">
				{/* Avatar */}
				{avatarUrl ? (
					<div className="relative mb-6">
						<div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#d8b36a] to-[#fff3dc] opacity-80 blur-sm" />
						<Image
							src={avatarUrl}
							alt={displayName || "Avatar"}
							width={96}
							height={96}
							unoptimized
							className="relative h-24 w-24 rounded-full border-2 border-white object-cover shadow-2xl"
						/>
					</div>
				) : (
					<div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white bg-white/75 shadow-2xl backdrop-blur-md">
						<span className="text-3xl font-light text-[#9a6a2f]">
							{displayName?.[0]?.toUpperCase() ?? "?"}
						</span>
					</div>
				)}

				{/* Name */}
				{displayName && (
					<h1 className="mb-1 text-2xl font-bold tracking-tight text-[#251b12]">{displayName}</h1>
				)}

				{/* Corporate Info */}
				{(jobTitle || company) && (
					<div className="mb-4 text-center">
						<span className="text-sm font-semibold text-[#6a5845]">
							{jobTitle}
							{jobTitle && company && <span className="mx-2 opacity-50">•</span>}
							{company}
						</span>
					</div>
				)}

				{/* Bio */}
				{bio && (
					<p className="mb-6 max-w-sm text-center text-sm font-medium leading-relaxed text-[#6a5845]">
						{bio}
					</p>
				)}

				{/* Save Contact CTA */}
				<a
					href={isPreview ? "#" : `/api/vcard/${slug}`}
					className={`mb-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#2c2117] py-3 font-bold text-[#fffaf1] shadow-lg transition-transform hover:scale-105 hover:bg-[#3b2a1d] active:scale-95 ${
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
									className="pt-4 pb-1 text-sm font-bold uppercase tracking-widest text-[#9a6a2f]"
								>
									{item.title}
								</h2>
							);
						}

						if (item.type === "divider") {
							return <hr key={item.id} className="my-6 border-[#d8c2a0]" />;
						}

						// Link tracking logic: in public mode, route through /api/click
						const href = isPreview ? item.url : `/api/click/${item.id}`;
						const className = `group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-[#eadcc5] bg-white/78 p-4 text-center font-semibold text-[#251b12] shadow-[0_16px_50px_rgba(86,61,31,0.08)] backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:border-[#c9a86a] hover:bg-white hover:shadow-[0_18px_60px_rgba(86,61,31,0.12)] active:scale-[0.98] ${
							isPreview ? "cursor-pointer" : ""
						}`;
						const content = (
							<>
								{/* Subtle shine effect on hover */}
								<div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-[#fff3dc]/80 to-transparent transition-transform duration-500 group-hover:translate-x-[150%]" />
								<span className="relative z-10">{item.title}</span>
							</>
						);

						return isPreview ? (
							<div key={item.id} className={className}>
								{content}
							</div>
						) : (
							<a
								key={item.id}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className={className}
							>
								{content}
							</a>
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
