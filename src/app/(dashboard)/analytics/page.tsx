"use client";

import {
	ArrowUpRight,
	BarChart3,
	Calendar,
	Link2,
	Loader2,
	MousePointer2,
	TrendingUp,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
	totalClicks: number;
	links: Array<{
		id: string;
		title: string;
		url: string;
		clicks: number;
	}>;
	trends: Array<{
		date: string;
		count: number;
	}>;
	devices: Array<{
		name: string;
		value: number;
	}>;
	browsers: Array<{
		name: string;
		value: number;
	}>;
}

const COLORS = ["#8b5cf6", "#d946ef", "#0ea5e9", "#10b981", "#f59e0b"];

export default function AnalyticsPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen items-center justify-center bg-zinc-950">
					<Loader2 className="h-8 w-8 animate-spin text-violet-500" />
				</div>
			}
		>
			<AnalyticsContent />
		</Suspense>
	);
}

function AnalyticsContent() {
	const searchParams = useSearchParams();
	const profileId = searchParams.get("id");
	const [data, setData] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchAnalytics() {
			try {
				const url = profileId ? `/api/analytics?id=${profileId}` : "/api/analytics";
				const res = await fetch(url);
				const json = await res.json();
				setData(json);
			} catch (error) {
				console.error("Failed to fetch analytics:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchAnalytics();
	}, [profileId]);

	if (loading) {
		return (
			<div className="flex h-[80vh] w-full items-center justify-center bg-zinc-950">
				<Loader2 className="h-8 w-8 animate-spin text-violet-500" />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="p-8 text-center text-white bg-zinc-950 min-h-screen">
				<p>Error loading analytics. Please try again later.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-950 p-6 text-white selection:bg-violet-500/30">
			<div className="mx-auto max-w-7xl space-y-8">
				{/* Header */}
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight text-white">Performance Analytics</h1>
					<p className="text-white/60">Real-time engagement data for your Links.</p>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="bg-white/5 border-white/10 backdrop-blur-xl">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-white/70">Total Clicks</CardTitle>
							<MousePointer2 className="h-4 w-4 text-violet-400" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-white">{data.totalClicks}</div>
							<p className="text-xs text-white/40 mt-1">Lifetime engagement</p>
						</CardContent>
					</Card>

					<Card className="bg-white/5 border-white/10 backdrop-blur-xl">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-white/70">Active Links</CardTitle>
							<Link2 className="h-4 w-4 text-fuchsia-400" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-white">{data?.links?.length || 0}</div>
							<p className="text-xs text-white/40 mt-1">Currently tracked</p>
						</CardContent>
					</Card>

					<Card className="bg-white/5 border-white/10 backdrop-blur-xl">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-white/70">Last 30 Days</CardTitle>
							<Calendar className="h-4 w-4 text-blue-400" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-white">
								{data?.trends?.reduce((acc, curr) => acc + curr.count, 0) || 0}
							</div>
							<p className="text-xs text-white/40 mt-1">Recent interactions</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Chart */}
				<Card className="bg-white/5 border-white/10 backdrop-blur-xl">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg font-semibold text-white">Click Trends</CardTitle>
							<TrendingUp className="h-5 w-5 text-emerald-400" />
						</div>
					</CardHeader>
					<CardContent className="h-[400px]">
						{data?.trends && data.trends.length > 0 ? (
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={data.trends}>
									<defs>
										<linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
									<XAxis
										dataKey="date"
										stroke="#ffffff40"
										fontSize={12}
										tickLine={false}
										axisLine={false}
										tickFormatter={(str) => {
											const date = new Date(str);
											return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
										}}
									/>
									<YAxis
										stroke="#ffffff40"
										fontSize={12}
										tickLine={false}
										axisLine={false}
										tickFormatter={(value) => `${value}`}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "#18181b",
											border: "1px solid #ffffff10",
											borderRadius: "12px",
											color: "#fff",
										}}
										itemStyle={{ color: "#8b5cf6" }}
									/>
									<Area
										type="monotone"
										dataKey="count"
										stroke="#8b5cf6"
										strokeWidth={3}
										fillOpacity={1}
										fill="url(#colorClicks)"
									/>
								</AreaChart>
							</ResponsiveContainer>
						) : (
							<div className="flex h-full flex-col items-center justify-center text-white/20">
								<BarChart3 className="mb-4 h-12 w-12 opacity-20" />
								<p>Not enough data to display trends yet.</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Device and Browser Charts */}
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="bg-white/5 border-white/10 backdrop-blur-xl">
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-white">Devices</CardTitle>
						</CardHeader>
						<CardContent className="h-[300px]">
							{data?.devices && data.devices.length > 0 ? (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={data.devices}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{data.devices.map((entry, index) => (
												<Cell key={`device-${entry.name}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip
											contentStyle={{
												backgroundColor: "#18181b",
												borderColor: "#ffffff10",
												borderRadius: "8px",
												color: "#fff",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							) : (
								<div className="flex h-full items-center justify-center text-white/20">
									<p>No device data yet.</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="bg-white/5 border-white/10 backdrop-blur-xl">
						<CardHeader>
							<CardTitle className="text-lg font-semibold text-white">Browsers</CardTitle>
						</CardHeader>
						<CardContent className="h-[300px]">
							{data?.browsers && data.browsers.length > 0 ? (
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={data.browsers}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={5}
											dataKey="value"
										>
											{data.browsers.map((entry, index) => (
												<Cell
													key={`browser-${entry.name}`}
													fill={COLORS[(index + 2) % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip
											contentStyle={{
												backgroundColor: "#18181b",
												borderColor: "#ffffff10",
												borderRadius: "8px",
												color: "#fff",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							) : (
								<div className="flex h-full items-center justify-center text-white/20">
									<p>No browser data yet.</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Links Ranking */}
				<Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
					<CardHeader>
						<CardTitle className="text-lg font-semibold text-white">Popular Links</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-white/5">
							{data?.links?.map((link, index) => (
								<div
									key={link.id}
									className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
								>
									<div className="flex items-center gap-4">
										<span className="text-white/20 font-bold text-lg w-6">{index + 1}</span>
										<div>
											<p className="font-semibold text-white">{link.title || "Untitled Link"}</p>
											<p className="text-xs text-white/40 truncate max-w-[200px] md:max-w-md">
												{link.url}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-6">
										<div className="text-right">
											<p className="text-lg font-bold text-white">{link.clicks}</p>
											<p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
												Clicks
											</p>
										</div>
										<ArrowUpRight className="h-4 w-4 text-white/40" />
									</div>
								</div>
							))}
							{(!data?.links || data.links.length === 0) && (
								<div className="p-8 text-center text-white/40">No clicks recorded yet.</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
