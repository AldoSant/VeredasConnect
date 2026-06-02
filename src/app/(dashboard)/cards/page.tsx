"use client";

import {
	CheckCircle,
	Copy,
	CreditCard,
	Link2,
	Loader2,
	Plus,
	Power,
	Trash2,
	Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { apiPath, appPath } from "@/lib/paths";

interface NfcCardData {
	id: string;
	label: string;
	profileId: string | null;
	isActive: boolean;
	createdAt: string;
	profile?: {
		slug: string;
		displayName: string;
	} | null;
}

interface ProfileOption {
	id: string;
	slug: string;
	displayName: string;
}

export default function CardsPage() {
	const [cards, setCards] = useState<NfcCardData[]>([]);
	const [profiles, setProfiles] = useState<ProfileOption[]>([]);
	const [loading, setLoading] = useState(true);
	const [addOpen, setAddOpen] = useState(false);
	const [newLabel, setNewLabel] = useState("");
	const [newProfileId, setNewProfileId] = useState("");
	const [isAdding, setIsAdding] = useState(false);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	useEffect(() => {
		async function load() {
			const [cardsRes, profileRes] = await Promise.all([
				fetch(apiPath("/api/cards")),
				fetch(apiPath("/api/profile")),
			]);
			if (cardsRes.ok) {
				const d = await cardsRes.json();
				setCards(d.cards);
			}
			if (profileRes.ok) {
				const d = await profileRes.json();
				// Single profile for now — multi-profile returns array in future
				if (d.profile) setProfiles([d.profile]);
			}
			setLoading(false);
		}
		load();
	}, []);

	const handleAddCard = async () => {
		if (!newLabel.trim()) return;
		setIsAdding(true);
		try {
			const res = await fetch(apiPath("/api/cards"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					label: newLabel,
					profileId: newProfileId || undefined,
				}),
			});
			if (!res.ok) throw new Error();
			const { card } = await res.json();
			const linkedProfile = profiles.find((p) => p.id === card.profileId) ?? null;
			setCards((prev) => [...prev, { ...card, profile: linkedProfile }]);
			setNewLabel("");
			setNewProfileId("");
			setAddOpen(false);
			toast.success("Cartão criado com sucesso!");
		} catch {
			toast.error("Erro ao criar o cartão.");
		} finally {
			setIsAdding(false);
		}
	};

	const handleToggle = async (card: NfcCardData) => {
		const res = await fetch(apiPath(`/api/cards/${card.id}`), {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ isActive: !card.isActive }),
		});
		if (res.ok) {
			setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, isActive: !c.isActive } : c)));
			toast.success(card.isActive ? "Cartão pausado." : "Cartão ativado.");
		}
	};

	const handleRelink = async (cardId: string, profileId: string) => {
		const res = await fetch(apiPath(`/api/cards/${cardId}`), {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ profileId }),
		});
		if (res.ok) {
			const linkedProfile = profiles.find((p) => p.id === profileId) ?? null;
			setCards((prev) =>
				prev.map((c) => (c.id === cardId ? { ...c, profileId, profile: linkedProfile } : c)),
			);
			toast.success("Perfil atualizado! Não precisa regravar o chip.");
		}
	};

	const handleDelete = async (cardId: string) => {
		const res = await fetch(apiPath(`/api/cards/${cardId}`), { method: "DELETE" });
		if (res.ok) {
			setCards((prev) => prev.filter((c) => c.id !== cardId));
			toast.success("Cartão removido.");
		}
	};

	const copyNfcUrl = (cardId: string) => {
		const url = `${window.location.origin}${appPath(`/n/${cardId}`)}`;
		navigator.clipboard.writeText(url);
		setCopiedId(cardId);
		toast.success("URL do NFC copiada!");
		setTimeout(() => setCopiedId(null), 2000);
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
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Gestão de Cartões NFC</h1>
						<p className="text-[#6a5845]">
							Vincule chips físicos aos seus perfis. Altere o destino sem regravar o cartão.
						</p>
					</div>
					<Dialog open={addOpen} onOpenChange={setAddOpen}>
						<DialogTrigger asChild>
							<Button className="gap-2 bg-violet-600 hover:bg-violet-700">
								<Plus className="h-4 w-4" />
								Registrar Cartão
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Novo Cartão NFC</DialogTitle>
								<DialogDescription>
									Registre um novo chip NFC e vincule a um perfil. A URL gerada deve ser gravada no
									chip.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 pt-2">
								<div className="space-y-2">
									<label htmlFor="new-card-label" className="text-sm font-medium">
										Nome do Cartão
									</label>
									<Input
										id="new-card-label"
										placeholder="ex: Cartão Corporativo do João"
										value={newLabel}
										onChange={(e) => setNewLabel(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<span className="text-sm font-medium">Perfil Vinculado</span>
									<Select value={newProfileId} onValueChange={setNewProfileId}>
										<SelectTrigger>
											<SelectValue placeholder="Selecione um perfil" />
										</SelectTrigger>
										<SelectContent>
											{profiles.map((p) => (
												<SelectItem key={p.id} value={p.id}>
													{p.displayName || p.slug}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<Button
									className="w-full"
									onClick={handleAddCard}
									disabled={isAdding || !newLabel.trim()}
								>
									{isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Cartão"}
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>

				{/* Info Banner */}
				<div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 flex items-start gap-3">
					<Wifi className="h-5 w-5 shrink-0 text-violet-400 mt-0.5" />
					<div className="text-sm text-[#3b2a1d]">
						<strong className="text-violet-300">Como funciona:</strong> Cada cartão tem uma URL
						única (<code className="text-violet-300">/n/[id]</code>) para gravar no chip NFC. Quando
						alguém aproxima o celular, o sistema redireciona automaticamente para o perfil
						vinculado. Troque o perfil quando quiser — <strong>sem regravar o chip.</strong>
					</div>
				</div>

				{/* Empty State */}
				{cards.length === 0 && (
					<Card className="bg-white/75 border-[#eadcc5]">
						<CardContent className="flex flex-col items-center justify-center p-16 text-center">
							<CreditCard className="mb-4 h-16 w-16 text-[#d4bd9e]" />
							<h3 className="mb-2 text-xl font-bold">Nenhum Cartão Registrado</h3>
							<p className="mb-6 text-[#6a5845]">
								Registre seu primeiro chip NFC para começar a gerenciar.
							</p>
						</CardContent>
					</Card>
				)}

				{/* Cards Grid */}
				<div className="grid gap-4 sm:grid-cols-2">
					{cards.map((card) => (
						<Card
							key={card.id}
							className={`border-[#eadcc5] transition-all ${card.isActive ? "bg-white/75" : "bg-[#efe2cf] opacity-60"}`}
						>
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="flex items-center gap-2 text-base font-bold">
										<CreditCard className="h-4 w-4 text-violet-400" />
										{card.label}
									</CardTitle>
									<span
										className={`rounded-full px-2 py-0.5 text-xs font-bold ${
											card.isActive
												? "bg-emerald-500/20 text-emerald-400"
												: "bg-red-500/20 text-red-400"
										}`}
									>
										{card.isActive ? "Ativo" : "Pausado"}
									</span>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Profile link */}
								<div className="flex items-center gap-2 text-sm">
									<Link2 className="h-4 w-4 text-[#9b8268]" />
									{card.profile ? (
										<span className="text-[#3b2a1d]">
											Redirecionando para{" "}
											<strong className="text-violet-400">/{card.profile.slug}</strong>
										</span>
									) : (
										<span className="text-[#9b8268] italic">Nenhum perfil vinculado</span>
									)}
								</div>

								{/* Relink profile */}
								<div className="space-y-1.5">
									<span className="text-xs font-medium text-[#8d7459] uppercase tracking-wider">
										Alterar Destino
									</span>
									<Select
										value={card.profileId ?? ""}
										onValueChange={(v) => handleRelink(card.id, v)}
									>
										<SelectTrigger className="border-[#eadcc5] bg-[#f4ead9] text-[#251b12] text-sm h-8">
											<SelectValue placeholder="Selecione perfil" />
										</SelectTrigger>
										<SelectContent>
											{profiles.map((p) => (
												<SelectItem key={p.id} value={p.id}>
													{p.displayName || p.slug}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* NFC URL */}
								<div className="flex items-center gap-2">
									<code className="flex-1 truncate rounded bg-[#f4ead9] px-2 py-1 text-xs text-violet-300">
										{window?.location?.origin ?? ""}
										{appPath(`/n/${card.id}`)}
									</code>
									<Button
										size="sm"
										variant="ghost"
										className="h-7 w-7 p-0 text-[#8d7459] hover:text-[#251b12]"
										onClick={() => copyNfcUrl(card.id)}
									>
										{copiedId === card.id ? (
											<CheckCircle className="h-4 w-4 text-emerald-400" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</Button>
								</div>

								{/* Actions */}
								<div className="flex gap-2 pt-1">
									<Button
										size="sm"
										variant="outline"
										className="flex-1 gap-1.5 border-[#eadcc5] text-[#5d4b3a] hover:bg-[#f6ead8] text-xs"
										onClick={() => handleToggle(card)}
									>
										<Power className="h-3.5 w-3.5" />
										{card.isActive ? "Pausar" : "Ativar"}
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
										onClick={() => handleDelete(card.id)}
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
