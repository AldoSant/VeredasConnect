"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
	Star,
	Plus,
	Loader2,
	Eye,
	EyeOff,
	Trash2,
	Quote,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
		<Suspense fallback={<div className="flex h-[80vh] items-center justify-center bg-zinc-950"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>}>
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
		const url = profileId ? `/api/testimonials?id=${profileId}` : "/api/testimonials";
		fetch(url)
			.then((r) => r.json())
			.then((d) => setItems(d.testimonials ?? []))
			.finally(() => setLoading(false));
	}, [profileId]);

	const handleAdd = async () => {
		if (!form.authorName || !form.content) return;
		setIsAdding(true);
		try {
			const res = await fetch("/api/testimonials", {
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
		const res = await fetch(`/api/testimonials/${item.id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ isVisible: !item.isVisible }),
		});
		if (res.ok) {
			setItems((p) => p.map((t) => (t.id === item.id ? { ...t, isVisible: !t.isVisible } : t)));
		}
	};

	const handleDelete = async (id: string) => {
		const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
		if (res.ok) {
			setItems((p) => p.filter((t) => t.id !== id));
			toast.success("Depoimento removido.");
		}
	};

	if (loading) {
		return (
			<div className="flex h-[80vh] items-center justify-center bg-zinc-950">
				<Loader2 className="h-8 w-8 animate-spin text-violet-500" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-950 p-6 text-white">
			<div className="mx-auto max-w-5xl space-y-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Prova Social</h1>
						<p className="text-white/60">Gerencie os depoimentos que aparecem no seu perfil público.</p>
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
									<p className="text-xs text-right text-muted-foreground">{form.content.length}/500</p>
								</div>
								<div className="space-y-1.5">
									<Label>Avaliação</Label>
									<StarRating value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
								</div>
								<Button className="w-full" onClick={handleAdd} disabled={isAdding || !form.authorName || !form.content}>
									{isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar"}
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{items.length === 0 && (
					<Card className="bg-white/5 border-white/10">
						<CardContent className="flex flex-col items-center justify-center p-16 text-center">
							<Quote className="mb-4 h-12 w-12 text-white/20" />
							<h3 className="mb-2 text-xl font-bold">Sem depoimentos ainda</h3>
							<p className="text-white/60">Adicione depoimentos de clientes para aumentar sua credibilidade.</p>
						</CardContent>
					</Card>
				)}

				<div className="grid gap-4 md:grid-cols-2">
					{items.map((item) => (
						<Card key={item.id} className={`border-white/10 transition-all ${item.isVisible ? "bg-white/5" : "bg-black/40 opacity-60"}`}>
							<CardContent className="p-5 space-y-3">
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((s) => (
										<Star key={s} className={`h-4 w-4 ${s <= item.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`} />
									))}
								</div>
								<p className="text-sm text-white/80 italic line-clamp-4">"{item.content}"</p>
								<div className="flex items-center gap-3">
									{item.authorAvatar ? (
										<img src={item.authorAvatar} className="h-8 w-8 rounded-full object-cover" alt={item.authorName} />
									) : (
										<div className="h-8 w-8 rounded-full bg-violet-600/40 flex items-center justify-center text-xs font-bold">
											{item.authorName[0]}
										</div>
									)}
									<div>
										<p className="text-sm font-semibold text-white">{item.authorName}</p>
										{item.authorTitle && <p className="text-xs text-white/50">{item.authorTitle}</p>}
									</div>
								</div>
								<div className="flex gap-2 pt-1 border-t border-white/10">
									<Button
										size="sm"
										variant="ghost"
										className="flex-1 gap-1 text-xs text-white/60 hover:text-white"
										onClick={() => toggleVisible(item)}
									>
										{item.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
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
