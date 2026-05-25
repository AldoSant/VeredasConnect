"use client";

import { Building2, Loader2, MoreVertical, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiPath } from "@/lib/paths";

interface User {
	id: string;
	name: string;
	email: string;
	role: "ADMIN" | "SUPERVISOR" | "MEMBER";
	teamId: string | null;
}

interface Team {
	id: string;
	name: string;
}

interface OrgData {
	organization: { name: string };
	stats: {
		totalUsers: number;
		totalTeams: number;
		totalLeads: number;
		totalProfiles: number;
	};
	teams: Team[];
	users: User[];
}

export default function OrganizationPage() {
	const [data, setData] = useState<OrgData | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch(apiPath("/api/organization"));
			if (!res.ok) throw new Error();
			const json = await res.json();
			setData(json);
		} catch (_error) {
			toast.error("Erro ao carregar dados da organização");
		} finally {
			setLoading(false);
		}
	}, []);

	const updateUser = async (userId: string, role: string, teamId?: string | null) => {
		try {
			const res = await fetch(apiPath(`/api/organization/users/${userId}`), {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ role, teamId }),
			});
			if (!res.ok) throw new Error();
			toast.success("Membro atualizado");
			fetchData();
		} catch (_error) {
			toast.error("Erro ao atualizar membro");
		}
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (loading) {
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
			</div>
		);
	}

	if (!data) return null;

	return (
		<div className="mx-auto max-w-7xl p-6">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
						<Building2 className="h-8 w-8 text-blue-600" />
						{data.organization.name}
					</h1>
					<p className="text-muted-foreground">
						Portal Administrativo - Controle de Hierarquia e Times.
					</p>
				</div>
				<Button className="gap-2 bg-blue-600 hover:bg-blue-700">
					<Plus className="h-4 w-4" />
					Novo Time
				</Button>
			</div>

			{/* Global Stats */}
			<div className="mb-8 grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="font-medium">Total de Usuários</CardDescription>
						<CardTitle className="text-2xl">{data.stats.totalUsers}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="font-medium">Equipes Ativas</CardDescription>
						<CardTitle className="text-2xl">{data.stats.totalTeams}</CardTitle>
					</CardHeader>
				</Card>
				<Card className="bg-blue-50/30 dark:bg-blue-900/10">
					<CardHeader className="pb-2">
						<CardDescription className="text-blue-600 dark:text-blue-400 font-medium">
							Performance Global (Leads)
						</CardDescription>
						<CardTitle className="text-2xl">{data.stats.totalLeads}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardDescription className="font-medium">Total de Perfis</CardDescription>
						<CardTitle className="text-2xl">{data.stats.totalProfiles}</CardTitle>
					</CardHeader>
				</Card>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Membros e Cargos</CardTitle>
						<CardDescription>Gerencie permissões e atribua membros a equipes.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="relative w-full overflow-auto">
							<table className="w-full caption-bottom text-sm">
								<thead className="[&_tr]:border-b">
									<tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
										<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
											Nome
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
											E-mail
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
											Cargo
										</th>
										<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
											Equipe
										</th>
										<th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
											Ações
										</th>
									</tr>
								</thead>
								<tbody className="[&_tr:last-child]:border-0">
									{data.users.map((user) => (
										<tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
											<td className="p-4 align-middle font-medium">{user.name}</td>
											<td className="p-4 align-middle">{user.email}</td>
											<td className="p-4 align-middle">
												<span
													className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
														user.role === "ADMIN"
															? "bg-blue-100 text-blue-800"
															: user.role === "SUPERVISOR"
																? "bg-violet-100 text-violet-800"
																: "bg-slate-100 text-slate-800"
													}`}
												>
													{user.role}
												</span>
											</td>
											<td className="p-4 align-middle">
												{data.teams.find((t) => t.id === user.teamId)?.name || "Nenhuma"}
											</td>
											<td className="p-4 align-middle text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Alterar Cargo</DropdownMenuLabel>
														<DropdownMenuItem onClick={() => updateUser(user.id, "MEMBER")}>
															Membro Comum
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => updateUser(user.id, "SUPERVISOR")}>
															Supervisor
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => updateUser(user.id, "ADMIN")}>
															Administrador
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuLabel>Atribuir Equipe</DropdownMenuLabel>
														<DropdownMenuItem onClick={() => updateUser(user.id, user.role, null)}>
															Remover de Equipes
														</DropdownMenuItem>
														{data.teams.map((team) => (
															<DropdownMenuItem
																key={team.id}
																onClick={() => updateUser(user.id, user.role, team.id)}
															>
																{team.name}
															</DropdownMenuItem>
														))}
													</DropdownMenuContent>
												</DropdownMenu>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
