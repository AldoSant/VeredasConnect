export const supportedAutomationEvents = [
	"lead.created",
	"webhook.test",
	"link.clicked",
	"vcard.downloaded",
] as const;

export type SupportedAutomationEvent = (typeof supportedAutomationEvents)[number];

export type AutomationLifecycleStage =
	| "capture"
	| "qualify"
	| "route"
	| "follow-up"
	| "sync"
	| "score"
	| "report";

export interface AutomationRecipe {
	id: string;
	title: string;
	summary: string;
	lifecycleStage: AutomationLifecycleStage;
	events: SupportedAutomationEvent[];
	destinationCategory: string;
	outcomes: string[];
	implementationNotes: string[];
}

export const automationRecipes: AutomationRecipe[] = [
	{
		id: "lead-intake-qualification",
		title: "Captação e qualificação de leads",
		summary:
			"Transforma formulários recebidos em contatos qualificados, com campos padronizados e prioridade inicial.",
		lifecycleStage: "capture",
		events: ["lead.created"],
		destinationCategory: "Sistema de relacionamento ou base operacional",
		outcomes: [
			"Contato registrado com origem e perfil responsável",
			"Lead classificado por intenção, canal e completude dos dados",
			"Próxima ação definida sem depender de triagem manual",
		],
		implementationNotes: [
			"Validar consentimento LGPD antes de qualquer enriquecimento externo.",
			"Normalizar telefone, email e empresa antes de sincronizar com sistemas terceiros.",
		],
	},
	{
		id: "smart-owner-routing",
		title: "Roteamento inteligente de responsável",
		summary:
			"Distribui oportunidades por perfil, time, horário, território, serviço ou regra comercial.",
		lifecycleStage: "route",
		events: ["lead.created"],
		destinationCategory: "Fila comercial ou motor de atribuição",
		outcomes: [
			"Lead chega ao responsável correto",
			"Tempo de primeira resposta reduzido",
			"Times ganham rastreabilidade de distribuição",
		],
		implementationNotes: [
			"Começar com regras determinísticas antes de algoritmos de pontuação complexos.",
			"Registrar o motivo da atribuição para auditoria comercial.",
		],
	},
	{
		id: "timed-follow-up-sequence",
		title: "Sequência de follow-up",
		summary:
			"Agenda lembretes e mensagens graduais quando um contato ainda não recebeu retorno ou não converteu.",
		lifecycleStage: "follow-up",
		events: ["lead.created", "link.clicked", "vcard.downloaded"],
		destinationCategory: "Canal de comunicação ou agenda operacional",
		outcomes: [
			"Nenhum lead fica sem retorno",
			"Follow-up acontece no momento certo",
			"Contato recorrente vira processo, não improviso",
		],
		implementationNotes: [
			"Usar janelas de espera e checar status antes de enviar nova ação.",
			"Evitar excesso de mensagens para preservar reputação e experiência.",
		],
	},
	{
		id: "contact-enrichment",
		title: "Enriquecimento de contato",
		summary:
			"Complementa dados do contato e da empresa para apoiar abordagem consultiva e segmentação.",
		lifecycleStage: "qualify",
		events: ["lead.created"],
		destinationCategory: "Serviço de enriquecimento ou base cadastral",
		outcomes: [
			"Dados comerciais mais completos",
			"Segmentos e perfis de conta mais claros",
			"Abordagem personalizada com menos pesquisa manual",
		],
		implementationNotes: [
			"Executar somente quando houver base legal e necessidade comercial clara.",
			"Persistir a fonte e data do enriquecimento.",
		],
	},
	{
		id: "pipeline-sync",
		title: "Sincronização de pipeline",
		summary: "Cria ou atualiza oportunidades em qualquer sistema de registro usado pelo cliente.",
		lifecycleStage: "sync",
		events: ["lead.created", "webhook.test"],
		destinationCategory: "CRM, banco operacional ou sistema de registro",
		outcomes: [
			"Operação mantém sua fonte de verdade atualizada",
			"Dados do Veredas entram no fluxo comercial existente",
			"Equipe evita retrabalho de cadastro manual",
		],
		implementationNotes: [
			"Usar chave de idempotência baseada em evento + lead/profile para evitar duplicidade.",
			"Separar criação, atualização e erro de sincronização em ramos distintos.",
		],
	},
	{
		id: "engagement-scoring",
		title: "Pontuação de engajamento",
		summary:
			"Converte cliques, downloads e leads em sinais de intenção para priorizar atendimento.",
		lifecycleStage: "score",
		events: ["lead.created", "link.clicked", "vcard.downloaded"],
		destinationCategory: "Motor de score ou analytics operacional",
		outcomes: [
			"Oportunidades quentes sobem na fila",
			"Ações offline e online viram sinais mensuráveis",
			"Gestores entendem quais ativos geram intenção real",
		],
		implementationNotes: [
			"Atribuir pesos simples por evento antes de modelos avançados.",
			"Manter score explicável para o time comercial confiar no ranking.",
		],
	},
	{
		id: "weekly-performance-digest",
		title: "Resumo semanal de performance",
		summary: "Agrupa leads, cliques, downloads e conversões em um relatório acionável para gestão.",
		lifecycleStage: "report",
		events: ["lead.created", "link.clicked", "vcard.downloaded"],
		destinationCategory: "Relatório executivo ou dashboard operacional",
		outcomes: [
			"Gestão acompanha evolução sem abrir múltiplas telas",
			"Campanhas, cartões e perfis podem ser comparados",
			"Próximas decisões ficam baseadas em dados reais",
		],
		implementationNotes: [
			"Consolidar por perfil, time, campanha e período.",
			"Destacar anomalias, crescimento e gargalos de resposta.",
		],
	},
];
