"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiPath } from "@/lib/paths";

interface LeadFormCardProps {
	slug: string;
	title: string;
}

export function LeadFormCard({ slug, title }: LeadFormCardProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			slug,
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			company: formData.get("company") as string,
			message: formData.get("message") as string,
		};

		try {
			const res = await fetch(apiPath("/api/leads"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const result = await res.json();
				throw new Error(result.error || "Failed to send");
			}

			setIsSuccess(true);
			toast.success("Mensagem enviada com sucesso!");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Ocorreu um erro. Tente novamente.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="mt-8 flex w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-lg">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
					<Send className="h-6 w-6" />
				</div>
				<h3 className="mb-2 text-xl font-bold text-white">Pronto!</h3>
				<p className="text-sm text-white/70">Recebemos seu contato com sucesso.</p>
			</div>
		);
	}

	return (
		<div className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
			<h3 className="mb-4 text-center text-lg font-bold text-white">{title}</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Input
						name="name"
						placeholder="Seu Nome completo"
						required
						className="border-white/10 bg-black/20 text-white placeholder:text-white/40 focus-visible:ring-violet-500"
					/>
				</div>
				<div>
					<Input
						name="email"
						type="email"
						placeholder="E-mail profissional"
						required
						className="border-white/10 bg-black/20 text-white placeholder:text-white/40 focus-visible:ring-violet-500"
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Input
							name="phone"
							type="tel"
							placeholder="WhatsApp/Telefone"
							className="border-white/10 bg-black/20 text-white placeholder:text-white/40 focus-visible:ring-violet-500"
						/>
					</div>
					<div>
						<Input
							name="company"
							placeholder="Empresa"
							className="border-white/10 bg-black/20 text-white placeholder:text-white/40 focus-visible:ring-violet-500"
						/>
					</div>
				</div>
				<div>
					<Textarea
						name="message"
						placeholder="Sua Mensagem..."
						rows={3}
						className="border-white/10 bg-black/20 text-white placeholder:text-white/40 focus-visible:ring-violet-500 resize-none"
					/>
				</div>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-white text-black hover:bg-white/90 font-bold"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Enviando...
						</>
					) : (
						"Enviar Contato"
					)}
				</Button>
			</form>
		</div>
	);
}
