"use client";

import { Eye, EyeOff, Loader2, Plus, Quote, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiPath } from "@/lib/paths";

interface Testimonial {
	id: string;
	authorName: string;
	authorTitle: string;
	authorAvatar: string;
	content: string;
	rating: number;
	isVisible: boolean;
	sortOrder: number;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((s) => (
				<button key={s} type="button" onClick={() => onChange(s)}>
					<Star
						className={`h-5 w-5 transition-colors ${s <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
					/>
				</button>
			))}
		</div>
	);
}

export default function TestimonialsPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-[80vh] items-center justify-center bg-[#fbf7ef]">
					<Loader2 className="h-8 w-8 animate-spin text-violet-500" />
				</div>
			}
		>
			<TestimonialsContent />
		</Suspense>
	);
}

function TestimonialsContent() {
	const searchParams = useSearchParams();
	const profileId = searchParams.get("id");
	const [items, setItems] = useState<Testimonial[]>([]);
	const [loading, setLoading] = useState(true);
	const [addOpen, setAddOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [form, setForm] = useState({
		authorName: "",
		authorTitle: "",
		authorAvatar: "",
		content: "",
		rating: 5,
	});

	useEffect(() => {
		const url = apiPath(profileId ? `/api/testimonials?id=${profileId}` : "/api/testimonials");
		fetch(url)
			.then((r) => r.json())
			.then((d) => setItems(d.testimonials ?? []))
			.finally(() => setLoading(false));
	}, [profileId]);

	const handleAdd = async () => {
		if (!form.authorName || !form.content) return;
		setIsAdding(true);
		try {
			const res = await fetch(apiPath("/api/testimonials"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...form, profileId, sortOrder: items.length }),
			});
			if (!res.ok) throw new Error();
			const { testimonial } = await res.json();
			setItems((p) => [...p, testimonial]);
			setForm({ authorName: "", authorTitle: "", authorAvatar: "", content: "", rating: 5 });
			setAddOpen(false);
			toast.success("Depoimento adicionado!");
		} catch {
			toast.error("Erro ao adicionar depoimento.");
		} finally {
			setIsAdding(false);
		}
	};

	const toggleVisible = async (item: Testimonial) => {
		const res = await fetch(apiPath(`/api/testimonials/${item.id}`), {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ isVisible: !item.isVisible }),
		});
		if (res.ok) {
			setItems((p) => p.map((t) => (t.id === item.id ? { ...t, isVisible: !t.isVisible } : t)));
		}
	};

	const handleDelete = async (id: string) => {
		const res = await fetch(apiPath(`/api/testimonials/${id}`), { method: "DELETE" });
		if (res.ok) {
			setItems((p) => p.filter((t) => t.id !== id));
			toast.success("Depoimento removido.");
		}
	};

	if (loading) {
		return (
			<div className="flex h-[80vh] items-center justify-center bg-[#fbf7ef]">
				<Loader2 className="h-8 w-8 animate-spin text-violet-500" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#fbf7ef] p-6 text-[#251b12]">
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Prova Social</h1>
						<p className="text-[#6a5845]">
							Gerencie os depoimentos que aparecem no seu perfil público.
						</p>
					</div>
					<Dialog open={addOpen} onOpenChange={setAddOpen}>
						<DialogTrigger asChild>
							<Button className="gap-2 bg-violet-600 hover:bg-violet-700">
								<Plus className="h-4 w-4" />
								Adicionar Depoimento
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Novo Depoimento</DialogTitle>
							</DialogHeader>
							<div className="space-y-4 pt-2">
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1.5">
										<Label>Nome</Label>
										<Input
											value={form.authorName}
											onChange={(e) => setForm((p) => ({ ...p, authorName: e.target.value }))}
											placeholder="Ana Silva"
										/>
									</div>
									<div className="space-y-1.5">
										<Label>Cargo / Empresa</Label>
										<Input
											value={form.authorTitle}
											onChange={(e) => setForm((p) => ({ ...p, authorTitle: e.target.value }))}
											placeholder="CEO, Empresa X"
										/>
									</div>
								</div>
								<div className="space-y-1.5">
									<Label>URL da Foto (opcional)</Label>
									<Input
										value={form.authorAvatar}
										onChange={(e) => setForm((p) => ({ ...p, authorAvatar: e.target.value }))}
										placeholder="https://..."
									/>
								</div>
								<div className="space-y-1.5">
									<Label>Depoimento</Label>
									<Textarea
										value={form.content}
										onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
										placeholder="Excelente profissional, recomendo..."
										rows={4}
										maxLength={500}
									/>
									<p className="text-xs text-right text-muted-foreground">
										{form.content.length}/500
									</p>
								</div>
								<div className="space-y-1.5">
									<Label>Avaliação</Label>
									<StarRating
										value={form.rating}
										onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
									/>
								</div>
								<Button
									className="w-full"
									onClick={handleAdd}
									disabled={isAdding || !form.authorName || !form.content}
								>
									{isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar"}
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{items.length === 0 && (
					<Card className="bg-white/75 border-[#eadcc5]">
						<CardContent className="flex flex-col items-center justify-center p-16 text-center">
							<Quote className="mb-4 h-12 w-12 text-[#d4bd9e]" />
							<h3 className="mb-2 text-xl font-bold">Sem depoimentos ainda</h3>
							<p className="text-[#6a5845]">
								Adicione depoimentos de clientes para aumentar sua credibilidade.
							</p>
						</CardContent>
					</Card>
				)}

				<div className="grid gap-4 md:grid-cols-2">
					{items.map((item) => (
						<Card
							key={item.id}
							className={`border-[#eadcc5] transition-all ${item.isVisible ? "bg-white/75" : "bg-[#efe2cf] opacity-60"}`}
						>
							<CardContent className="p-5 space-y-3">
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((s) => (
										<Star
											key={s}
											className={`h-4 w-4 ${s <= item.rating ? "fill-amber-400 text-amber-400" : "text-[#d4bd9e]"}`}
										/>
									))}
								</div>
								<p className="text-sm text-[#3b2a1d] italic line-clamp-4">"{item.content}"</p>
								<div className="flex items-center gap-3">
									{item.authorAvatar ? (
										<Image
											src={item.authorAvatar}
											className="h-8 w-8 rounded-full object-cover"
											alt={item.authorName}
											width={32}
											height={32}
											unoptimized
										/>
									) : (
										<div className="h-8 w-8 rounded-full bg-violet-600/40 flex items-center justify-center text-xs font-bold">
											{item.authorName[0]}
										</div>
									)}
									<div>
										<p className="text-sm font-semibold text-[#251b12]">{item.authorName}</p>
										{item.authorTitle && (
											<p className="text-xs text-[#8d7459]">{item.authorTitle}</p>
										)}
									</div>
								</div>
								<div className="flex gap-2 pt-1 border-t border-[#eadcc5]">
									<Button
										size="sm"
										variant="ghost"
										className="flex-1 gap-1 text-xs text-[#6a5845] hover:text-[#251b12]"
										onClick={() => toggleVisible(item)}
									>
										{item.isVisible ? (
											<Eye className="h-3.5 w-3.5" />
										) : (
											<EyeOff className="h-3.5 w-3.5" />
										)}
										{item.isVisible ? "Visível" : "Oculto"}
									</Button>
									<Button
										size="sm"
										variant="ghost"
										className="gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
										onClick={() => handleDelete(item.id)}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
