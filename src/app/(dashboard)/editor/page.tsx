"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { AddLinkButton } from "@/components/editor/add-link-button";
import { EditorToolbar, type LayoutMode } from "@/components/editor/editor-toolbar";
import { LinkList } from "@/components/editor/link-list";
import { ProfileForm } from "@/components/editor/profile-form";
import { ShareDialog } from "@/components/editor/share-dialog";
import { PreviewPanel } from "@/components/preview/preview-panel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/use-profile";
import { apiPath } from "@/lib/paths";
import type { LinkItem } from "@/types";

export default function EditorPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin" />
				</div>
			}
		>
			<EditorContent />
		</Suspense>
	);
}

function EditorContent() {
	const searchParams = useSearchParams();
	const profileId = searchParams.get("id") || undefined;
	const { profile, links: serverLinks, isLoading, error, refetch } = useProfile(profileId);

	// Local editor state
	const [displayName, setDisplayName] = useState("");
	const [bio, setBio] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [company, setCompany] = useState("");
	const [phone, setPhone] = useState("");
	const [whatsapp, setWhatsapp] = useState("");
	const [leadFormActive, setLeadFormActive] = useState(false);
	const [leadFormTitle, setLeadFormTitle] = useState("Deixe sua mensagem");
	const [webhookUrl, setWebhookUrl] = useState("");
	const [links, setLinks] = useState<LinkItem[]>([]);
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [layoutMode, setLayoutMode] = useState<LayoutMode>("both");

	// Track items added/deleted locally (not yet persisted)
	const addedLinksRef = useRef<LinkItem[]>([]);
	const deletedIdsRef = useRef<Set<string>>(new Set());
	const initializedRef = useRef(false);

	// Initialize local state from server data
	useEffect(() => {
		if (profile && !initializedRef.current) {
			setDisplayName(profile.displayName);
			setBio(profile.bio);
			setAvatarUrl(profile.avatarUrl);
			// Fallback defaults in case they're undefined in older profiles
			setJobTitle(profile.jobTitle || "");
			setCompany(profile.company || "");
			setPhone(profile.phone || "");
			setWhatsapp(profile.whatsapp || "");
			setLeadFormActive(profile.leadFormActive ?? false);
			setLeadFormTitle(profile.leadFormTitle || "Deixe sua mensagem");
			setWebhookUrl(profile.webhookUrl || "");
			setLinks(serverLinks);
			initializedRef.current = true;
		}
	}, [profile, serverLinks]);

	const markDirty = useCallback(() => setIsDirty(true), []);

	const handleDisplayNameChange = (value: string) => {
		setDisplayName(value);
		markDirty();
	};

	const handleBioChange = (value: string) => {
		setBio(value);
		markDirty();
	};

	const handleAvatarUrlChange = (value: string) => {
		setAvatarUrl(value);
		markDirty();
	};

	const handleReorder = (reordered: LinkItem[]) => {
		setLinks(reordered);
		markDirty();
	};

	const handleUpdateLink = (id: string, updates: Partial<LinkItem>) => {
		setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
		markDirty();
	};

	const handleDeleteLink = (id: string) => {
		// Check if it was a newly added item (not yet in DB)
		const wasAdded = addedLinksRef.current.some((l) => l.id === id);
		if (wasAdded) {
			addedLinksRef.current = addedLinksRef.current.filter((l) => l.id !== id);
		} else {
			deletedIdsRef.current.add(id);
		}
		setLinks((prev) => prev.filter((l) => l.id !== id));
		markDirty();
	};

	const handleAddLink = (title: string, url: string) => {
		const tempId = crypto.randomUUID();
		const newLink: LinkItem = {
			id: tempId,
			profileId: profile?.id ?? "",
			type: "link",
			title,
			url,
			isActive: true,
			startDate: null,
			endDate: null,
			sortOrder: links.length,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		addedLinksRef.current.push(newLink);
		setLinks((prev) => [...prev, newLink]);
		markDirty();
	};

	const handleAddHeader = (title: string) => {
		const tempId = crypto.randomUUID();
		const newHeader: LinkItem = {
			id: tempId,
			profileId: profile?.id ?? "",
			type: "header",
			title,
			url: "",
			isActive: true,
			startDate: null,
			endDate: null,
			sortOrder: links.length,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		addedLinksRef.current.push(newHeader);
		setLinks((prev) => [...prev, newHeader]);
		markDirty();
	};

	const handleAddDivider = () => {
		const tempId = crypto.randomUUID();
		const newDivider: LinkItem = {
			id: tempId,
			profileId: profile?.id ?? "",
			type: "divider",
			title: "",
			url: "",
			isActive: true,
			startDate: null,
			endDate: null,
			sortOrder: links.length,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		addedLinksRef.current.push(newDivider);
		setLinks((prev) => [...prev, newDivider]);
		markDirty();
	};

	const handleSave = async () => {
		if (!profile || isSaving) return;
		setIsSaving(true);

		try {
			// 1. Update profile
			const profileRes = await fetch(apiPath("/api/profile"), {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: profile?.id,
					displayName,
					bio,
					avatarUrl,
					theme: profile.theme,
					jobTitle,
					company,
					phone,
					whatsapp,
					leadFormActive,
					leadFormTitle,
					webhookUrl,
				}),
			});
			if (!profileRes.ok) throw new Error("Failed to update profile");

			// 2. Delete removed items
			for (const id of deletedIdsRef.current) {
				await fetch(apiPath(`/api/links/${id}`), { method: "DELETE" });
			}

			// 3. Add new items
			const newIdMap = new Map<string, string>();
			for (const item of addedLinksRef.current) {
				const res = await fetch(apiPath("/api/links"), {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						profileId: profile.id, // Explicitly pass profileId
						type: item.type,
						title: item.title || undefined,
						url: item.url || undefined,
					}),
				});
				if (res.ok) {
					const data = await res.json();
					newIdMap.set(item.id, data.link.id);
				}
			}

			// 4. Update all items (using server IDs) with bulk-update
			const updateItems = links
				.filter((l) => !deletedIdsRef.current.has(l.id))
				.map((l, index) => ({
					id: newIdMap.get(l.id) ?? l.id,
					sortOrder: index,
					title: l.title,
					url: l.url,
					isActive: l.isActive,
					startDate: l.startDate ? new Date(l.startDate).toISOString() : null,
					endDate: l.endDate ? new Date(l.endDate).toISOString() : null,
				}));

			if (updateItems.length > 0) {
				await fetch(apiPath("/api/links/bulk-update"), {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						profileId: profile.id, // Explicitly pass profileId
						items: updateItems,
					}),
				});
			}

			// Reset tracking
			addedLinksRef.current = [];
			deletedIdsRef.current.clear();

			// Refetch to get server state
			initializedRef.current = false;
			await refetch();
			setIsDirty(false);
			toast.success("Changes saved successfully!");
		} catch {
			toast.error("Failed to save changes. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<p className="text-destructive">{error}</p>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex min-h-screen items-center justify-center p-6 bg-[#030303]">
				<div className="w-full max-w-md space-y-8 text-center">
					<div className="space-y-2">
						<h1 className="text-4xl font-bold tracking-tighter text-white">Quase lá!</h1>
						<p className="text-white/50 text-lg">
							Escolha o seu nome de usuário para criar sua página.
						</p>
					</div>

					<form
						onSubmit={async (e) => {
							e.preventDefault();
							const formData = new FormData(e.currentTarget);
							const slug = formData.get("slug") as string;

							setIsSaving(true);
							try {
								const res = await fetch(apiPath("/api/profile"), {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ slug, displayName: slug }),
								});
								if (!res.ok) {
									const data = await res.json();
									throw new Error(data.error || "Erro ao criar perfil");
								}
								toast.success("Perfil criado com sucesso!");
								refetch();
							} catch (err) {
								toast.error(err instanceof Error ? err.message : "Erro ao criar perfil");
							} finally {
								setIsSaving(false);
							}
						}}
						className="space-y-4"
					>
						<div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-medium text-xs">
								veredasinc.com.br/connect/
							</span>
							<input
								name="slug"
								type="text"
								placeholder="seu-nome"
								required
								className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-[100px] pr-4 text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
							/>
						</div>
						<Button
							type="submit"
							disabled={isSaving}
							className="w-full py-6 rounded-2xl text-lg font-bold bg-white text-black hover:bg-white/90"
						>
							{isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Criar minha página"}
						</Button>
					</form>
				</div>
			</div>
		);
	}

	const now = new Date();
	const activeLinks = links.filter((l) => {
		if (l.isActive === false) return false;
		if (l.startDate && now < new Date(l.startDate)) return false;
		if (l.endDate && now > new Date(l.endDate)) return false;
		return true;
	});

	const previewLinks = activeLinks.map((l) => ({
		id: l.id,
		type: l.type as "link" | "header" | "divider",
		title: l.title,
		url: l.url,
	}));

	const editorPanel = (
		<div className="flex flex-col gap-6 p-6">
			<OnboardingChecklist
				profile={{
					displayName,
					bio,
					avatarUrl,
					phone,
					whatsapp,
					leadFormActive,
				}}
				links={activeLinks}
			/>

			<ProfileForm
				displayName={displayName}
				bio={bio}
				avatarUrl={avatarUrl}
				jobTitle={jobTitle}
				company={company}
				phone={phone}
				whatsapp={whatsapp}
				leadFormActive={leadFormActive}
				leadFormTitle={leadFormTitle}
				onDisplayNameChange={handleDisplayNameChange}
				onBioChange={handleBioChange}
				onAvatarUrlChange={handleAvatarUrlChange}
				onJobTitleChange={(v) => {
					setJobTitle(v);
					markDirty();
				}}
				onCompanyChange={(v) => {
					setCompany(v);
					markDirty();
				}}
				onPhoneChange={(v) => {
					setPhone(v);
					markDirty();
				}}
				onWhatsappChange={(v) => {
					setWhatsapp(v);
					markDirty();
				}}
				onLeadFormActiveChange={(v) => {
					setLeadFormActive(v);
					markDirty();
				}}
				onLeadFormTitleChange={(v) => {
					setLeadFormTitle(v);
					markDirty();
				}}
				webhookUrl={webhookUrl}
				onWebhookUrlChange={(v) => {
					setWebhookUrl(v);
					markDirty();
				}}
			/>

			<Separator />

			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Links</h2>
				<LinkList
					links={links}
					onReorder={handleReorder}
					onDelete={handleDeleteLink}
					onUpdate={handleUpdateLink}
				/>
				<AddLinkButton
					onAddLink={handleAddLink}
					onAddHeader={handleAddHeader}
					onAddDivider={handleAddDivider}
				/>
			</div>

			<Button onClick={handleSave} disabled={!isDirty || isSaving} className="w-full">
				{isSaving ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Salvando...
					</>
				) : (
					"Salvar"
				)}
			</Button>
		</div>
	);

	const previewPanel = (
		<div className="flex items-start justify-center p-6">
			<PreviewPanel
				slug={profile.slug}
				displayName={displayName}
				bio={bio}
				avatarUrl={avatarUrl}
				links={previewLinks}
				jobTitle={jobTitle}
				company={company}
				phone={phone}
				whatsapp={whatsapp}
				leadFormActive={leadFormActive}
				leadFormTitle={leadFormTitle}
			/>
		</div>
	);

	return (
		<div className="mx-auto max-w-7xl">
			{/* Toolbar */}
			<div className="flex items-center justify-between border-b px-6 py-3">
				<div className="flex items-center gap-4">
					<h1 className="text-lg font-semibold">Editor</h1>
					<ShareDialog username={profile.slug} />
				</div>
				<EditorToolbar mode={layoutMode} onModeChange={setLayoutMode} />
			</div>

			{/* Desktop layout */}
			<div className="hidden lg:block">
				<div className="grid grid-cols-2 divide-x min-h-[calc(100vh-8rem)]">
					{(layoutMode === "both" || layoutMode === "editor") && (
						<div className={`overflow-y-auto ${layoutMode === "editor" ? "col-span-2" : ""}`}>
							{editorPanel}
						</div>
					)}
					{(layoutMode === "both" || layoutMode === "preview") && (
						<div
							className={`overflow-y-auto bg-muted/30 ${layoutMode === "preview" ? "col-span-2" : ""}`}
						>
							{previewPanel}
						</div>
					)}
				</div>
			</div>

			{/* Mobile layout */}
			<div className="lg:hidden">
				<Tabs defaultValue="edit" className="w-full">
					<TabsList className="w-full">
						<TabsTrigger value="edit" className="flex-1">
							Edit
						</TabsTrigger>
						<TabsTrigger value="preview" className="flex-1">
							Preview
						</TabsTrigger>
					</TabsList>
					<TabsContent value="edit">{editorPanel}</TabsContent>
					<TabsContent value="preview">{previewPanel}</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
