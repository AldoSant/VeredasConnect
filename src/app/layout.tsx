import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { apiPath } from "@/lib/paths";
import "./globals.css";

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Veredas Connect",
	description: "Conecte-se com sua identidade digital premium.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${outfit.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950`}>
				<SessionProvider basePath={apiPath("/api/auth")}>{children}</SessionProvider>
				<Toaster />
			</body>
		</html>
	);
}
