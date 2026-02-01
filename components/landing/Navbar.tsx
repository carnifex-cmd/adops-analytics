"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20">
                            <Activity className="h-5 w-5 text-emerald-400" />
                        </div>
                        <span className="text-lg font-semibold text-white">AdOps Analytics</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#trust"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Why AdOps
                        </a>
                        <Link
                            href="/about"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            About
                        </Link>
                    </div>

                    {/* CTA */}
                    <Link href="/dashboard">
                        <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5"
                        >
                            View Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
