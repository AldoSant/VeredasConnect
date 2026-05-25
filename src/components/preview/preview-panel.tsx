"use client";

import { MinimalTheme } from "@/components/themes/minimal";
import type { ThemeProps } from "@/types";

type PreviewPanelProps = Omit<ThemeProps, "isPreview">;

export function PreviewPanel({
	slug,
	displayName,
	bio,
	avatarUrl,
	jobTitle,
	company,
	phone,
	whatsapp,
	links,
}: PreviewPanelProps) {
	return (
		<div className="flex flex-col items-center">
			{/* Phone frame */}
			<div className="relative w-[375px] rounded-[2.5rem] border-4 border-gray-800 bg-gray-800 p-2 shadow-xl">
				{/* Notch */}
				<div className="mx-auto mb-2 h-6 w-32 rounded-b-2xl bg-gray-800" />

				{/* Screen */}
				<div className="h-[667px] overflow-y-auto rounded-[2rem] bg-white">
					<MinimalTheme
						slug={slug}
						displayName={displayName}
						bio={bio}
						avatarUrl={avatarUrl}
						jobTitle={jobTitle}
						company={company}
						phone={phone}
						whatsapp={whatsapp}
						links={links}
						isPreview
					/>
				</div>

				{/* Home indicator */}
				<div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gray-600" />
			</div>
		</div>
	);
}
