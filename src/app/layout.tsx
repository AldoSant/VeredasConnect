import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { apiPath } from "@/lib/paths";
import "./globals.css";

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
	display: "swap",
});

const siteUrl = "https://veredasinc.com.br/connect";
const title = "Veredas Connect — Identidade digital premium";
const description =
	"Crie uma presença digital premium com link inteligente, cartão digital, QR/NFC, captação de leads, vCard e analytics para transformar conexões em negócios.";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: title,
		template: "%s | Veredas Connect",
	},
	description,
	applicationName: "Veredas Connect",
	keywords: [
		"Veredas Connect",
		"cartão digital",
		"link na bio",
		"QR Code profissional",
		"NFC",
		"vCard",
		"identidade digital",
		"captação de leads",
	],
	authors: [{ name: "Veredas Inc." }],
	creator: "Veredas Inc.",
	publisher: "Veredas Inc.",
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "pt_BR",
		url: siteUrl,
		siteName: "Veredas Connect",
		title,
		description,
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
};

export const viewport: Viewport = {
	themeColor: "#fbf7ef",
	colorScheme: "light",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body className={`${outfit.variable} bg-[#fbf7ef] font-sans antialiased`}>
				<SessionProvider basePath={apiPath("/api/auth")}>{children}</SessionProvider>
				<Toaster />
			</body>
		</html>
	);
}
