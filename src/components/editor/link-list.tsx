"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { LinkItem } from "@/types";
import { LinkItemCard } from "./link-item";

interface LinkListProps {
	links: LinkItem[];
	onReorder: (links: LinkItem[]) => void;
	onDelete: (id: string) => void;
	onUpdate: (id: string, updates: Partial<LinkItem>) => void;
}

export function LinkList({ links, onReorder, onDelete, onUpdate }: LinkListProps) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = links.findIndex((item) => item.id === active.id);
		const newIndex = links.findIndex((item) => item.id === over.id);

		if (oldIndex !== -1 && newIndex !== -1) {
			const reordered = arrayMove(links, oldIndex, newIndex).map((item, index) => ({
				...item,
				sortOrder: index,
			}));
			onReorder(reordered);
		}
	};

	if (links.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
				No links yet. Add your first link below.
			</div>
		);
	}

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
				<div className="space-y-2">
					{links.map((link) => (
						<LinkItemCard
							key={link.id}
							id={link.id}
							type={link.type as "link" | "header" | "divider"}
							title={link.title}
							url={link.url}
							isActive={link.isActive}
							startDate={link.startDate}
							endDate={link.endDate}
							onDelete={onDelete}
							onUpdate={onUpdate}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
