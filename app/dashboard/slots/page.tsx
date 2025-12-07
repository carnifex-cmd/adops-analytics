"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    RefreshCw,
    Download,
    LayoutGrid,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Clock,
    AlertCircle,
} from "lucide-react";
import type { TelemetryEvent } from "@/data_providers/fake_gam_provider";

interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta: {
        total: number;
        timestamp: string;
    };
}

interface SlotHealth {
    slotId: string;
    totalEvents: number;
    served: number;
    failures: number;
    fillRate: number;
    lastSeenCreative: string;
    frequentFailureReason: string | null;
    lastEventTime: string;
    avgLatency: number;
    deviceBreakdown: {
        desktop: number;
        mobile: number;
        tablet: number;
        ctv: number;
    };
    failureReasons: Record<string, number>;
}

export default function SlotsPage() {
    const [slots, setSlots] = useState<SlotHealth[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<SlotHealth | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [healthFilter, setHealthFilter] = useState("all");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);

            const res = await fetch("/api/telemetry?count=500");
            const data: ApiResponse<TelemetryEvent[]> = await res.json();

            // Process telemetry to get slot-level health
            const slotMap = new Map<string, {
                events: TelemetryEvent[];
                served: number;
                failures: number;
                latencySum: number;
                failureReasons: Record<string, number>;
                deviceCounts: Record<string, number>;
            }>();

            data.data.forEach((event) => {
                if (!slotMap.has(event.slotId)) {
                    slotMap.set(event.slotId, {
                        events: [],
                        served: 0,
                        failures: 0,
                        latencySum: 0,
                        failureReasons: {},
                        deviceCounts: { desktop: 0, mobile: 0, tablet: 0, ctv: 0 },
                    });
                }

                const slot = slotMap.get(event.slotId)!;
                slot.events.push(event);
                slot.latencySum += event.latency;
                slot.deviceCounts[event.device.type] = (slot.deviceCounts[event.device.type] || 0) + 1;

                if (event.status === "served") {
                    slot.served++;
                } else {
                    slot.failures++;
                    if (event.reason) {
                        slot.failureReasons[event.reason] = (slot.failureReasons[event.reason] || 0) + 1;
                    }
                }
            });

            // Convert to SlotHealth array
            const slotsData: SlotHealth[] = Array.from(slotMap.entries()).map(([slotId, data]) => {
                const sortedEvents = data.events.sort(
                    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                const latestEvent = sortedEvents[0];

                // Find most frequent failure reason
                let frequentFailureReason: string | null = null;
                let maxCount = 0;
                Object.entries(data.failureReasons).forEach(([reason, count]) => {
                    if (count > maxCount) {
                        maxCount = count;
                        frequentFailureReason = reason;
                    }
                });

                return {
                    slotId,
                    totalEvents: data.events.length,
                    served: data.served,
                    failures: data.failures,
                    fillRate: (data.served / data.events.length) * 100,
                    lastSeenCreative: latestEvent?.creativeId || "—",
                    frequentFailureReason,
                    lastEventTime: latestEvent?.timestamp || "",
                    avgLatency: Math.round(data.latencySum / data.events.length),
                    deviceBreakdown: data.deviceCounts as SlotHealth["deviceBreakdown"],
                    failureReasons: data.failureReasons,
                };
            });

            // Sort by failures (most problematic first)
            slotsData.sort((a, b) => b.failures - a.failures);
            setSlots(slotsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleRowClick = (slot: SlotHealth) => {
        setSelectedSlot(slot);
        setSheetOpen(true);
    };

    const handleRefresh = () => {
        fetchData();
    };

    // Filter slots
    const filteredSlots = slots.filter((slot) => {
        const matchesSearch = slot.slotId.toLowerCase().includes(searchQuery.toLowerCase());
        let matchesHealth = true;
        if (healthFilter === "healthy") matchesHealth = slot.fillRate >= 90;
        if (healthFilter === "warning") matchesHealth = slot.fillRate >= 70 && slot.fillRate < 90;
        if (healthFilter === "critical") matchesHealth = slot.fillRate < 70;
        return matchesSearch && matchesHealth;
    });

    const getHealthStatus = (fillRate: number) => {
        if (fillRate >= 90) return { label: "Healthy", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" };
        if (fillRate >= 70) return { label: "Warning", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" };
        return { label: "Critical", color: "bg-red-500/20 text-red-400 border-red-500/50" };
    };

    const getFillRateColor = (fillRate: number) => {
        if (fillRate >= 90) return "text-emerald-400";
        if (fillRate >= 70) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Slots</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Monitor ad slot health and performance
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-white/10 bg-[#111111]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <LayoutGrid className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total Slots</p>
                                <p className="text-xl font-bold text-white">{slots.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-[#111111]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Healthy</p>
                                <p className="text-xl font-bold text-emerald-400">
                                    {slots.filter((s) => s.fillRate >= 90).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-[#111111]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Warning</p>
                                <p className="text-xl font-bold text-yellow-400">
                                    {slots.filter((s) => s.fillRate >= 70 && s.fillRate < 90).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-white/10 bg-[#111111]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Critical</p>
                                <p className="text-xl font-bold text-red-400">
                                    {slots.filter((s) => s.fillRate < 70).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-white/10 bg-[#111111]">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search slots..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-9 w-80 rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-white/20 focus:outline-none"
                                />
                            </div>
                            <Tabs value={healthFilter} onValueChange={setHealthFilter}>
                                <TabsList className="bg-white/5 border border-white/10">
                                    <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white/10">
                                        ALL
                                    </TabsTrigger>
                                    <TabsTrigger value="healthy" className="text-xs data-[state=active]:bg-white/10">
                                        HEALTHY
                                    </TabsTrigger>
                                    <TabsTrigger value="warning" className="text-xs data-[state=active]:bg-white/10">
                                        WARNING
                                    </TabsTrigger>
                                    <TabsTrigger value="critical" className="text-xs data-[state=active]:bg-white/10">
                                        CRITICAL
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <span className="text-sm text-gray-500">
                            {filteredSlots.length} of {slots.length} slots
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-white/10 bg-[#111111]">
                <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-xs font-medium text-gray-500 w-[150px]">
                                        SLOT ID
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[100px]">
                                        STATUS
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[120px]">
                                        FILL RATE
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[100px]">
                                        FAILURES
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[150px]">
                                        LAST CREATIVE
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500">
                                        FREQUENT FAILURE REASON
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 8 }).map((_, i) => (
                                        <TableRow key={i} className="border-white/10">
                                            <TableCell><Skeleton className="h-4 w-24 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32 bg-white/10" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    filteredSlots.map((slot) => {
                                        const health = getHealthStatus(slot.fillRate);
                                        return (
                                            <TableRow
                                                key={slot.slotId}
                                                className="border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                                                onClick={() => handleRowClick(slot)}
                                            >
                                                <TableCell className="font-mono text-sm text-gray-400">
                                                    {slot.slotId}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`border ${health.color}`}>
                                                        {health.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${slot.fillRate >= 90 ? "bg-emerald-500" :
                                                                        slot.fillRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                                                                    }`}
                                                                style={{ width: `${slot.fillRate}%` }}
                                                            />
                                                        </div>
                                                        <span className={getFillRateColor(slot.fillRate)}>
                                                            {slot.fillRate.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={slot.failures > 10 ? "text-red-400 font-medium" : "text-gray-400"}>
                                                        {slot.failures}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm text-gray-400">
                                                    {slot.lastSeenCreative}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500 max-w-[250px] truncate">
                                                    {slot.frequentFailureReason || "—"}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Slot Details Sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="bg-[#0a0a0a] border-white/10 w-[500px] sm:max-w-[500px]">
                    {selectedSlot && (
                        <>
                            <SheetHeader>
                                <SheetTitle className="text-white flex items-center gap-2">
                                    {selectedSlot.slotId}
                                    <Badge className={`border ${getHealthStatus(selectedSlot.fillRate).color}`}>
                                        {getHealthStatus(selectedSlot.fillRate).label}
                                    </Badge>
                                </SheetTitle>
                                <SheetDescription className="text-gray-500">
                                    Last activity: {new Date(selectedSlot.lastEventTime).toLocaleString()}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                                {/* Performance Metrics */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-400 tracking-wider">
                                        PERFORMANCE
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">Fill Rate</p>
                                            </div>
                                            <p className={`text-xl font-bold ${getFillRateColor(selectedSlot.fillRate)}`}>
                                                {selectedSlot.fillRate.toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">Total Events</p>
                                            </div>
                                            <p className="text-xl font-bold text-white">
                                                {selectedSlot.totalEvents}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">Served</p>
                                            </div>
                                            <p className="text-xl font-bold text-emerald-400">
                                                {selectedSlot.served}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertCircle className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">Failures</p>
                                            </div>
                                            <p className="text-xl font-bold text-red-400">
                                                {selectedSlot.failures}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">Avg Latency</p>
                                            </div>
                                            <p className="text-xl font-bold text-white">
                                                {selectedSlot.avgLatency}ms
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">Last Creative</p>
                                            <p className="text-sm font-mono text-gray-300">
                                                {selectedSlot.lastSeenCreative}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Device Breakdown */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-400 tracking-wider">
                                        DEVICE BREAKDOWN
                                    </h3>
                                    <div className="bg-white/5 rounded-lg p-4 space-y-3">
                                        {Object.entries(selectedSlot.deviceBreakdown).map(([device, count]) => {
                                            const total = Object.values(selectedSlot.deviceBreakdown).reduce((a, b) => a + b, 0);
                                            const percent = total > 0 ? (count / total) * 100 : 0;
                                            return (
                                                <div key={device} className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-400 w-16 capitalize">{device}</span>
                                                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-400 w-12 text-right">
                                                        {percent.toFixed(0)}%
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Failure Reasons */}
                                {Object.keys(selectedSlot.failureReasons).length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-gray-400 tracking-wider">
                                            FAILURE REASONS
                                        </h3>
                                        <div className="space-y-2">
                                            {Object.entries(selectedSlot.failureReasons)
                                                .sort(([, a], [, b]) => b - a)
                                                .map(([reason, count]) => (
                                                    <div
                                                        key={reason}
                                                        className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center justify-between"
                                                    >
                                                        <span className="text-sm text-gray-400">{reason}</span>
                                                        <Badge variant="outline" className="border-red-500/50 text-red-400">
                                                            {count}
                                                        </Badge>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
                                    >
                                        View Timeline
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
                                    >
                                        Configure Slot
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
