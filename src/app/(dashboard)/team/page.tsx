"use client";

import { BarChart3, ChevronRight, CreditCard, Loader2, Mail, User, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiPath } from "@/lib/paths";

interface Member {
	id: string;
	name: string;
	email: string;
	profilesCount: number;
	leadsCount: number;
}

interface TeamData {
	teamName: string;
	stats: {
		totalLeads: number;
		totalProfiles: number;
		memberCount: number;
	};
	members: Member[];
}

export default function TeamPage() {
	const [data, setData] = useState<TeamData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchTeamData = useCallback(async () => {
		try {
			const res = await fetch(apiPath("/api/team"));
			if (!res.ok) throw new Error("Falha ao carregar dados do time");
			const json = await res.json();
			setData(json);
		} catch (_error) {
			toast.error("Erro ao carregar equipe");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTeamData();
	}, [fetchTeamData]);

	if (loading) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-violet-600" />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="mx-auto max-w-4xl p-12 text-center">
				<Users className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
				<h2 className="mt-4 text-xl font-semibold">Nenhuma equipe vinculada</h2>
				<p className="text-muted-foreground">
					Você ainda não foi designado como supervisor de nenhuma equipe.
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Equipe: {data.teamName}</h1>
				<p className="text-muted-foreground">
					Visão geral da performance institucional e gestão de membros.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="mb-8 grid gap-4 md:grid-cols-3">
				<Card className="bg-violet-50/50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-900/20">
					<CardHeader className="pb-2">
						<CardDescription className="text-violet-600 dark:text-violet-400 font-medium">
							Total de Membros
						</CardDescription>
						<CardTitle className="text-3xl">{data.stats.memberCount}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-xs text-muted-foreground">Colaboradores ativos no time</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="font-medium">Cartões Ativos</CardDescription>
						<CardTitle className="text-3xl">{data.stats.totalProfiles}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-xs text-muted-foreground">Perfis digitais em circulação</div>
					</CardContent>
				</Card>
				<Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20">
					<CardHeader className="pb-2">
						<CardDescription className="text-emerald-600 dark:text-emerald-400 font-medium">
							Leads Capturados
						</CardDescription>
						<CardTitle className="text-3xl">{data.stats.totalLeads}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-xs text-muted-foreground">Contatos gerados pela equipe</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Members List */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Membros da Equipe</CardTitle>
						<CardDescription>Gerencie e monitore cada integrante individualmente.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="divide-y">
							{data.members.map((member) => (
								<div
									key={member.id}
									className="group flex items-center justify-between py-4 transition-colors hover:bg-muted/30 px-2 rounded-lg"
								>
									<div className="flex items-center gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
											<User className="h-5 w-5" />
										</div>
										<div>
											<p className="font-medium">{member.name}</p>
											<div className="flex items-center gap-3 text-xs text-muted-foreground">
												<span className="flex items-center gap-1">
													<Mail className="h-3 w-3" /> {member.email}
												</span>
											</div>
										</div>
									</div>
									<div className="flex items-center gap-6 text-sm">
										<div className="text-center">
											<p className="font-semibold">{member.profilesCount}</p>
											<p className="text-[10px] uppercase text-muted-foreground">Cards</p>
										</div>
										<div className="text-center">
											<p className="font-semibold text-emerald-600">{member.leadsCount}</p>
											<p className="text-[10px] uppercase text-muted-foreground">Leads</p>
										</div>
										<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<Link href={`/profiles?userId=${member.id}`}>
												<Button variant="ghost" size="icon" title="Ver Perfis">
													<CreditCard className="h-4 w-4" />
												</Button>
											</Link>
											<Link href={`/leads?userId=${member.id}`}>
												<Button variant="ghost" size="icon" title="Ver Leads">
													<Users className="h-4 w-4" />
												</Button>
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions / Insights */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Ações Rápidas</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-2">
							<Link href="/leads">
								<Button variant="outline" className="w-full justify-start gap-2">
									<BarChart3 className="h-4 w-4" />
									Ver Todos os Leads do Time
								</Button>
							</Link>
							<Button
								variant="outline"
								className="w-full justify-start gap-2"
								onClick={() =>
									toast.info("Funcionalidade em desenvolvimento: Exportar Relatório consolidado")
								}
							>
								<ChevronRight className="h-4 w-4" />
								Exportar Relatório do Time
							</Button>
						</CardContent>
					</Card>

					<Card className="bg-muted/50 border-none">
						<CardHeader>
							<CardTitle className="text-lg">Insight Institucional</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Sua equipe gerou uma média de{" "}
								<strong>
									{(data.stats.totalLeads / (data.stats.memberCount || 1)).toFixed(1)} leads
								</strong>{" "}
								por integrante. O melhor desempenho do time reflete o engajamento individual com o
								compartilhamento dos cartões NFC.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
