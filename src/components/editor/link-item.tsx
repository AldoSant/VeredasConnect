"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarIcon, GripVertical, Link as LinkIcon, Minus, Trash2, Type } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface LinkItemProps {
	id: string;
	type: "link" | "header" | "divider";
	title: string;
	url: string;
	isActive?: boolean;
	startDate?: Date | null;
	endDate?: Date | null;
	onDelete: (id: string) => void;
	onUpdate?: (id: string, updates: Partial<LinkItemProps>) => void;
}

export function LinkItemCard({
	id,
	type,
	title,
	url,
	isActive = true,
	startDate,
	endDate,
	onDelete,
	onUpdate,
}: LinkItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
	});

	const [isExpanded, setIsExpanded] = useState(false);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const formatDate = (date?: Date | null) => {
		if (!date) return "";
		const d = new Date(date);
		return d.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`group flex flex-col gap-2 rounded-xl border bg-card p-3 transition-all duration-200 ${
				isDragging
					? "z-50 scale-[1.02] cursor-grabbing border-primary/50 shadow-2xl ring-2 ring-primary/20 opacity-90"
					: "hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md"
			} ${!isActive ? "opacity-60 grayscale-[0.5]" : ""}`}
		>
			<div className="flex items-center gap-2">
				<button
					type="button"
					className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
					aria-label="Drag handle"
					{...attributes}
					{...listeners}
				>
					<GripVertical className="h-4 w-4" />
				</button>

				<div className="flex-1 min-w-0">
					{type === "link" && (
						<div className="flex items-center gap-2">
							<LinkIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
							<div className="min-w-0 flex-1 grid gap-1">
								<Input
									value={title}
									onChange={(e) => onUpdate?.(id, { title: e.target.value })}
									placeholder="Link Title"
									className="h-7 text-sm font-medium px-2 py-1"
								/>
								<Input
									value={url}
									onChange={(e) => onUpdate?.(id, { url: e.target.value })}
									placeholder="https://example.com"
									className="h-6 text-xs px-2 py-1 text-muted-foreground"
								/>
							</div>
						</div>
					)}
					{type === "header" && (
						<div className="flex items-center gap-2">
							<Type className="h-4 w-4 shrink-0 text-muted-foreground" />
							<Input
								value={title}
								onChange={(e) => onUpdate?.(id, { title: e.target.value })}
								placeholder="Header Title"
								className="h-8 text-sm font-semibold px-2"
							/>
						</div>
					)}
					{type === "divider" && (
						<div className="flex items-center gap-2">
							<Minus className="h-4 w-4 shrink-0 text-muted-foreground" />
							<div className="flex-1 border-t" />
						</div>
					)}
				</div>

				<div className="flex items-center pr-2 gap-3 shrink-0">
					{type === "link" && (
						<Switch
							checked={isActive}
							onCheckedChange={(checked) => onUpdate?.(id, { isActive: checked })}
							aria-label="Toggle visibility"
						/>
					)}
					{type === "link" && (
						<Button
							variant="ghost"
							size="icon"
							className={`h-8 w-8 ${startDate || endDate ? "text-primary" : "text-muted-foreground"}`}
							onClick={() => setIsExpanded(!isExpanded)}
							aria-label="Schedule"
						>
							<CalendarIcon className="h-4 w-4" />
						</Button>
					)}
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-destructive"
						onClick={() => onDelete(id)}
						aria-label="Delete"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{isExpanded && type === "link" && (
				<div className="pl-8 pr-2 pt-2 pb-1 space-y-3 border-t mt-2">
					<div className="grid gap-2">
						<Label className="text-xs text-muted-foreground">Start Schedule (Optional)</Label>
						<Input
							type="datetime-local"
							className="h-8 text-xs"
							value={formatDate(startDate)}
							onChange={(e) =>
								onUpdate?.(id, { startDate: e.target.value ? new Date(e.target.value) : null })
							}
						/>
					</div>
					<div className="grid gap-2">
						<Label className="text-xs text-muted-foreground">End Schedule (Optional)</Label>
						<Input
							type="datetime-local"
							className="h-8 text-xs"
							value={formatDate(endDate)}
							onChange={(e) =>
								onUpdate?.(id, { endDate: e.target.value ? new Date(e.target.value) : null })
							}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
