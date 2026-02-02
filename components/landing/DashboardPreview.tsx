"use client";

import Image from "next/image";

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
                    <div className="relative rounded-2xl border border-white/10 bg-[#111111] p-4 md:p-6 shadow-2xl overflow-hidden">
                        {/* Browser Chrome */}
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
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

                        {/* Real Dashboard Screenshot */}
                        <div className="relative rounded-lg overflow-hidden">
                            <Image
                                src="/images/dashboard-preview.png"
                                alt="AdOps Analytics Dashboard - Real-time monitoring with creative distribution charts and global performance tracking"
                                width={1920}
                                height={1080}
                                className="w-full h-auto rounded-lg"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
