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
    Layers,
    CheckCircle,
    XCircle,
    Activity,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
    AreaChart,
} from "recharts";
import { GeoMap } from "@/components/charts/geo-map";
import type { Creative, TelemetryEvent, GeoStats } from "@/data_providers/fake_gam_provider";

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

interface CreativeTypeData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;
}

interface TimelineData {
    time: string;
    hour: number;
    failures: number;
    served: number;
    total: number;
    [key: string]: string | number;
}

const CREATIVE_TYPE_COLORS: Record<string, string> = {
    image: "#3b82f6",        // Blue
    html5: "#10b981",        // Emerald
    third_party_tag: "#f59e0b", // Amber
    video: "#8b5cf6",        // Purple
};

const CREATIVE_TYPE_LABELS: Record<string, string> = {
    image: "Image",
    html5: "HTML5",
    third_party_tag: "Third-party Tag",
    video: "Video",
};

export default function DashboardPage() {
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [creatives, setCreatives] = useState<Creative[]>([]);
    const [creativeTypeData, setCreativeTypeData] = useState<CreativeTypeData[]>([]);
    const [geoStats, setGeoStats] = useState<GeoStats[]>([]);
    const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // Fetch creatives, telemetry, and geo stats in parallel
                const [creativesRes, telemetryRes, geosRes] = await Promise.all([
                    fetch("/api/creatives?count=50"),
                    fetch("/api/telemetry?count=200"),
                    fetch("/api/geos"),
                ]);

                const creativesData: ApiResponse<Creative[]> = await creativesRes.json();
                const telemetryData: ApiResponse<TelemetryEvent[]> = await telemetryRes.json();
                const geosData: ApiResponse<GeoStats[]> = await geosRes.json();

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

                // Calculate creative type distribution
                const typeCounts = creativesData.data.reduce((acc, creative) => {
                    acc[creative.type] = (acc[creative.type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                const typeData: CreativeTypeData[] = Object.entries(typeCounts).map(([type, count]) => ({
                    name: CREATIVE_TYPE_LABELS[type] || type,
                    value: count,
                    color: CREATIVE_TYPE_COLORS[type] || "#6b7280",
                }));

                setCreativeTypeData(typeData);
                setCreatives(creativesData.data.slice(0, 10));
                setGeoStats(geosData.data);

                // Calculate failures over time (group by hour)
                const now = new Date();
                const hourlyData: Record<number, { failures: number; served: number; total: number }> = {};

                // Initialize last 24 hours
                for (let i = 23; i >= 0; i--) {
                    hourlyData[i] = { failures: 0, served: 0, total: 0 };
                }

                // Group telemetry by hour
                telemetryData.data.forEach((event) => {
                    const eventTime = new Date(event.timestamp);
                    const hoursAgo = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60 * 60));

                    if (hoursAgo >= 0 && hoursAgo < 24) {
                        hourlyData[hoursAgo].total++;
                        if (event.status === "served") {
                            hourlyData[hoursAgo].served++;
                        } else {
                            hourlyData[hoursAgo].failures++;
                        }
                    }
                });

                // Convert to array format for Recharts
                const timeline: TimelineData[] = Object.entries(hourlyData)
                    .map(([hoursAgo, data]) => {
                        const hour = new Date(now.getTime() - parseInt(hoursAgo) * 60 * 60 * 1000);
                        return {
                            time: hour.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }),
                            hour: parseInt(hoursAgo),
                            ...data,
                        };
                    })
                    .reverse();

                setTimelineData(timeline);
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

    // Custom tooltip for the pie chart
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: CreativeTypeData }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
                    <p className="text-white font-medium">{data.name}</p>
                    <p className="text-gray-400 text-sm">{data.value} creatives</p>
                </div>
            );
        }
        return null;
    };

    // Custom legend for the pie chart
    const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
        if (!payload) return null;
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-400 text-sm">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

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
                {/* Creative Types Pie Chart */}
                <Card className="border-white/10 bg-[#111111]">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-400 tracking-wider">
                                CREATIVE TYPE DISTRIBUTION
                            </CardTitle>
                            <span className="text-sm text-gray-500">
                                {kpiData?.totalCreatives ?? 0} total
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex h-[300px] items-center justify-center">
                                <Skeleton className="h-48 w-48 rounded-full bg-white/10" />
                            </div>
                        ) : (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={creativeTypeData}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="transparent"
                                        >
                                            {creativeTypeData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend content={<CustomLegend />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Geo Distribution Map */}
                <Card className="border-white/10 bg-[#111111]">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-gray-400 tracking-wider">
                                GEO FAILURE RATE
                            </CardTitle>
                            <span className="text-sm text-gray-500">
                                {geoStats.length} countries tracked
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[340px]">
                            <GeoMap data={geoStats} loading={loading} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Failures Over Time Chart */}
            <Card className="border-white/10 bg-[#111111]">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-400 tracking-wider">
                            FAILURES OVER TIME (24H)
                        </CardTitle>
                        <span className="text-sm text-gray-500">
                            {timelineData.reduce((sum, d) => sum + d.failures, 0)} total failures
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-[200px] items-center justify-center">
                            <Skeleton className="h-full w-full bg-white/10" />
                        </div>
                    ) : (
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="failureGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="servedGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        tick={{ fill: '#6b7280', fontSize: 11 }}
                                        axisLine={{ stroke: '#ffffff10' }}
                                        tickLine={false}
                                        interval={3}
                                    />
                                    <YAxis
                                        tick={{ fill: '#6b7280', fontSize: 11 }}
                                        axisLine={{ stroke: '#ffffff10' }}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                        }}
                                        labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}
                                        itemStyle={{ color: '#9ca3af', fontSize: 12 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="served"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fill="url(#servedGradient)"
                                        name="Served"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="failures"
                                        stroke="#ef4444"
                                        strokeWidth={2}
                                        fill="url(#failureGradient)"
                                        name="Failures"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-sm bg-emerald-500" />
                            <span className="text-gray-400">Served</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-sm bg-red-500" />
                            <span className="text-gray-400">Failures</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                                                    className="border-white/20 capitalize"
                                                    style={{
                                                        color: CREATIVE_TYPE_COLORS[creative.type] || "#9ca3af",
                                                        borderColor: `${CREATIVE_TYPE_COLORS[creative.type]}50` || "#9ca3af50",
                                                    }}
                                                >
                                                    {CREATIVE_TYPE_LABELS[creative.type] || creative.type}
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
