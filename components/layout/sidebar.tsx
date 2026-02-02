"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    LayoutDashboard,
    Image,
    LayoutGrid,
    Globe,
    Activity,
    Settings,
    ChevronLeft,
    ChevronRight,
    Info,
    Home,
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
    {
        name: "Home",
        href: "/",
        icon: Home,
    },
    {
        name: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Creatives",
        href: "/dashboard/creatives",
        icon: Image,
    },
    {
        name: "Slots",
        href: "/dashboard/slots",
        icon: LayoutGrid,
    },
    {
        name: "Geo",
        href: "/dashboard/geo",
        icon: Globe,
    },
    {
        name: "System Health",
        href: "/dashboard/system-health",
        icon: Activity,
    },
    {
        name: "About",
        href: "/about",
        icon: Info,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-white/10 bg-[#0a0a0a] transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                            <Activity className="h-5 w-5 text-emerald-400" />
                        </div>
                        <span className="font-semibold text-white">AdOps</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-3">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/10",
                                    isActive && "bg-white/10 text-white",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {!collapsed && <span>{item.name}</span>}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-3">
                <Link href="/dashboard/settings">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-white/10",
                            collapsed && "justify-center px-2"
                        )}
                    >
                        <Settings className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>Settings</span>}
                    </Button>
                </Link>
            </div>
        </aside>
    );
}
