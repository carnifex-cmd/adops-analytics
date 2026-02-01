"use client";

import { Card, CardContent } from "@/components/ui/card";
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
} from "recharts";

const kpiCards = [
    {
        title: "TOTAL CREATIVES",
        value: "1,247",
        subtitle: "In system",
        icon: Layers,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "ACTIVE CREATIVES",
        value: "892",
        subtitle: "Currently running",
        icon: CheckCircle,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
    },
    {
        title: "FAILURES (24H)",
        value: "23",
        subtitle: "Requires attention",
        icon: XCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
    },
    {
        title: "SUCCESS RATE",
        value: "98.2%",
        subtitle: "Delivery success",
        icon: Activity,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
    },
];

const pieData = [
    { name: "Image", value: 35, color: "#3b82f6" },
    { name: "HTML5", value: 28, color: "#10b981" },
    { name: "Video", value: 22, color: "#8b5cf6" },
    { name: "Third-party", value: 15, color: "#f59e0b" },
];

// Simple world map SVG paths for major regions
const worldMapRegions = [
    { id: "na", path: "M 50 60 L 120 45 L 150 65 L 145 95 L 90 110 L 45 90 Z", color: "#10b981" },
    { id: "sa", path: "M 90 115 L 115 120 L 130 175 L 95 190 L 75 150 Z", color: "#22c55e" },
    { id: "eu", path: "M 195 55 L 240 50 L 255 75 L 230 85 L 195 80 Z", color: "#10b981" },
    { id: "af", path: "M 200 90 L 235 90 L 245 150 L 210 165 L 190 125 Z", color: "#eab308" },
    { id: "as", path: "M 260 45 L 340 50 L 350 100 L 290 115 L 255 90 Z", color: "#10b981" },
    { id: "oc", path: "M 320 135 L 365 130 L 375 170 L 330 175 Z", color: "#22c55e" },
];

export function DashboardPreview() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Powerful Dashboard at a Glance
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Monitor all your ad operations from a single, intuitive interface.
                        Real-time metrics, visual analytics, and global performance tracking.
                    </p>
                </div>

                {/* Dashboard Mockup Container */}
                <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50" />

                    {/* Dashboard Frame */}
                    <div className="relative rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
                        {/* Browser Chrome */}
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400">
                                    adops.analytics.io/dashboard
                                </div>
                            </div>
                        </div>

                        {/* KPI Cards Row */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                            {kpiCards.map((kpi) => (
                                <Card
                                    key={kpi.title}
                                    className="border-white/10 bg-[#0a0a0a] hover:bg-[#0f0f0f] transition-colors"
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-medium text-gray-500 tracking-wider">
                                                {kpi.title}
                                            </p>
                                            <div className={`p-1.5 rounded-md ${kpi.bgColor}`}>
                                                <kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} />
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-2xl font-bold text-white tracking-tight">
                                                {kpi.value}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">{kpi.subtitle}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Pie Chart */}
                            <Card className="border-white/10 bg-[#0a0a0a]">
                                <CardContent className="p-5">
                                    <p className="text-xs font-medium text-gray-500 tracking-wider mb-4">
                                        CREATIVE TYPE DISTRIBUTION
                                    </p>
                                    <div className="h-[180px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={45}
                                                    outerRadius={70}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    stroke="transparent"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-4 mt-2">
                                        {pieData.map((item) => (
                                            <div key={item.name} className="flex items-center gap-1.5">
                                                <div
                                                    className="h-2.5 w-2.5 rounded-sm"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="text-xs text-gray-400">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* World Map */}
                            <Card className="border-white/10 bg-[#0a0a0a]">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-xs font-medium text-gray-500 tracking-wider">
                                            GEO PERFORMANCE
                                        </p>
                                        <span className="text-xs text-gray-500">6 regions tracked</span>
                                    </div>
                                    <div className="h-[180px] flex items-center justify-center">
                                        <svg viewBox="0 0 400 200" className="w-full h-full max-w-[350px]">
                                            {worldMapRegions.map((region) => (
                                                <path
                                                    key={region.id}
                                                    d={region.path}
                                                    fill={region.color}
                                                    stroke="#0a0a0a"
                                                    strokeWidth="1"
                                                    opacity="0.8"
                                                    className="hover:opacity-100 transition-opacity cursor-pointer"
                                                />
                                            ))}
                                            {/* Pulse dots for active regions */}
                                            <circle cx="100" cy="70" r="4" fill="#10b981" className="animate-pulse" />
                                            <circle cx="220" cy="65" r="4" fill="#10b981" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                                            <circle cx="300" cy="75" r="4" fill="#10b981" className="animate-pulse" style={{ animationDelay: '1s' }} />
                                        </svg>
                                    </div>
                                    <div className="flex justify-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                                            <span className="text-xs text-gray-400">&lt;3% failure</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2.5 w-2.5 rounded-sm bg-yellow-500" />
                                            <span className="text-xs text-gray-400">5-7% failure</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
