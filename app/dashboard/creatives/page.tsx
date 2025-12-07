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
    Filter,
    Download,
    RefreshCw,
    Image,
    Code,
    ExternalLink,
    Video,
    AlertCircle,
    Clock,
    TrendingUp,
} from "lucide-react";
import type { Creative, PacingData } from "@/data_providers/fake_gam_provider";

interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta: {
        total: number;
        timestamp: string;
    };
}

const CREATIVE_TYPE_COLORS: Record<string, string> = {
    image: "#3b82f6",
    html5: "#10b981",
    third_party_tag: "#f59e0b",
    video: "#8b5cf6",
};

const CREATIVE_TYPE_LABELS: Record<string, string> = {
    image: "Image",
    html5: "HTML5",
    third_party_tag: "Third-party Tag",
    video: "Video",
};

const CREATIVE_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    image: Image,
    html5: Code,
    third_party_tag: ExternalLink,
    video: Video,
};

// Extend Creative type with pacing data
interface CreativeWithPacing extends Creative {
    pacingPercent?: number;
}

export default function CreativesPage() {
    const [creatives, setCreatives] = useState<CreativeWithPacing[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCreative, setSelectedCreative] = useState<CreativeWithPacing | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const [creativesRes, pacingRes] = await Promise.all([
                    fetch("/api/creatives?count=50"),
                    fetch("/api/pacing?count=20"),
                ]);

                const creativesData: ApiResponse<Creative[]> = await creativesRes.json();
                const pacingData: ApiResponse<PacingData[]> = await pacingRes.json();

                // Add random pacing percentages to creatives
                const creativesWithPacing: CreativeWithPacing[] = creativesData.data.map((creative, index) => ({
                    ...creative,
                    pacingPercent: pacingData.data[index % pacingData.data.length]?.deliveryPercent || Math.random() * 100,
                }));

                setCreatives(creativesWithPacing);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleRowClick = (creative: CreativeWithPacing) => {
        setSelectedCreative(creative);
        setSheetOpen(true);
    };

    const handleRefresh = async () => {
        setLoading(true);
        const res = await fetch("/api/creatives?count=50");
        const data: ApiResponse<Creative[]> = await res.json();
        setCreatives(data.data.map((c) => ({ ...c, pacingPercent: Math.random() * 100 })));
        setLoading(false);
    };

    // Filter creatives based on search and status
    const filteredCreatives = creatives.filter((creative) => {
        const matchesSearch =
            creative.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            creative.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || creative.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
            case "error":
                return "bg-red-500/20 text-red-400 border-red-500/50";
            case "paused":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
            default:
                return "bg-blue-500/20 text-blue-400 border-blue-500/50";
        }
    };

    const getPacingColor = (percent: number) => {
        if (percent >= 90) return "text-emerald-400";
        if (percent >= 70) return "text-yellow-400";
        return "text-red-400";
    };

    const getLoadTimeColor = (ms: number) => {
        if (ms < 500) return "text-emerald-400";
        if (ms < 1500) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Creatives</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and monitor all ad creatives
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

            {/* Filters */}
            <Card className="border-white/10 bg-[#111111]">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search creatives..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-9 w-80 rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-white/20 focus:outline-none"
                                />
                            </div>
                            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
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
                                        value="paused"
                                        className="text-xs data-[state=active]:bg-white/10"
                                    >
                                        PAUSED
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="error"
                                        className="text-xs data-[state=active]:bg-white/10"
                                    >
                                        ERROR
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <span className="text-sm text-gray-500">
                            {filteredCreatives.length} of {creatives.length} creatives
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-white/10 bg-[#111111]">
                <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-xs font-medium text-gray-500 w-[140px]">
                                        CREATIVE ID
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500">
                                        NAME
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[130px]">
                                        TYPE
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[100px]">
                                        STATUS
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[200px]">
                                        LAST FAILURE
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[100px]">
                                        LOAD TIME
                                    </TableHead>
                                    <TableHead className="text-xs font-medium text-gray-500 w-[100px]">
                                        PACING %
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <TableRow key={i} className="border-white/10">
                                            <TableCell>
                                                <Skeleton className="h-4 w-24 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-40 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-20 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-16 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-32 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-16 bg-white/10" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-16 bg-white/10" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    filteredCreatives.map((creative) => {
                                        const TypeIcon = CREATIVE_TYPE_ICONS[creative.type] || Image;
                                        return (
                                            <TableRow
                                                key={creative.id}
                                                className="border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                                                onClick={() => handleRowClick(creative)}
                                            >
                                                <TableCell className="font-mono text-sm text-gray-400">
                                                    {creative.id}
                                                </TableCell>
                                                <TableCell className="font-medium text-white">
                                                    <div className="flex items-center gap-2">
                                                        <span>{creative.name}</span>
                                                        {creative.status === "error" && (
                                                            <AlertCircle className="h-4 w-4 text-red-400" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="border-white/20 capitalize gap-1"
                                                        style={{
                                                            color: CREATIVE_TYPE_COLORS[creative.type] || "#9ca3af",
                                                            borderColor: `${CREATIVE_TYPE_COLORS[creative.type]}50` || "#9ca3af50",
                                                        }}
                                                    >
                                                        <TypeIcon className="h-3 w-3" />
                                                        {CREATIVE_TYPE_LABELS[creative.type] || creative.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`border ${getStatusColor(creative.status)}`}>
                                                        {creative.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">
                                                    {creative.lastFailureReason || "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={getLoadTimeColor(creative.loadTime)}>
                                                        {creative.loadTime}ms
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${(creative.pacingPercent || 0) >= 90
                                                                        ? "bg-emerald-500"
                                                                        : (creative.pacingPercent || 0) >= 70
                                                                            ? "bg-yellow-500"
                                                                            : "bg-red-500"
                                                                    }`}
                                                                style={{ width: `${Math.min(creative.pacingPercent || 0, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className={getPacingColor(creative.pacingPercent || 0)}>
                                                            {(creative.pacingPercent || 0).toFixed(1)}%
                                                        </span>
                                                    </div>
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

            {/* Creative Details Sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="bg-[#0a0a0a] border-white/10 w-[500px] sm:max-w-[500px]">
                    {selectedCreative && (
                        <>
                            <SheetHeader>
                                <SheetTitle className="text-white flex items-center gap-2">
                                    {selectedCreative.name}
                                    <Badge className={`border ${getStatusColor(selectedCreative.status)}`}>
                                        {selectedCreative.status}
                                    </Badge>
                                </SheetTitle>
                                <SheetDescription className="text-gray-500">
                                    Creative ID: {selectedCreative.id}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                                {/* Overview Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-400 tracking-wider">
                                        OVERVIEW
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">Type</p>
                                            <Badge
                                                variant="outline"
                                                className="capitalize"
                                                style={{
                                                    color: CREATIVE_TYPE_COLORS[selectedCreative.type],
                                                    borderColor: `${CREATIVE_TYPE_COLORS[selectedCreative.type]}50`,
                                                }}
                                            >
                                                {CREATIVE_TYPE_LABELS[selectedCreative.type]}
                                            </Badge>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">Size</p>
                                            <p className="text-white font-medium">{selectedCreative.size}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">Advertiser</p>
                                            <p className="text-white font-medium">{selectedCreative.advertiser}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-xs text-gray-500 mb-1">Created</p>
                                            <p className="text-white font-medium">
                                                {new Date(selectedCreative.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-400 tracking-wider">
                                        PERFORMANCE
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">Impressions</p>
                                            </div>
                                            <p className="text-xl font-bold text-white">
                                                {selectedCreative.impressions.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">Clicks</p>
                                            </div>
                                            <p className="text-xl font-bold text-white">
                                                {selectedCreative.clicks.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">Load Time</p>
                                            </div>
                                            <p className={`text-xl font-bold ${getLoadTimeColor(selectedCreative.loadTime)}`}>
                                                {selectedCreative.loadTime}ms
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                                <p className="text-xs text-gray-500">CTR</p>
                                            </div>
                                            <p className="text-xl font-bold text-white">
                                                {((selectedCreative.clicks / selectedCreative.impressions) * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pacing Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-400 tracking-wider">
                                        PACING
                                    </h3>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-gray-400">Delivery Progress</p>
                                            <p className={`font-bold ${getPacingColor(selectedCreative.pacingPercent || 0)}`}>
                                                {(selectedCreative.pacingPercent || 0).toFixed(1)}%
                                            </p>
                                        </div>
                                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${(selectedCreative.pacingPercent || 0) >= 90
                                                        ? "bg-emerald-500"
                                                        : (selectedCreative.pacingPercent || 0) >= 70
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                                style={{ width: `${Math.min(selectedCreative.pacingPercent || 0, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Last Failure Section */}
                                {selectedCreative.lastFailureReason && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-gray-400 tracking-wider">
                                            LAST FAILURE
                                        </h3>
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                                                <div>
                                                    <p className="text-red-400 font-medium">Error Detected</p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {selectedCreative.lastFailureReason}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
                                    >
                                        View Analytics
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10"
                                    >
                                        Edit Creative
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
