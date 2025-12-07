"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Layers,
    CheckCircle,
    XCircle,
    Activity,
} from "lucide-react";
import type { Creative, TelemetryEvent } from "@/data_providers/fake_gam_provider";

interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta: {
        total: number;
        timestamp: string;
        summary?: Record<string, unknown>;
    };
}

interface KpiData {
    totalCreatives: number;
    activeCreatives: number;
    failuresLast24h: number;
    successRate: string;
}

export default function DashboardPage() {
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [creatives, setCreatives] = useState<Creative[]>([]);
    const [loading, setLoading] = useState(true);
    const [geoData] = useState([
        { country: "US", value: 42 },
        { country: "UK", value: 18 },
        { country: "DE", value: 12 },
        { country: "FR", value: 8 },
        { country: "IN", value: 6 },
        { country: "CA", value: 5 },
    ]);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // Fetch creatives and telemetry in parallel
                const [creativesRes, telemetryRes] = await Promise.all([
                    fetch("/api/creatives?count=50"),
                    fetch("/api/telemetry?count=200"),
                ]);

                const creativesData: ApiResponse<Creative[]> = await creativesRes.json();
                const telemetryData: ApiResponse<TelemetryEvent[]> = await telemetryRes.json();

                // Calculate KPIs
                const totalCreatives = creativesData.data.length;
                const activeCreatives = creativesData.data.filter(
                    (c) => c.status === "active"
                ).length;

                const failuresLast24h = telemetryData.data.filter(
                    (t) => t.status === "failed" || t.status === "timeout" || t.status === "blocked"
                ).length;

                const successRate =
                    telemetryData.meta.summary?.successRate as string || "0%";

                setKpiData({
                    totalCreatives,
                    activeCreatives,
                    failuresLast24h,
                    successRate,
                });

                setCreatives(creativesData.data.slice(0, 10));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const kpiCards = [
        {
            title: "TOTAL CREATIVES",
            value: kpiData?.totalCreatives ?? 0,
            subtitle: "In system",
            icon: Layers,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "ACTIVE CREATIVES",
            value: kpiData?.activeCreatives ?? 0,
            subtitle: "Currently running",
            icon: CheckCircle,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
        },
        {
            title: "FAILURES (24H)",
            value: kpiData?.failuresLast24h ?? 0,
            subtitle: "Requires attention",
            icon: XCircle,
            color: "text-red-400",
            bgColor: "bg-red-500/10",
        },
        {
            title: "SUCCESS RATE",
            value: kpiData?.successRate ?? "0%",
            subtitle: "Delivery success",
            icon: Activity,
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((kpi) => (
                    <Card
                        key={kpi.title}
                        className="border-white/10 bg-[#111111] hover:bg-[#161616] transition-colors"
                    >
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-24 bg-white/10" />
                                    <Skeleton className="h-8 w-16 bg-white/10" />
                                    <Skeleton className="h-3 w-20 bg-white/10" />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium text-gray-500 tracking-wider">
                                            {kpi.title}
                                        </p>
                                        <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-3xl font-bold text-white tracking-tight">
                                            {kpi.value}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">{kpi.subtitle}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Performance Chart Placeholder */}
                <Card className="border-white/10 bg-[#111111]">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-400 tracking-wider">
                                PERFORMANCE DISTRIBUTION
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-[280px] items-center justify-center">
                            {/* Donut Chart Placeholder */}
                            <div className="relative">
                                <div className="h-48 w-48 rounded-full border-[16px] border-emerald-500/80" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-32 w-32 rounded-full border-[16px] border-[#111111]" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-white">
                                            {loading ? "..." : kpiData?.successRate}
                                        </p>
                                        <p className="text-xs text-gray-500">Success Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-sm bg-emerald-500" />
                                <span className="text-gray-400">Success</span>
                                <span className="font-medium text-white">
                                    {kpiData?.successRate ?? "—"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-sm bg-red-500" />
                                <span className="text-gray-400">Failures</span>
                                <span className="font-medium text-white">
                                    {kpiData ? `${100 - parseFloat(kpiData.successRate)}%` : "—"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Geo Distribution */}
                <Card className="border-white/10 bg-[#111111]">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-400 tracking-wider">
                                GEO DISTRIBUTION
                            </CardTitle>
                            <span className="text-sm text-gray-500">
                                {geoData.reduce((a, b) => a + b.value, 0)}% tracked
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-[280px] items-center justify-center">
                            {/* Map Placeholder */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                <BarChart3 className="h-24 w-24 text-gray-700" />
                                <p className="absolute bottom-4 text-sm text-gray-500">
                                    Interactive map coming soon
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            {geoData.map((geo) => (
                                <Badge
                                    key={geo.country}
                                    variant="outline"
                                    className="border-white/20 bg-white/5 text-gray-300"
                                >
                                    {geo.country} {geo.value}%
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table */}
            <Card className="border-white/10 bg-[#111111]">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search creatives..."
                                className="h-9 w-64 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder-gray-500 focus:border-white/20 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Tabs defaultValue="all">
                                <TabsList className="bg-white/5 border border-white/10">
                                    <TabsTrigger
                                        value="all"
                                        className="text-xs data-[state=active]:bg-white/10"
                                    >
                                        ALL
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="active"
                                        className="text-xs data-[state=active]:bg-white/10"
                                    >
                                        ACTIVE
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="error"
                                        className="text-xs data-[state=active]:bg-white/10"
                                    >
                                        ERROR
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <span className="text-sm text-gray-500">
                                {creatives.length} creatives
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-xs font-medium text-gray-500">
                                        CREATIVE ID
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500">
                                        NAME
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500">
                                        TYPE
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500">
                                        LOAD TIME
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500">
                                        STATUS
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500">
                                        FAILURE REASON
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-white/10">
                                            <TableCell>
                                                <Skeleton className="h-4 w-20 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-32 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-16 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-12 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-16 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-24 bg-white/10" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    creatives.map((creative) => (
                                        <TableRow
                                            key={creative.id}
                                            className="border-white/10 hover:bg-white/5 cursor-pointer"
                                        >
                                            <TableCell className="font-mono text-sm text-gray-400">
                                                {creative.id}
                                            </TableCell>
                                            <TableCell className="font-medium text-white">
                                                {creative.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="border-white/20 text-gray-400 capitalize"
                                                >
                                                    {creative.type.replace("_", " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-400">
                                                <span
                                                    className={
                                                        creative.loadTime > 1000
                                                            ? "text-yellow-400"
                                                            : creative.loadTime > 2000
                                                                ? "text-red-400"
                                                                : ""
                                                    }
                                                >
                                                    {creative.loadTime}ms
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`border ${creative.status === "active"
                                                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                                                            : creative.status === "error"
                                                                ? "bg-red-500/20 text-red-400 border-red-500/50"
                                                                : creative.status === "paused"
                                                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                                                    : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                                                        }`}
                                                >
                                                    {creative.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-sm max-w-[200px] truncate">
                                                {creative.lastFailureReason || "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
