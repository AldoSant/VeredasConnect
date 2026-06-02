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
		if (formData.get("lgpdConsent") !== "on") {
			toast.error("Confirme o consentimento para enviar seu contato.");
			setIsSubmitting(false);
			return;
		}

		const data = {
			slug,
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			company: formData.get("company") as string,
			message: formData.get("message") as string,
			lgpdConsent: true,
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
			<div className="mt-8 flex w-full flex-col items-center justify-center rounded-2xl border border-[#eadcc5] bg-white/80 p-8 text-center backdrop-blur-lg">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
					<Send className="h-6 w-6" />
				</div>
				<h3 className="mb-2 text-xl font-bold text-[#251b12]">Pronto!</h3>
				<p className="text-sm text-[#6a5845]">
					Recebemos seu contato. O responsável retornará pelo canal informado.
				</p>
			</div>
		);
	}

	return (
		<div className="mt-8 w-full rounded-2xl border border-[#eadcc5] bg-white/80 p-6 backdrop-blur-lg">
			<h3 className="mb-4 text-center text-lg font-bold text-[#251b12]">{title}</h3>
			<p className="mb-5 text-center text-sm text-[#6a5845]">
				Deixe seus dados para receber retorno comercial sem perder o contato.
			</p>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Input
						name="name"
						placeholder="Seu Nome completo"
						required
						className="border-[#eadcc5] bg-white/85 text-[#251b12] placeholder:text-[#8d7459] focus-visible:ring-[#c9a86a]"
					/>
				</div>
				<div>
					<Input
						name="email"
						type="email"
						placeholder="E-mail profissional"
						required
						className="border-[#eadcc5] bg-white/85 text-[#251b12] placeholder:text-[#8d7459] focus-visible:ring-[#c9a86a]"
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Input
							name="phone"
							type="tel"
							placeholder="WhatsApp/Telefone"
							className="border-[#eadcc5] bg-white/85 text-[#251b12] placeholder:text-[#8d7459] focus-visible:ring-[#c9a86a]"
						/>
					</div>
					<div>
						<Input
							name="company"
							placeholder="Empresa"
							className="border-[#eadcc5] bg-white/85 text-[#251b12] placeholder:text-[#8d7459] focus-visible:ring-[#c9a86a]"
						/>
					</div>
				</div>
				<div>
					<Textarea
						name="message"
						placeholder="Sua Mensagem..."
						rows={3}
						className="resize-none border-[#eadcc5] bg-white/85 text-[#251b12] placeholder:text-[#8d7459] focus-visible:ring-[#c9a86a]"
					/>
				</div>
				<label className="flex items-start gap-3 rounded-xl border border-[#eadcc5] bg-[#fffaf1] p-3 text-xs leading-relaxed text-[#6a5845]">
					<input
						type="checkbox"
						name="lgpdConsent"
						required
						className="mt-0.5 h-4 w-4 rounded border-white/30 accent-emerald-500"
					/>
					<span>
						Autorizo o uso dos meus dados para retorno sobre este contato, conforme a LGPD.
					</span>
				</label>
				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full bg-[#2c2117] font-bold text-[#fffaf1] hover:bg-[#3b2a1d]"
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
