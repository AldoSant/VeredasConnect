"use client";

import { Copy, Download, ExternalLink, IdCard, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { buildShareLinks } from "@/lib/share-links";

interface ShareDialogProps {
	username: string;
}

export function ShareDialog({ username }: ShareDialogProps) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const shareLinks = buildShareLinks(window.location.origin, username);
	const url = shareLinks.publicUrl;

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copiado para a área de transferência!");
		} catch (_err) {
			toast.error("Não foi possível copiar o link");
		}
	};

	const downloadQRCode = () => {
		const svg = document.getElementById("qr-code-svg");
		if (!svg) return;
		const svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx?.drawImage(img, 0, 0);
			const pngFile = canvas.toDataURL("image/png");
			const downloadLink = document.createElement("a");
			downloadLink.download = `qr-code-${username}.png`;
			downloadLink.href = `${pngFile}`;
			downloadLink.click();
		};
		img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<Share2 className="h-4 w-4" />
					Compartilhar
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Compartilhe seu Veredas Connect</DialogTitle>
					<DialogDescription>
						Use o link público, QR Code ou vCard para divulgar seu perfil.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center justify-center space-y-6 py-4">
					<div className="rounded-xl border bg-white p-4 shadow-sm">
						<QRCodeSVG id="qr-code-svg" value={url} size={200} level="H" includeMargin={true} />
					</div>

					<div className="flex w-full items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<div className="truncate rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
								{url}
							</div>
						</div>
						<Button type="button" size="sm" className="px-3" onClick={copyToClipboard}>
							<span className="sr-only">Copiar link</span>
							<Copy className="h-4 w-4" />
						</Button>
					</div>

					<div className="grid w-full gap-2 sm:grid-cols-2">
						<Button onClick={downloadQRCode} className="gap-2">
							<Download className="h-4 w-4" />
							Baixar QR Code
						</Button>
						<Button asChild variant="outline" className="gap-2">
							<a href={shareLinks.vcardPath} download>
								<IdCard className="h-4 w-4" />
								Baixar vCard
							</a>
						</Button>
					</div>

					<Button asChild variant="secondary" className="w-full gap-2">
						<a href={shareLinks.publicPath} target="_blank" rel="noreferrer">
							<ExternalLink className="h-4 w-4" />
							Abrir página pública
						</a>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
