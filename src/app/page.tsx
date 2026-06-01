import {
	ArrowRight,
	BarChart3,
	CalendarCheck,
	CheckCircle2,
	DownloadCloud,
	ExternalLink,
	Fingerprint,
	Layers3,
	LineChart,
	LockKeyhole,
	MousePointerClick,
	QrCode,
	ShieldCheck,
	Sparkles,
	Users,
	Webhook,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { automationRecipes } from "@/lib/automation-recipes";
import { pricingPlans } from "@/lib/pricing";

const outcomes = [
	"Perfil público com SEO pronto para Google e WhatsApp",
	"vCard, QR Code, links, leads e analytics no mesmo fluxo",
	"Base preparada para NFC, eventos, equipes e operação comercial",
];

const trustMetrics = [
	{ label: "tempo para publicar", value: "3 min" },
	{ label: "ativos centrais", value: "1 link" },
	{ label: "dados acionáveis", value: "24/7" },
];

const premiumFeatures = [
	{
		icon: Fingerprint,
		title: "Identidade digital premium",
		description:
			"Transforme presença online em autoridade com páginas rápidas, elegantes e fáceis de compartilhar.",
	},
	{
		icon: MousePointerClick,
		title: "Conversão sem atrito",
		description:
			"Links, chamadas, WhatsApp, agenda e captura de leads desenhados para o próximo passo acontecer.",
	},
	{
		icon: LineChart,
		title: "Inteligência comercial",
		description:
			"Analytics e sinais de interação para entender quais canais, ofertas e contatos geram resultado.",
	},
	{
		icon: ShieldCheck,
		title: "Operação confiável",
		description:
			"Arquitetura moderna, autenticação segura e base preparada para escalar perfis, equipes e campanhas.",
	},
];

const useCases = [
	"Corretores, consultores e especialistas",
	"Empresas locais com múltiplos atendentes",
	"Eventos, cartões NFC e campanhas offline",
	"Portfólios comerciais e páginas de alta confiança",
];

const journeySteps = [
	{
		label: "01",
		title: "Crie sua identidade",
		description: "Nome, bio, foto, slug profissional e posicionamento claro em poucos campos.",
	},
	{
		label: "02",
		title: "Organize o caminho",
		description: "Agrupe links, serviços, agenda, depoimentos e contato sem poluir a experiência.",
	},
	{
		label: "03",
		title: "Meça e evolua",
		description: "Acompanhe cliques, leads e sinais de intenção para ajustar oferta e abordagem.",
	},
];

export default function Home() {
	return (
		<main className="relative min-h-screen overflow-hidden bg-[#020308] text-[#f7f8f8] selection:bg-indigo-500/30">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[150px]" />
				<div className="absolute bottom-[8%] left-[-18rem] h-[38rem] w-[38rem] rounded-full bg-emerald-500/10 blur-[130px]" />
				<div className="absolute right-[-18rem] top-[25%] h-[40rem] w-[40rem] rounded-full bg-violet-600/15 blur-[150px]" />
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_top,black,transparent_72%)]" />
			</div>

			<header className="relative z-10 border-white/10 border-b bg-black/20 backdrop-blur-2xl">
				<nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
					<Link href="/" className="group flex items-center gap-3" aria-label="Veredas Connect">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
							<Layers3 className="h-5 w-5 text-indigo-300 transition-transform group-hover:-rotate-6" />
						</div>
						<div>
							<p className="font-semibold text-sm tracking-tight">Veredas Connect</p>
							<p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
								Digital identity OS
							</p>
						</div>
					</Link>

					<div className="hidden items-center gap-8 text-sm font-medium text-white/55 md:flex">
						<a href="#valor" className="transition-colors hover:text-white">
							Valor
						</a>
						<a href="#experiencia" className="transition-colors hover:text-white">
							Experiência
						</a>
						<a href="#planos" className="transition-colors hover:text-white">
							Planos
						</a>
						<a href="#operacao" className="transition-colors hover:text-white">
							Operação
						</a>
					</div>

					<Link
						href="/login"
						className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/80 transition-all hover:border-indigo-300/40 hover:bg-white/[0.08] hover:text-white"
					>
						Entrar
					</Link>
				</nav>
			</header>

			<section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 md:py-28 lg:grid-cols-[1.02fr_0.98fr] lg:py-32">
				<div className="space-y-10 text-center lg:text-left">
					<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-200 shadow-[0_0_40px_rgba(99,102,241,0.22)] backdrop-blur-xl">
						<Sparkles className="h-4 w-4" />
						Estado da arte para networking premium
					</div>

					<div className="space-y-6">
						<h1 className="text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-white md:text-7xl xl:text-8xl">
							Sua presença digital, organizada para gerar confiança e negócios.
						</h1>
						<p className="mx-auto max-w-2xl text-lg leading-8 text-white/62 md:text-xl lg:mx-0">
							O Veredas Connect une link inteligente, cartão digital, QR/NFC, captação de leads e
							analytics em uma experiência premium para profissionais e marcas que precisam ser
							lembrados.
						</p>
					</div>

					<div className="grid gap-3 text-left sm:grid-cols-3">
						{outcomes.map((outcome) => (
							<div
								key={outcome}
								className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl"
							>
								<CheckCircle2 className="mb-3 h-4 w-4 text-emerald-300" />
								<p className="text-sm leading-6 text-white/70">{outcome}</p>
							</div>
						))}
					</div>

					<div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
						<Link
							href="/signup"
							className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 font-semibold text-black shadow-[0_24px_80px_rgba(255,255,255,0.16)] transition-all hover:-translate-y-0.5 hover:shadow-[0_30px_100px_rgba(129,140,248,0.25)] active:translate-y-0 sm:w-auto"
						>
							Criar minha página premium
							<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
							<span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
						</Link>
						<a
							href="#experiencia"
							className="flex w-full items-center justify-center gap-3 rounded-2xl border border-indigo-300/20 bg-indigo-400/[0.06] px-8 py-4 font-semibold text-indigo-100 transition-all hover:border-indigo-200/40 hover:bg-indigo-400/[0.1] sm:w-auto"
						>
							Ver experiência
							<ExternalLink className="h-4 w-4" />
						</a>
					</div>
				</div>

				<div className="relative mx-auto w-full max-w-xl">
					<div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-indigo-500/20 via-violet-500/10 to-emerald-400/20 blur-3xl" />
					<div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#08090a]/85 shadow-2xl backdrop-blur-3xl">
						<div className="flex items-center justify-between border-white/10 border-b px-5 py-4">
							<div className="flex gap-2">
								<span className="h-3 w-3 rounded-full border border-red-400/30 bg-red-400/20" />
								<span className="h-3 w-3 rounded-full border border-yellow-400/30 bg-yellow-400/20" />
								<span className="h-3 w-3 rounded-full border border-emerald-400/30 bg-emerald-400/20" />
							</div>
							<div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
								veredasinc.com.br/connect/ana
							</div>
						</div>

						<div className="grid gap-5 p-5 sm:p-7">
							<div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
								<div className="relative mx-auto mb-5 h-24 w-24">
									<div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-300 opacity-70 blur-sm" />
									<div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-white/20 bg-[#111318] text-3xl font-semibold text-white/60">
										AV
									</div>
								</div>
								<h2 className="text-2xl font-semibold tracking-tight">Ana Veredas</h2>
								<p className="mt-2 text-sm text-indigo-200">Consultora em negócios digitais</p>
								<p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-white/55">
									Estratégia, presença e conexões de alto valor para empresas locais em expansão.
								</p>
							</div>

							<div className="grid gap-3">
								{[
									"Agendar diagnóstico estratégico",
									"Baixar apresentação comercial",
									"Falar no WhatsApp agora",
								].map((title, index) => (
									<div
										key={title}
										className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-300/30 hover:bg-white/[0.07]"
									>
										<div className="flex items-center gap-3">
											<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-semibold text-white/45">
												0{index + 1}
											</div>
											<span className="text-sm font-semibold text-white/85">{title}</span>
										</div>
										<ExternalLink className="h-4 w-4 text-white/25 transition-colors group-hover:text-indigo-200" />
									</div>
								))}
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
									<QrCode className="mb-4 h-5 w-5 text-indigo-200" />
									<p className="text-sm font-semibold">QR/NFC-ready</p>
									<p className="mt-1 text-xs text-white/45">
										Pronto para eventos e cartões físicos.
									</p>
								</div>
								<div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
									<DownloadCloud className="mb-4 h-5 w-5 text-emerald-200" />
									<p className="text-sm font-semibold">vCard instantâneo</p>
									<p className="mt-1 text-xs text-white/45">Contato salvo sem fricção.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="valor" className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-20">
				<div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl md:grid-cols-3 md:p-6">
					{trustMetrics.map((metric) => (
						<div
							key={metric.label}
							className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6 text-center"
						>
							<p className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
								{metric.value}
							</p>
							<p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/38">
								{metric.label}
							</p>
						</div>
					))}
				</div>
			</section>

			<section id="experiencia" className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
						Experiência premium ponta a ponta
					</p>
					<h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
						Mais do que link na bio: uma camada comercial para relacionamento.
					</h2>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{premiumFeatures.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="group rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 transition-all hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-white/[0.06]"
							>
								<div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-indigo-200">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
								<p className="mt-4 text-sm leading-7 text-white/55">{feature.description}</p>
							</div>
						);
					})}
				</div>
			</section>

			<section id="planos" className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
						Produto comercial
					</p>
					<h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
						Planos claros para vender página, cartão e automação como pacote.
					</h2>
					<p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/58">
						A base já nasce pronta para automação: cada lead, clique ou vCard pode acionar
						qualificação, roteamento, follow-up, sincronização e relatórios sem prender a plataforma
						a uma única ferramenta.
					</p>
				</div>

				<div className="grid gap-4 lg:grid-cols-3">
					{pricingPlans.map((plan) => (
						<div
							key={plan.name}
							className={`relative rounded-[1.8rem] border p-6 transition-all hover:-translate-y-1 ${
								plan.highlighted
									? "border-indigo-300/45 bg-indigo-400/[0.09] shadow-[0_24px_90px_rgba(99,102,241,0.22)]"
									: "border-white/10 bg-white/[0.035]"
							}`}
						>
							{plan.highlighted ? (
								<div className="absolute right-5 top-5 rounded-full border border-indigo-200/25 bg-indigo-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-100">
									Mais vendável
								</div>
							) : null}
							<h3 className="text-2xl font-semibold tracking-tight">{plan.name}</h3>
							<p className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white">
								{plan.price}
							</p>
							<p className="mt-4 min-h-16 text-sm leading-7 text-white/58">{plan.description}</p>
							<Link
								href="/signup"
								className={`mt-6 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 font-semibold transition-all ${
									plan.highlighted
										? "bg-white text-black hover:-translate-y-0.5"
										: "border border-white/10 bg-black/20 text-white/78 hover:bg-black/30 hover:text-white"
								}`}
							>
								{plan.cta}
							</Link>
							<ul className="mt-6 space-y-3">
								{plan.features.map((feature) => (
									<li key={feature} className="flex gap-3 text-sm leading-6 text-white/68">
										<CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-6 flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-black/25 p-6 text-white/65 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
					<div className="flex gap-4">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/20 bg-emerald-300/10">
							<Webhook className="h-5 w-5 text-emerald-200" />
						</div>
						<div>
							<p className="font-semibold text-white">Automação aberta, padrão de mercado</p>
							<p className="mt-1 text-sm leading-6">
								O Veredas envia eventos JSON estáveis para um orquestrador; a operação escolhe as
								ferramentas de relacionamento, dados, comunicação e análise que já usa.
							</p>
						</div>
					</div>
					<Link
						href="/login"
						className="shrink-0 rounded-2xl bg-white px-5 py-3 font-semibold text-black"
					>
						Configurar integração
					</Link>
				</div>
			</section>

			<section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
						Automação comercial aberta
					</p>
					<h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
						Receitas de automação sem vendor lock-in.
					</h2>
					<p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/58">
						Em vez de vender integração com uma ferramenta específica, o produto organiza os fluxos
						que empresas esperam: qualificar, rotear, acompanhar, sincronizar e medir.
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{automationRecipes.map((recipe) => (
						<div
							key={recipe.id}
							className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 transition-all hover:-translate-y-1 hover:border-emerald-300/25 hover:bg-white/[0.06]"
						>
							<div className="mb-5 flex items-center justify-between gap-3">
								<span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
									{recipe.lifecycleStage}
								</span>
								<span className="text-xs text-white/35">{recipe.events.join(" + ")}</span>
							</div>
							<h3 className="text-xl font-semibold tracking-tight text-white">{recipe.title}</h3>
							<p className="mt-3 text-sm leading-7 text-white/55">{recipe.summary}</p>
							<p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
								Categoria: {recipe.destinationCategory}
							</p>
						</div>
					))}
				</div>
			</section>

			<section
				id="operacao"
				className="relative z-10 mx-auto grid max-w-7xl gap-6 px-6 py-16 md:py-24 lg:grid-cols-[0.9fr_1.1fr]"
			>
				<div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 md:p-10">
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
						Fluxo operacional
					</p>
					<h2 className="text-4xl font-semibold tracking-[-0.045em] md:text-5xl">
						Do primeiro clique ao relacionamento recorrente.
					</h2>
					<p className="mt-6 text-base leading-8 text-white/58">
						A plataforma foi pensada para unir estética, velocidade e utilidade real: publicar
						rápido, compartilhar em qualquer canal e aprender com os dados.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						{useCases.map((item) => (
							<span
								key={item}
								className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/62"
							>
								{item}
							</span>
						))}
					</div>
				</div>

				<div className="grid gap-4">
					{journeySteps.map((step) => (
						<div
							key={step.label}
							className="flex gap-5 rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 transition-all hover:bg-white/[0.055]"
						>
							<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-sm font-semibold text-indigo-200">
								{step.label}
							</div>
							<div>
								<h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
								<p className="mt-2 text-sm leading-7 text-white/55">{step.description}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
				<div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-indigo-500/[0.08] to-emerald-400/[0.06] p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:p-14">
					<div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
						<Zap className="h-6 w-6 text-indigo-100" />
					</div>
					<h2 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
						Publique uma presença que parece premium porque funciona como premium.
					</h2>
					<p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60">
						Comece com uma página, evolua para operação comercial e transforme cada ponto de contato
						em relacionamento mensurável.
					</p>
					<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
						<Link
							href="/signup"
							className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-black transition-all hover:-translate-y-0.5"
						>
							Começar agora
							<ArrowRight className="h-5 w-5" />
						</Link>
						<Link
							href="/login"
							className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-8 py-4 font-semibold text-white/78 transition-all hover:bg-black/30 hover:text-white"
						>
							Acessar plataforma
						</Link>
					</div>
				</div>
			</section>

			<footer className="relative z-10 border-white/10 border-t px-6 py-10 text-center text-sm text-white/40">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
					<p>© 2026 Veredas Connect. Identidade digital premium para conexões reais.</p>
					<div className="flex items-center gap-5">
						<span className="inline-flex items-center gap-2">
							<LockKeyhole className="h-4 w-4" /> Seguro
						</span>
						<span className="inline-flex items-center gap-2">
							<BarChart3 className="h-4 w-4" /> Mensurável
						</span>
						<span className="inline-flex items-center gap-2">
							<Users className="h-4 w-4" /> Escalável
						</span>
						<span className="inline-flex items-center gap-2">
							<CalendarCheck className="h-4 w-4" /> Operacional
						</span>
					</div>
				</div>
			</footer>
		</main>
	);
}
