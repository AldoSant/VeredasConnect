"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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
	webhookUrl?: string;
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
	webhookUrl = "",
	onWebhookUrlChange,
}: ProfileFormProps) {
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

			{/* Integrations Section */}
			<div className="rounded-xl border bg-muted/30 p-4 space-y-4">
				<div className="space-y-0.5">
					<h4 className="text-base font-semibold">Integrações (Webhook)</h4>
					<p className="text-sm text-muted-foreground">
						Cole aqui a URL do Zapier, n8n ou Make para receber um POST a cada novo lead.
					</p>
				</div>
				<Input
					id="webhookUrl"
					value={webhookUrl}
					onChange={(e) => onWebhookUrlChange?.(e.target.value)}
					placeholder="https://hooks.zapier.com/..."
				/>
			</div>
		</div>
	);
}
