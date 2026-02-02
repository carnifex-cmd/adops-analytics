"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[#0a0a0a]">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[128px]" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '64px 64px',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-gray-300">Real-time advertising analytics</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
                    Real-Time{" "}
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        AdOps Visibility
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
                    Monitor ad performance, detect failures faster, and optimize global delivery.
                    Get instant insights into creative health, geo distribution, and system status.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/dashboard">
                        <Button
                            size="lg"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-3 text-base h-auto group rounded-full"
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <a href="#features">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-3 text-base h-auto rounded-full"
                        >
                            Learn More
                        </Button>
                    </a>
                </div>

                {/* Stats Row */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white mb-1">99.9%</div>
                        <div className="text-sm text-gray-500">Uptime</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white mb-1">10M+</div>
                        <div className="text-sm text-gray-500">Impressions Tracked</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white mb-1">&lt;50ms</div>
                        <div className="text-sm text-gray-500">Avg Latency</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                    <span className="text-xs uppercase tracking-wider">Scroll</span>
                    <div className="h-8 w-5 rounded-full border border-gray-600 flex items-start justify-center p-1">
                        <div className="h-2 w-1 rounded-full bg-gray-500 animate-bounce" />
                    </div>
                </div>
            </div>
        </section>
    );
}
