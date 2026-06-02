"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiPath } from "@/lib/paths";
import { slugSchema } from "@/lib/validations";

interface SlugInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

export function SlugInput({ value, onChange, error: externalError }: SlugInputProps) {
	const [checking, setChecking] = useState(false);
	const [available, setAvailable] = useState<boolean | null>(null);
	const [validationError, setValidationError] = useState<string | null>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const checkAvailability = useCallback(async (slug: string) => {
		const result = slugSchema.safeParse(slug);
		if (!result.success) {
			setValidationError(result.error.issues[0]?.message ?? "Invalid username");
			setAvailable(null);
			setChecking(false);
			return;
		}

		setValidationError(null);
		setChecking(true);

		try {
			const res = await fetch(apiPath(`/api/slug/check?slug=${encodeURIComponent(slug)}`));
			const data = await res.json();
			setAvailable(data.available);
			if (!data.available && data.error) {
				setValidationError(data.error);
			}
		} catch {
			setValidationError("Failed to check availability");
		} finally {
			setChecking(false);
		}
	}, []);

	useEffect(() => {
		if (!value || value.length < 3) {
			setAvailable(null);
			setValidationError(null);
			return;
		}

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			checkAvailability(value);
		}, 300);

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [value, checkAvailability]);

	const displayError = externalError || validationError;

	return (
		<div>
			<label
				htmlFor="slug"
				className="block text-xs font-medium text-[#6a5845] mb-1.5 tracking-wide"
			>
				Endereço público
			</label>
			<div className="relative">
				<input
					id="slug"
					type="text"
					placeholder="ana-veredas"
					value={value}
					onChange={(e) => onChange(e.target.value.toLowerCase())}
					aria-label="Endereço público"
					autoComplete="off"
					className="w-full rounded-xl border border-[#eadcc5] bg-white/80 px-4 py-3 pr-10 text-sm text-[#251b12] placeholder:text-[#251b12]/30 outline-none transition-all focus:border-[#b98e45] focus:ring-2 focus:ring-[#c9a86a]/20 backdrop-blur-sm"
				/>
				<div className="absolute right-3 top-1/2 -translate-y-1/2">
					{checking && <Loader2 className="h-4 w-4 animate-spin text-[#9b8268]" />}
					{!checking && available === true && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
					{!checking && available === false && <XCircle className="h-4 w-4 text-red-500" />}
				</div>
			</div>
			{displayError && <p className="mt-1.5 text-xs text-red-600">{displayError}</p>}
			{value && !displayError && available === true && (
				<p className="mt-1.5 text-xs text-[#8d7459]">
					Sua página:{" "}
					<span className="text-[#9a6a2f]">
						{typeof window !== "undefined" ? window.location.origin : ""}/{value}
					</span>
				</p>
			)}
		</div>
	);
}
