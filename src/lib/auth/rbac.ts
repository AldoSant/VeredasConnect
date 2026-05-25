import { eq, inArray, type SQL } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { leads, profiles } from "@/lib/db/schema";

export type UserScope = {
	id: string;
	role: "ADMIN" | "SUPERVISOR" | "MEMBER";
	organizationId: string | null;
	teamId: string | null;
};

/**
 * Retorna o escopo do usuário logado ou lança erro se não autenticado.
 */
export async function getSessionScope(): Promise<UserScope> {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	return {
		id: session.user.id,
		role: session.user.role || "MEMBER",
		organizationId: session.user.organizationId || null,
		teamId: session.user.teamId || null,
	};
}

/**
 * Gera um filtro para o Drizzle baseado na hierarquia institucional.
 * @param table A tabela alvo (profiles ou leads)
 * @param scope O escopo do usuário obtido via getSessionScope
 */
export async function getHierarchyFilter(
	table: typeof profiles | typeof leads,
	scope: UserScope,
): Promise<SQL | undefined> {
	// ADMIN: Vê tudo da Organização
	if (scope.role === "ADMIN" && scope.organizationId) {
		return eq(table.organizationId, scope.organizationId);
	}

	// SUPERVISOR: Vê tudo do seu Time
	if (scope.role === "SUPERVISOR" && scope.teamId) {
		return eq(table.teamId, scope.teamId);
	}

	// MEMBER (ou fallback): Vê apenas seus próprios registros
	if (table === profiles) {
		return eq(profiles.userId, scope.id);
	}

	if (table === leads) {
		// Para leads, buscamos os perfis do usuário primeiro
		const userProfiles = await db
			.select({ id: profiles.id })
			.from(profiles)
			.where(eq(profiles.userId, scope.id));

		const profileIds = userProfiles.map((p) => p.id);

		if (profileIds.length === 0) {
			// Se não tem perfis, não tem leads (filtro que não retorna nada)
			return eq(leads.id, "none");
		}

		return inArray(leads.profileId, profileIds);
	}

	return undefined;
}

/**
 * Versão simplificada que usa os novos campos contextuais (orgId/teamId)
 * que injetaremos na criação de cada registro.
 */
export function getContextFields(scope: UserScope) {
	return {
		organizationId: scope.organizationId,
		teamId: scope.teamId,
	};
}
