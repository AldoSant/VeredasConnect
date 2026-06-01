export interface PricingPlan {
	name: string;
	price: string;
	description: string;
	cta: string;
	highlighted?: boolean;
	features: string[];
}

export const pricingPlans: PricingPlan[] = [
	{
		name: "Starter",
		price: "R$ 39/mês",
		description: "Para profissionais que precisam de presença digital premium e contato rápido.",
		cta: "Começar simples",
		features: [
			"Página pública premium",
			"Links, WhatsApp e vCard",
			"QR Code para cartão físico",
			"Analytics básico",
		],
	},
	{
		name: "Pro",
		price: "R$ 79/mês",
		description:
			"Para vender melhor com captação de leads, automações e operação comercial mensurável.",
		cta: "Escolher Pro",
		highlighted: true,
		features: [
			"Tudo do Starter",
			"Formulário de leads com LGPD",
			"CRM de leads e tags",
			"Webhook para automações e integrações",
			"Relatórios de conversão",
		],
	},
	{
		name: "Equipe",
		price: "R$ 149/mês",
		description: "Para imobiliárias, clínicas e times comerciais com vários perfis e atendentes.",
		cta: "Montar equipe",
		features: [
			"Tudo do Pro",
			"Perfis por colaborador",
			"Organização e times",
			"Ranking e acompanhamento comercial",
			"Suporte para cartões NFC",
		],
	},
];
