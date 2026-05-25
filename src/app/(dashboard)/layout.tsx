"use client";

import { BarChart3, CreditCard, Edit, LogOut, Quote, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { data: session } = useSession();

	const handleSignOut = async () => {
		await signOut({ redirect: false });
		router.push("/login");
	};

	return (
		<div className="min-h-screen bg-background">
			<nav className="border-b bg-card">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
					<div className="flex items-center gap-6">
						<Link href="/editor" className="text-lg font-semibold">
							Veredas Connect
						</Link>
						<Link href="/profiles">
							<Button variant="ghost" size="sm">
								<CreditCard className="mr-2 h-4 w-4" />
								Biblioteca
							</Button>
						</Link>
						<div className="flex items-center gap-1">
							<Link href="/editor">
								<Button variant="ghost" size="sm">
									<Edit className="mr-2 h-4 w-4" />
									Editor
								</Button>
							</Link>
							<Link href="/analytics">
								<Button variant="ghost" size="sm">
									<BarChart3 className="mr-2 h-4 w-4" />
									Analytics
								</Button>
							</Link>
							<Link href="/leads">
								<Button variant="ghost" size="sm">
									<Users className="mr-2 h-4 w-4" />
									Leads
								</Button>
							</Link>
							<Link href="/testimonials">
								<Button variant="ghost" size="sm">
									<Quote className="mr-2 h-4 w-4" />
									Prova Social
								</Button>
							</Link>
							<Link href="/cards">
								<Button variant="ghost" size="sm">
									<CreditCard className="mr-2 h-4 w-4" />
									Cartões NFC
								</Button>
							</Link>

							{session?.user?.role === "SUPERVISOR" && (
								<Link href="/team">
									<Button variant="ghost" size="sm" className="text-violet-600 font-medium">
										<Users className="mr-2 h-4 w-4" />
										Minha Equipe
									</Button>
								</Link>
							)}

							{session?.user?.role === "ADMIN" && (
								<Link href="/organization">
									<Button variant="ghost" size="sm" className="text-blue-600 font-medium">
										<Users className="mr-2 h-4 w-4" />
										Gestão Empresa
									</Button>
								</Link>
							)}
						</div>
					</div>
					<div className="flex items-center gap-4">
						{session?.user && (
							<span className="text-sm text-muted-foreground">{session.user.name}</span>
						)}
						<Button variant="ghost" size="sm" onClick={handleSignOut}>
							<LogOut className="mr-2 h-4 w-4" />
							Sign out
						</Button>
					</div>
				</div>
			</nav>
			<main>{children}</main>
		</div>
	);
}
