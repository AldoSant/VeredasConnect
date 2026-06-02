import { Quote, Star } from "lucide-react";
import Image from "next/image";

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
				<Quote className="h-4 w-4 text-[#c9a86a]" />
				<span className="text-xs font-bold uppercase tracking-widest text-[#9a6a2f]">
					O que dizem de mim
				</span>
				<Quote className="h-4 w-4 rotate-180 text-[#c9a86a]" />
			</div>
			<div className="space-y-4">
				{items.map((item) => (
					<div
						key={item.id}
						className="relative rounded-2xl border border-[#eadcc5] bg-white/80 p-5 backdrop-blur-md"
					>
						{/* Stars */}
						<div className="mb-3 flex gap-0.5">
							{[1, 2, 3, 4, 5].map((s) => (
								<Star
									key={s}
									className={`h-3.5 w-3.5 ${s <= item.rating ? "fill-amber-400 text-amber-400" : "text-[#d8c2a0]"}`}
								/>
							))}
						</div>
						<p className="mb-4 text-sm leading-relaxed text-[#5d4b3a] italic">"{item.content}"</p>
						<div className="flex items-center gap-3">
							{item.authorAvatar ? (
								<Image
									src={item.authorAvatar}
									alt={item.authorName}
									width={32}
									height={32}
									unoptimized
									className="h-8 w-8 rounded-full border border-[#eadcc5] object-cover"
								/>
							) : (
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff3dc] text-xs font-bold text-[#9a6a2f]">
									{item.authorName[0]}
								</div>
							)}
							<div>
								<p className="text-sm font-semibold text-[#251b12]">{item.authorName}</p>
								{item.authorTitle && <p className="text-xs text-[#8d7459]">{item.authorTitle}</p>}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
