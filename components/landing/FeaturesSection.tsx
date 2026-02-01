"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Activity,
    Image,
    Globe,
    Bell,
    Zap,
    Shield,
    BarChart3,
    Clock,
} from "lucide-react";

const features = [
    {
        title: "Real-Time Monitoring",
        description: "Track ad delivery and performance metrics as they happen. Get instant visibility into your entire ad stack.",
        icon: Activity,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "group-hover:border-emerald-500/30",
    },
    {
        title: "Creative Health",
        description: "Monitor creative status, identify failing assets, and maintain optimal creative portfolio health.",
        icon: Image,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "group-hover:border-purple-500/30",
    },
    {
        title: "Geo Performance",
        description: "Visualize global ad delivery with interactive maps. Identify regional issues and optimize geo-targeting.",
        icon: Globe,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "group-hover:border-blue-500/30",
    },
    {
        title: "Automated Alerts",
        description: "Set thresholds and receive instant notifications when metrics deviate. Never miss critical issues.",
        icon: Bell,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "group-hover:border-amber-500/30",
    },
    {
        title: "Fast Insights",
        description: "Sub-50ms data processing ensures you always have the freshest insights for quick decision making.",
        icon: Zap,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "group-hover:border-yellow-500/30",
    },
    {
        title: "Enterprise Security",
        description: "Bank-grade encryption and compliance with GDPR, SOC 2, and industry standards.",
        icon: Shield,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "group-hover:border-green-500/30",
    },
    {
        title: "Advanced Analytics",
        description: "Deep dive into trends, cohort analysis, and predictive insights powered by machine learning.",
        icon: BarChart3,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "group-hover:border-cyan-500/30",
    },
    {
        title: "24/7 Monitoring",
        description: "Round-the-clock system monitoring with 99.9% uptime guarantee and dedicated support.",
        icon: Clock,
        color: "text-rose-400",
        bgColor: "bg-rose-500/10",
        borderColor: "group-hover:border-rose-500/30",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[#0a0a0a]" />

            {/* Subtle gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[128px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4">
                        Features
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Everything You Need for AdOps Excellence
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A comprehensive suite of tools designed for modern ad operations teams.
                        From real-time monitoring to advanced analytics.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className={`group border-white/10 bg-[#111111] hover:bg-[#161616] transition-all duration-300 cursor-default ${feature.borderColor}`}
                        >
                            <CardContent className="p-6">
                                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
