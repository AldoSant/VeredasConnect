"use client";

import { Copy, Download, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";
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

interface ShareDialogProps {
	username: string;
}

export function ShareDialog({ username }: ShareDialogProps) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const url = `${window.location.origin}/${username}`;

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copied to clipboard!");
		} catch (err) {
			toast.error("Failed to copy link");
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
					Share
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Share your LinkBio</DialogTitle>
					<DialogDescription>
						Anyone with this link or QR code can access your profile.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center justify-center space-y-6 py-4">
					<div className="rounded-xl border bg-white p-4 shadow-sm">
						<QRCodeSVG
							id="qr-code-svg"
							value={url}
							size={200}
							level="H"
							includeMargin={true}
						/>
					</div>

					<div className="flex w-full items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<div className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground truncate">
								{url}
							</div>
						</div>
						<Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
							<span className="sr-only">Copy</span>
							<Copy className="h-4 w-4" />
						</Button>
					</div>

					<Button onClick={downloadQRCode} className="w-full gap-2">
						<Download className="h-4 w-4" />
						Download QR Code
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
