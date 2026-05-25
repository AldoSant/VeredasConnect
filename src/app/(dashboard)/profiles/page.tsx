"use client";

import { CreditCard, Edit2, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPath } from "@/lib/paths";

interface Profile {
	id: string;
	slug: string;
	displayName: string;
	jobTitle: string;
	company: string;
}

export default function ProfilesPage() {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [newSlug, setNewSlug] = useState("");
	const [createOpen, setCreateOpen] = useState(false);

	const fetchProfiles = useCallback(async () => {
		try {
			const res = await fetch(apiPath("/api/profiles"));
			const data = await res.json();
			setProfiles(data.profiles || []);
		} catch (_error) {
			toast.error("Erro ao carregar perfis");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProfiles();
	}, [fetchProfiles]);

	const handleCreate = async () => {
		if (!newSlug) return;
		setIsCreating(true);
		try {
			const res = await fetch(apiPath("/api/profile"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ slug: newSlug }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Erro ao criar perfil");
			}

			toast.success("Perfil criado com sucesso!");
			setNewSlug("");
			setCreateOpen(false);
			fetchProfiles();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Erro ao criar perfil");
		} finally {
			setIsCreating(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!confirm("Tem certeza que deseja excluir este perfil? Todos os links e leads serão perdidos.")
		)
			return;

		try {
			const res = await fetch(apiPath(`/api/profiles/${id}`), { method: "DELETE" });
			if (!res.ok) throw new Error();
			toast.success("Perfil excluído");
			fetchProfiles();
		} catch (_error) {
			toast.error("Erro ao excluir perfil");
		}
	};

	if (loading) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-violet-500" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl p-6">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Meus Cartões Digitais</h1>
					<p className="text-muted-foreground">
						Gerencie múltiplos perfis para diferentes contextos.
					</p>
				</div>
				<Dialog open={createOpen} onOpenChange={setCreateOpen}>
					<DialogTrigger asChild>
						<Button className="gap-2 bg-violet-600 hover:bg-violet-700">
							<Plus className="h-4 w-4" />
							Novo Perfil
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Criar Novo Perfil</DialogTitle>
							<DialogDescription>
								Escolha um nome de usuário único para o seu novo cartão.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="slug">Nome de usuário (slug)</Label>
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground">veredasinc.com.br/connect/</span>
									<Input
										id="slug"
										placeholder="seu-nome"
										value={newSlug}
										onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
									/>
								</div>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setCreateOpen(false)}>
								Cancelar
							</Button>
							<Button onClick={handleCreate} disabled={isCreating}>
								{isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Perfil"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{profiles.map((profile) => (
					<Card
						key={profile.id}
						className="overflow-hidden transition-all hover:border-violet-500/50 hover:shadow-lg"
					>
						<CardHeader className="bg-muted/50 pb-4 pt-6">
							<div className="flex items-start justify-between">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
									<CreditCard className="h-6 w-6" />
								</div>
								<div className="flex gap-1">
									<Link href={`/${profile.slug}`} target="_blank">
										<Button
											size="icon"
											variant="ghost"
											className="h-8 w-8 text-muted-foreground hover:text-foreground"
										>
											<ExternalLink className="h-4 w-4" />
										</Button>
									</Link>
									<Button
										size="icon"
										variant="ghost"
										className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
										onClick={() => handleDelete(profile.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<CardTitle className="mt-4 break-all">
								{profile.displayName || `@${profile.slug}`}
							</CardTitle>
							<p className="text-sm text-muted-foreground">
								veredasinc.com.br/connect/{profile.slug}
							</p>
						</CardHeader>
						<CardContent className="py-4">
							<div className="space-y-1 text-sm">
								<p className="font-medium">{profile.jobTitle || "Sem cargo"}</p>
								<p className="text-muted-foreground">{profile.company || "Sem empresa"}</p>
							</div>
						</CardContent>
						<CardFooter className="border-t bg-muted/20 p-2">
							<Link href={`/editor?id=${profile.id}`} className="w-full">
								<Button
									variant="ghost"
									className="w-full gap-2 text-violet-600 hover:bg-violet-50 hover:text-violet-700 dark:text-violet-400 dark:hover:bg-violet-900/20"
								>
									<Edit2 className="h-4 w-4" />
									Editar Cartão
								</Button>
							</Link>
						</CardFooter>
					</Card>
				))}

				{profiles.length === 0 && (
					<div className="col-span-full py-12 text-center">
						<p className="text-muted-foreground">Você ainda não criou nenhum perfil.</p>
					</div>
				)}
			</div>
		</div>
	);
}
