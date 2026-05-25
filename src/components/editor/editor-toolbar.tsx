"use client";

import { Columns2, PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LayoutMode = "both" | "editor" | "preview";

interface EditorToolbarProps {
	mode: LayoutMode;
	onModeChange: (mode: LayoutMode) => void;
}

export function EditorToolbar({ mode, onModeChange }: EditorToolbarProps) {
	return (
		<div className="hidden lg:flex items-center gap-1 rounded-lg border p-1">
			<Button
				variant={mode === "both" ? "secondary" : "ghost"}
				size="sm"
				onClick={() => onModeChange("both")}
				aria-label="Mostrar ambos os painéis"
			>
				<Columns2 className="h-4 w-4" />
			</Button>
			<Button
				variant={mode === "editor" ? "secondary" : "ghost"}
				size="sm"
				onClick={() => onModeChange("editor")}
				aria-label="Mostrar apenas editor"
			>
				<PanelLeft className="h-4 w-4" />
			</Button>
			<Button
				variant={mode === "preview" ? "secondary" : "ghost"}
				size="sm"
				onClick={() => onModeChange("preview")}
				aria-label="Mostrar apenas pré-visualização"
			>
				<PanelRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
