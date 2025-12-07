"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell, User } from "lucide-react";
import { useRefresh } from "@/context/RefreshContext";

export function Header() {
    const { lastRefresh, manualRefresh } = useRefresh();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        // Reset elapsed seconds when lastRefresh changes
        setElapsedSeconds(0);

        const interval = setInterval(() => {
            setElapsedSeconds(Math.floor((Date.now() - lastRefresh) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [lastRefresh]);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="border-emerald-500/50 text-xs px-2 py-0 bg-emerald-500/10 text-emerald-400"
                        >
                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            LIVE
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
                    Synced {elapsedSeconds}s ago
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={manualRefresh}
                    className="border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
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
