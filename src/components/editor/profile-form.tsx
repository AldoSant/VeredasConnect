"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { validateAutomationUrl } from "@/lib/automation-url";
import { apiPath } from "@/lib/paths";
import { WebhookDeliveryHistory } from "./webhook-delivery-history";
import { WebhookHealthPanel } from "./webhook-health-panel";

interface ProfileFormProps {
	displayName: string;
	bio: string;
	avatarUrl: string;
	jobTitle?: string;
	company?: string;
	phone?: string;
	whatsapp?: string;
	leadFormActive?: boolean;
	leadFormTitle?: string;
	onDisplayNameChange: (value: string) => void;
	onBioChange: (value: string) => void;
	onAvatarUrlChange: (value: string) => void;
	onJobTitleChange?: (value: string) => void;
	onCompanyChange?: (value: string) => void;
	onPhoneChange?: (value: string) => void;
	onWhatsappChange?: (value: string) => void;
	onLeadFormActiveChange?: (value: boolean) => void;
	onLeadFormTitleChange?: (value: string) => void;
	profileId?: string;
	webhookUrl?: string;
	hasUnsavedChanges?: boolean;
	onWebhookUrlChange?: (value: string) => void;
}

export function ProfileForm({
	displayName,
	bio,
	avatarUrl,
	jobTitle = "",
	company = "",
	phone = "",
	whatsapp = "",
	leadFormActive = false,
	leadFormTitle = "",
	onDisplayNameChange,
	onBioChange,
	onAvatarUrlChange,
	onJobTitleChange,
	onCompanyChange,
	onPhoneChange,
	onWhatsappChange,
	onLeadFormActiveChange,
	onLeadFormTitleChange,
	profileId,
	webhookUrl = "",
	hasUnsavedChanges = false,
	onWebhookUrlChange,
}: ProfileFormProps) {
	const [isTestingWebhook, setIsTestingWebhook] = useState(false);
	const [deliveryHistoryRefreshKey, setDeliveryHistoryRefreshKey] = useState(0);

	const handleTestWebhook = async () => {
		const urlValidation = validateAutomationUrl(webhookUrl);
		if (!urlValidation.ok) {
			toast.error(urlValidation.error);
			return;
		}

		if (hasUnsavedChanges) {
			toast.error("Salve as alterações antes de enviar o teste.");
			return;
		}

		setIsTestingWebhook(true);
		try {
			const res = await fetch(apiPath("/api/webhook/test"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ profileId }),
			});
			const data = await res.json().catch(() => null);

			if (!res.ok) {
				throw new Error(data?.error ?? "Não foi possível enviar o teste.");
			}

			toast.success("Teste enviado com sucesso. Confira o status abaixo.");
			setDeliveryHistoryRefreshKey((key) => key + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Falha ao enviar o teste.");
		} finally {
			setIsTestingWebhook(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="displayName">Display Name</Label>
				<Input
					id="displayName"
					value={displayName}
					onChange={(e) => onDisplayNameChange(e.target.value)}
					maxLength={50}
					placeholder="Your name"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="jobTitle">Job Title</Label>
					<Input
						id="jobTitle"
						value={jobTitle}
						onChange={(e) => onJobTitleChange?.(e.target.value)}
						maxLength={50}
						placeholder="e.g. CEO, Sales Rep"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="company">Company</Label>
					<Input
						id="company"
						value={company}
						onChange={(e) => onCompanyChange?.(e.target.value)}
						maxLength={50}
						placeholder="Company Name"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="bio">Bio</Label>
				<Textarea
					id="bio"
					value={bio}
					onChange={(e) => onBioChange(e.target.value)}
					maxLength={160}
					placeholder="Tell the world about yourself"
					rows={3}
				/>
				<p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="phone">Phone</Label>
					<Input
						id="phone"
						value={phone}
						onChange={(e) => onPhoneChange?.(e.target.value)}
						maxLength={30}
						placeholder="+1 (555) 000-0000"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="whatsapp">WhatsApp</Label>
					<Input
						id="whatsapp"
						value={whatsapp}
						onChange={(e) => onWhatsappChange?.(e.target.value)}
						maxLength={30}
						placeholder="+1 (555) 000-0000"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="avatarUrl">Avatar URL</Label>
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarImage src={avatarUrl} alt="Avatar preview" />
						<AvatarFallback>{displayName?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
					</Avatar>
					<Input
						id="avatarUrl"
						value={avatarUrl}
						onChange={(e) => onAvatarUrlChange(e.target.value)}
						placeholder="https://example.com/avatar.png"
					/>
				</div>
			</div>

			<div className="rounded-xl border bg-muted/30 p-4 space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label htmlFor="leadFormActive" className="text-base font-semibold">
							Ativar Captação de Leads
						</Label>
						<p className="text-sm text-muted-foreground">
							Exibe um formulário no seu perfil para visitantes deixarem contato.
						</p>
					</div>
					<Switch
						aria-label="Ativar ou desativar a captação de leads"
						id="leadFormActive"
						checked={leadFormActive}
						onCheckedChange={onLeadFormActiveChange}
					/>
				</div>

				{leadFormActive && (
					<div className="space-y-2 pt-2">
						<Label htmlFor="leadFormTitle">Título do Formulário</Label>
						<Input
							id="leadFormTitle"
							value={leadFormTitle}
							onChange={(e) => onLeadFormTitleChange?.(e.target.value)}
							maxLength={60}
							placeholder="e.g. Solicite um Orçamento"
						/>
					</div>
				)}
			</div>

			{/* Automation Section */}
			<div className="rounded-xl border bg-muted/20 p-4 space-y-4">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-1">
						<h4 className="text-base font-semibold">Automação</h4>
						<p className="text-sm text-muted-foreground">
							Conecte sua página a uma ferramenta externa e acompanhe se os envios estão ativos.
						</p>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="webhookUrl">Endereço da automação</Label>
					<Input
						id="webhookUrl"
						value={webhookUrl}
						onChange={(e) => onWebhookUrlChange?.(e.target.value)}
						placeholder="https://sua-ferramenta.com/automacao/veredas-connect"
					/>
					<p className="text-xs text-muted-foreground">
						Não cole senhas ou chaves secretas aqui. Use apenas o endereço fornecido pela sua
						ferramenta de automação.
					</p>
				</div>
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-muted-foreground">Salve antes de testar.</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="shrink-0 gap-2"
						disabled={isTestingWebhook || !webhookUrl.trim()}
						onClick={handleTestWebhook}
					>
						{isTestingWebhook ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Send className="h-4 w-4" />
						)}
						Enviar teste
					</Button>
				</div>
				<WebhookHealthPanel profileId={profileId} refreshKey={deliveryHistoryRefreshKey} />
				<WebhookDeliveryHistory profileId={profileId} refreshKey={deliveryHistoryRefreshKey} />
			</div>
		</div>
	);
}
