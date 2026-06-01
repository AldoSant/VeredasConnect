import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import {
	getProfileCompletion,
	type ProfileCompletionLink,
	type ProfileCompletionProfile,
} from "@/lib/profile-completion";
import { cn } from "@/lib/utils";

interface OnboardingChecklistProps {
	profile: ProfileCompletionProfile;
	links: ProfileCompletionLink[];
}

export function OnboardingChecklist({ profile, links }: OnboardingChecklistProps) {
	const completion = getProfileCompletion(profile, links);

	if (completion.isComplete) {
		return (
			<Card className="border-emerald-500/20 bg-emerald-500/5">
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
						<CheckCircle2 className="h-5 w-5" />
						<h2 className="text-xl font-semibold">Perfil pronto para compartilhar</h2>
					</div>
					<CardDescription>
						Sua página já tem os principais elementos para gerar confiança e conversão.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="border-violet-500/20 bg-violet-500/5">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between gap-4">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<Sparkles className="h-5 w-5 text-violet-500" />
							<h3 className="text-lg font-semibold">Complete sua página</h3>
						</div>
						<CardDescription>
							Finalize estes passos para publicar uma presença mais confiável.
						</CardDescription>
					</div>
					<div className="text-right">
						<div className="text-2xl font-bold text-violet-600">{completion.percentage}%</div>
						<div className="text-xs text-muted-foreground">
							{completion.completedCount}/{completion.totalCount} concluídos
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="h-2 overflow-hidden rounded-full bg-muted">
					<div
						className="h-full rounded-full bg-violet-500 transition-all"
						style={{ width: `${completion.percentage}%` }}
					/>
				</div>
				<ul className="space-y-3">
					{completion.items.map((item) => {
						const Icon = item.completed ? CheckCircle2 : Circle;

						return (
							<li key={item.id} className="flex gap-3">
								<Icon
									className={cn(
										"mt-0.5 h-4 w-4 shrink-0",
										item.completed ? "text-emerald-500" : "text-muted-foreground",
									)}
								/>
								<div className="space-y-0.5">
									<p className="text-sm font-medium">{item.label}</p>
									<p className="text-xs text-muted-foreground">{item.description}</p>
								</div>
							</li>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
}
