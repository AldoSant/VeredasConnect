import { Star, Quote } from "lucide-react";

interface TestimonialItem {
	id: string;
	authorName: string;
	authorTitle: string;
	authorAvatar: string;
	content: string;
	rating: number;
}

export function TestimonialsSection({ items }: { items: TestimonialItem[] }) {
	if (!items || items.length === 0) return null;

	return (
		<div className="mt-10 w-full">
			<div className="mb-4 flex items-center gap-2 justify-center">
				<Quote className="h-4 w-4 text-white/30" />
				<span className="text-xs font-bold uppercase tracking-widest text-white/40">O que dizem de mim</span>
				<Quote className="h-4 w-4 rotate-180 text-white/30" />
			</div>
			<div className="space-y-4">
				{items.map((item) => (
					<div
						key={item.id}
						className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
					>
						{/* Stars */}
						<div className="mb-3 flex gap-0.5">
							{[1, 2, 3, 4, 5].map((s) => (
								<Star
									key={s}
									className={`h-3.5 w-3.5 ${s <= item.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
								/>
							))}
						</div>
						<p className="mb-4 text-sm leading-relaxed text-white/80 italic">"{item.content}"</p>
						<div className="flex items-center gap-3">
							{item.authorAvatar ? (
								<img
									src={item.authorAvatar}
									alt={item.authorName}
									className="h-8 w-8 rounded-full object-cover border border-white/10"
								/>
							) : (
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/30 text-xs font-bold text-violet-300">
									{item.authorName[0]}
								</div>
							)}
							<div>
								<p className="text-sm font-semibold text-white">{item.authorName}</p>
								{item.authorTitle && (
									<p className="text-xs text-white/50">{item.authorTitle}</p>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
