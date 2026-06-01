"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
	Building,
	ChevronDown,
	FileDown,
	Loader2,
	Mail,
	MessageSquare,
	Phone,
	Tag,
	X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiPath } from "@/lib/paths";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const STATUS_CONFIG = {
	new: { label: "Novo", color: "bg-violet-500/20 text-violet-300" },
	contacted: { label: "Contatado", color: "bg-blue-500/20 text-blue-300" },
	qualified: { label: "Qualificado", color: "bg-amber-500/20 text-amber-300" },
	closed: { label: "Fechado", color: "bg-emerald-500/20 text-emerald-300" },
} as const;

type Status = keyof typeof STATUS_CONFIG;

interface Lead {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	company: string | null;
	message: string | null;
	status: Status;
	tags: string;
	notes: string;
	createdAt: string;
}

function StatusBadge({ status, onChange }: { status: Status; onChange: (s: Status) => void }) {
	const [open, setOpen] = useState(false);
	const cfg = STATUS_CONFIG[status];
	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${cfg.color}`}
			>
				{cfg.label}
				<ChevronDown className="h-3 w-3 opacity-60" />
			</button>
			{open && (
				<div className="absolute left-0 top-7 z-50 w-36 rounded-lg border border-white/10 bg-zinc-800 p-1 shadow-xl">
					{(Object.entries(STATUS_CONFIG) as [Status, (typeof STATUS_CONFIG)[Status]][]).map(
						([k, v]) => (
							<button
								type="button"
								key={k}
								className={`w-full rounded px-3 py-1.5 text-left text-xs font-bold hover:bg-white/10 ${v.color}`}
								onClick={() => {
									onChange(k);
									setOpen(false);
								}}
							>
								{v.label}
							</button>
						),
					)}
				</div>
			)}
		</div>
	);
}

export default function LeadsPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center bg-zinc-950">
					<Loader2 className="h-8 w-8 animate-spin text-violet-500" />
				</div>
			}
		>
			<LeadsContent />
		</Suspense>
	);
}

function LeadsContent() {
	const searchParams = useSearchParams();
	const profileId = searchParams.get("id");
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
	const [tagInput, setTagInput] = useState<Record<string, string>>({});

	useEffect(() => {
		const url = apiPath(profileId ? `/api/leads?id=${profileId}` : "/api/leads");
		fetch(url)
			.then((r) => r.json())
			.then((d) => setLeads(d.leads ?? []))
			.finally(() => setLoading(false));
	}, [profileId]);

	const updateLead = async (
		id: string,
		patch: Partial<Pick<Lead, "status" | "tags" | "notes">>,
	) => {
		const res = await fetch(apiPath(`/api/leads/${id}`), {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(patch),
		});
		if (res.ok) {
			setLeads((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));
		}
		return res.ok;
	};

	const saveNotes = async (id: string) => {
		const ok = await updateLead(id, { notes: notesDraft[id] ?? "" });
		if (ok) toast.success("Anotação salva!");
	};

	const addTag = async (id: string) => {
		const tag = (tagInput[id] ?? "").trim().toLowerCase();
		if (!tag) return;
		const lead = leads.find((l) => l.id === id);
		if (!lead) return;
		const existing = lead.tags
			? lead.tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean)
			: [];
		if (existing.includes(tag)) return;
		const newTags = [...existing, tag].join(",");
		await updateLead(id, { tags: newTags });
		setTagInput((p) => ({ ...p, [id]: "" }));
	};

	const removeTag = async (leadId: string, tag: string) => {
		const lead = leads.find((l) => l.id === leadId);
		if (!lead) return;
		const newTags = lead.tags
			.split(",")
			.map((t) => t.trim())
			.filter((t) => t && t !== tag)
			.join(",");
		await updateLead(leadId, { tags: newTags });
	};

	const deleteLead = async (id: string) => {
		const res = await fetch(apiPath(`/api/leads/${id}`), { method: "DELETE" });
		if (res.ok) {
			setLeads((p) => p.filter((l) => l.id !== id));
			toast.success("Lead removido.");
		}
	};

	const filtered = filterStatus === "all" ? leads : leads.filter((l) => l.status === filterStatus);

	if (loading) {
		return (
			<div className="flex h-[80vh] items-center justify-center bg-zinc-950">
				<Loader2 className="h-8 w-8 animate-spin text-violet-500" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-950 p-6 text-white">
			<div className="mx-auto max-w-6xl space-y-8">
				{/* Header */}
				<div className="flex flex-wrap gap-4 items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">CRM de Leads</h1>
						<p className="text-white/60">Gerencie, qualifique e exporte seus contatos.</p>
					</div>
					<div className="flex items-center gap-2">
						<span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
							{leads.length} total
						</span>
						<a href={apiPath("/api/leads/export")}>
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5 border-white/20 text-white hover:bg-white/10"
							>
								<FileDown className="h-4 w-4" />
								Exportar CSV
							</Button>
						</a>
					</div>
				</div>

				{/* Status filters */}
				<div className="flex flex-wrap gap-2">
					{[
						["all", "Todos"] as const,
						...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label] as const),
					].map(([k, label]) => (
						<button
							type="button"
							key={k}
							onClick={() => setFilterStatus(k as Status | "all")}
							className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${filterStatus === k ? "bg-violet-600 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
						>
							{label}
							{k !== "all" && (
								<span className="ml-1.5 opacity-60">
									{leads.filter((l) => l.status === k).length}
								</span>
							)}
						</button>
					))}
				</div>

				{/* Empty */}
				{filtered.length === 0 && (
					<Card className="bg-white/5 border-white/10">
						<CardContent className="flex flex-col items-center justify-center p-16 text-center">
							<MessageSquare className="mb-4 h-12 w-12 text-white/20" />
							<h3 className="text-xl font-bold mb-2">Sem leads nessa categoria</h3>
							<p className="text-white/60">Ative o formulário de captura no editor para começar.</p>
						</CardContent>
					</Card>
				)}

				{/* Leads list */}
				<div className="space-y-3">
					{filtered.map((lead) => {
						const isExpanded = expandedId === lead.id;
						const whatsappUrl = lead.phone
							? buildWhatsAppUrl({
									number: lead.phone,
									message: `Olá, ${lead.name}! Recebi seu contato pelo Veredas Connect e quero continuar seu atendimento.`,
								})
							: null;
						const tags = lead.tags
							? lead.tags
									.split(",")
									.map((t) => t.trim())
									.filter(Boolean)
							: [];

						return (
							<Card
								key={lead.id}
								className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
							>
								<CardContent className="p-4 space-y-3">
									{/* Top row */}
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600/30 font-bold text-violet-300">
												{lead.name[0].toUpperCase()}
											</div>
											<div>
												<p className="font-bold text-white">{lead.name}</p>
												<p className="text-xs text-white/50">
													{format(new Date(lead.createdAt), "dd/MM/yyyy 'às' HH:mm", {
														locale: ptBR,
													})}
												</p>
											</div>
										</div>
										<StatusBadge
											status={lead.status}
											onChange={(s) => updateLead(lead.id, { status: s })}
										/>
									</div>

									{/* Contact info */}
									<div className="flex flex-wrap gap-4 text-sm text-white/70">
										<a
											href={`mailto:${lead.email}`}
											className="flex items-center gap-1.5 hover:text-violet-300 transition-colors"
										>
											<Mail className="h-3.5 w-3.5 text-violet-400" />
											{lead.email}
										</a>
										{lead.phone && (
											<a
												href={whatsappUrl ?? `tel:${lead.phone}`}
												target={whatsappUrl ? "_blank" : undefined}
												rel={whatsappUrl ? "noopener noreferrer" : undefined}
												className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
											>
												<Phone className="h-3.5 w-3.5 text-emerald-400" />
												{whatsappUrl ? "Responder no WhatsApp" : lead.phone}
											</a>
										)}
										{lead.company && (
											<span className="flex items-center gap-1.5">
												<Building className="h-3.5 w-3.5 text-blue-400" />
												{lead.company}
											</span>
										)}
									</div>

									{/* Message */}
									{lead.message && (
										<p className="text-sm italic text-white/60 bg-black/20 rounded-lg px-3 py-2">
											"{lead.message}"
										</p>
									)}

									{/* Tags */}
									<div className="flex flex-wrap items-center gap-1.5">
										{tags.map((tag) => (
											<span
												key={tag}
												className="flex items-center gap-1 rounded-full bg-fuchsia-500/20 px-2 py-0.5 text-xs text-fuchsia-300"
											>
												<Tag className="h-3 w-3" />
												{tag}
												<button type="button" onClick={() => removeTag(lead.id, tag)}>
													<X className="h-2.5 w-2.5 ml-0.5 opacity-60 hover:opacity-100" />
												</button>
											</span>
										))}
										<div className="flex items-center gap-1">
											<input
												className="h-6 w-20 rounded-md bg-black/20 px-2 text-xs text-white outline-violet-500 border border-white/10"
												placeholder="+ tag"
												value={tagInput[lead.id] ?? ""}
												onChange={(e) => setTagInput((p) => ({ ...p, [lead.id]: e.target.value }))}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														addTag(lead.id);
													}
												}}
											/>
										</div>
									</div>

									{/* Expand toggle */}
									<button
										type="button"
										className="text-xs text-white/40 hover:text-white/70 transition-colors"
										onClick={() => {
											setExpandedId(isExpanded ? null : lead.id);
											if (!isExpanded) setNotesDraft((p) => ({ ...p, [lead.id]: lead.notes }));
										}}
									>
										{isExpanded ? "▲ Fechar anotações" : "▼ Ver / editar anotações"}
									</button>

									{/* Notes */}
									{isExpanded && (
										<div className="space-y-2 pt-1">
											<Textarea
												value={notesDraft[lead.id] ?? ""}
												onChange={(e) =>
													setNotesDraft((p) => ({ ...p, [lead.id]: e.target.value }))
												}
												placeholder="Anotações internas sobre esse lead..."
												rows={3}
												className="border-white/10 bg-black/30 text-white placeholder:text-white/30 resize-none"
											/>
											<div className="flex justify-between">
												<Button
													size="sm"
													variant="ghost"
													className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
													onClick={() => deleteLead(lead.id)}
												>
													Apagar lead
												</Button>
												<Button
													size="sm"
													className="bg-violet-600 hover:bg-violet-700 text-xs"
													onClick={() => saveNotes(lead.id)}
												>
													Salvar anotação
												</Button>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}
