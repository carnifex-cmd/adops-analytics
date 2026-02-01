"use client";

import { CheckCircle } from "lucide-react";

const stats = [
    { value: "99.9%", label: "Platform Uptime" },
    { value: "10M+", label: "Daily Impressions" },
    { value: "<50ms", label: "Data Latency" },
    { value: "24/7", label: "Monitoring" },
];

const benefits = [
    "Real-time visibility into ad operations",
    "Reduce failure detection time by 90%",
    "Global delivery optimization",
    "Enterprise-grade security & compliance",
    "Dedicated support team",
    "Seamless integration with major ad platforms",
];

export function TrustSection() {
    return (
        <section id="trust" className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Content */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Text Content */}
                    <div>
                        <p className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4">
                            Why Teams Choose Us
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Built for Enterprise{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                Ad Operations
                            </span>
                        </h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            AdOps Analytics is trusted by leading publishers and advertising
                            platforms worldwide. Our platform is designed to handle the scale
                            and complexity of modern digital advertising.
                        </p>

                        {/* Benefits List */}
                        <div className="grid gap-4">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                    </div>
                                    <span className="text-gray-300">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Visual Element */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
                        <div className="relative rounded-2xl border border-white/10 bg-[#111111] p-8">
                            {/* Quote/Testimonial style */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                                        A
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">AdOps Analytics</p>
                                        <p className="text-sm text-gray-500">Enterprise Platform</p>
                                    </div>
                                </div>
                                <blockquote className="text-xl text-gray-300 italic leading-relaxed">
                                    &ldquo;Monitor, analyze, and optimize your entire ad stack
                                    from a single, powerful dashboard.&rdquo;
                                </blockquote>
                                <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-2xl font-bold text-white">500+</p>
                                        <p className="text-xs text-gray-500">Active Users</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">50+</p>
                                        <p className="text-xs text-gray-500">Integrations</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">15+</p>
                                        <p className="text-xs text-gray-500">Countries</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
