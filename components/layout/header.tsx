"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell, User, Pause, Play } from "lucide-react";
import { useTelemetryRefresh } from "@/lib/hooks/useAutoRefresh";

export function Header() {
    const {
        loading,
        secondsAgo,
        refresh,
        pause,
        resume,
        isPaused,
    } = useTelemetryRefresh(30000);

    const formatSecondsAgo = (seconds: number) => {
        if (seconds === 0) return "just now";
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        return `${Math.floor(seconds / 3600)}h ago`;
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={`border-emerald-500/50 text-xs px-2 py-0 ${isPaused
                                ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                                : "bg-emerald-500/10 text-emerald-400"
                                }`}
                        >
                            <span
                                className={`mr-1 h-1.5 w-1.5 rounded-full ${isPaused ? "bg-yellow-400" : "bg-emerald-400 animate-pulse"
                                    }`}
                            />
                            {isPaused ? "PAUSED" : "LIVE"}
                        </Badge>
                    </div>
                    <h1 className="text-xl font-semibold text-white tracking-tight">
                        AdOps Analytics
                    </h1>
                    <p className="text-sm text-gray-500">
                        Real-time ad operations monitoring
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    Synced {formatSecondsAgo(secondsAgo)}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={isPaused ? resume : pause}
                    className={`border-white/20 bg-transparent hover:bg-white/10 ${isPaused ? "text-yellow-400" : "text-white"
                        }`}
                >
                    {isPaused ? (
                        <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                        </>
                    ) : (
                        <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                        </>
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refresh}
                    disabled={loading}
                    className="border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
                <div className="h-6 w-px bg-white/10" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10"
                >
                    <Bell className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10"
                >
                    <User className="h-5 w-5" />
                </Button>
            </div>
        </header>
    );
}
