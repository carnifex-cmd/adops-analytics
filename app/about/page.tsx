import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Activity,
    Globe,
    AlertTriangle,
    TrendingUp,
    Server,
    Zap,
    Code,
    BarChart3,
    RefreshCw,
    Database,
    LineChart,
    Cpu,
    Layers,
    ArrowLeft,
} from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="container mx-auto px-6 py-12 max-w-5xl">
                {/* Back Button */}
                <Link href="/dashboard">
                    <Button
                        variant="ghost"
                        className="mb-8 text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/50">
                        AdOps Analytics
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        About AdOps Analytics Dashboard
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                        A real-time tool for monitoring ad delivery, creative performance, and operational health.
                    </p>
                </div>

                {/* What This Tool Does */}
                <Card className="border-white/10 bg-[#111111] mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-400" />
                            What This Tool Does
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                                <Activity className="h-5 w-5 text-emerald-400 mt-0.5" />
                                <div>
                                    <p className="text-white font-medium">Real-time Creative Delivery Tracking</p>
                                    <p className="text-sm text-gray-500">Monitor ad impressions and delivery status in real-time</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                                <Globe className="h-5 w-5 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-white font-medium">Geo-level Performance Visualization</p>
                                    <p className="text-sm text-gray-500">Interactive world map showing regional ad performance</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                                <div>
                                    <p className="text-white font-medium">Failure Case Monitoring</p>
                                    <p className="text-sm text-gray-500">Track and diagnose ad delivery failures (simulated for MVP)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5">
                                <TrendingUp className="h-5 w-5 text-purple-400 mt-0.5" />
                                <div>
                                    <p className="text-white font-medium">Pacing and KPI Insights</p>
                                    <p className="text-sm text-gray-500">Monitor delivery pacing and key performance indicators</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 md:col-span-2">
                                <Server className="h-5 w-5 text-orange-400 mt-0.5" />
                                <div>
                                    <p className="text-white font-medium">Google Ad Manager Integration Ready</p>
                                    <p className="text-sm text-gray-500">Designed for seamless integration with Google Ad Manager SOAP API</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* How It Works */}
                <Card className="border-white/10 bg-[#111111] mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-blue-400" />
                            How It Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Code className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Next.js Frontend with shadcn UI</p>
                                    <p className="text-sm text-gray-500">Modern React framework with beautiful, accessible components</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <RefreshCw className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Unified RefreshContext for Auto Refresh</p>
                                    <p className="text-sm text-gray-500">Centralized refresh system ensuring all widgets stay in sync</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Layers className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">Data Provider Abstraction</p>
                                    <p className="text-sm text-gray-500">Fake provider now, GAM provider later — easy to swap</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                                <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                    <BarChart3 className="h-5 w-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">API Endpoints Powering Widgets</p>
                                    <p className="text-sm text-gray-500">Clean REST APIs for creatives, telemetry, geo stats, and pacing</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Current MVP + Future */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Current MVP Data Sources */}
                    <Card className="border-white/10 bg-[#111111]">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Database className="h-5 w-5 text-emerald-400" />
                                Current MVP Data Sources
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                                        Active
                                    </Badge>
                                    <span className="text-gray-300">Fake telemetry provider</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                                        Active
                                    </Badge>
                                    <span className="text-gray-300">Fake GAM provider data</span>
                                </div>
                                <Separator className="bg-white/10 my-4" />
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                                        Coming Soon
                                    </Badge>
                                    <span className="text-gray-300">Real GAM SOAP API support</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Future Enhancements */}
                    <Card className="border-white/10 bg-[#111111]">
                        <CardHeader>
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <LineChart className="h-5 w-5 text-purple-400" />
                                Future Enhancements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    Integrate Google Ad Manager SOAP API
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    Pull real delivery, geo, creative stats
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    Integrate GPT test ad units for render telemetry
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    Add anomaly detection for outages
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    Add alerting system (email/push)
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    Add historical trend storage
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Tech Stack */}
                <Card className="border-white/10 bg-[#111111] mb-12">
                    <CardHeader>
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                            <Code className="h-5 w-5 text-cyan-400" />
                            Tech Stack
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                                Next.js 14 (App Router)
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                                TypeScript
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                                shadcn/ui
                            </Badge>
                            <Badge className="bg-white/10 text-white border-white/20 px-4 py-2">
                                Recharts
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Separator className="bg-white/10 mb-8" />
                <footer className="text-center">
                    <p className="text-gray-400">
                        Built by{" "}
                        <span className="text-white font-semibold">Shardul Sawant</span>
                        {" "}— AdTech & Full-Stack Engineer
                    </p>
                </footer>
            </div>
        </div>
    );
}
