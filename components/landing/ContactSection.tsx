"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Clock, CheckCircle, Building2, Mail, User } from "lucide-react";

export function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("https://formspree.io/f/xeezlpaj", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSubmitted(true);
                // Reset form after showing success
                setTimeout(() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", company: "", message: "" });
                }, 5000);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <section id="contact" className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a]" />

            {/* Gradient Orbs */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-teal-500/8 rounded-full blur-[100px]" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4">
                        Get Started
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Transform Your{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Ad Operations?
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Let&apos;s discuss how AdOps Analytics can integrate into your
                        workflow. Share your details and we&apos;ll get back to you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left - Contact Form */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
                        <div className="relative rounded-2xl border border-white/10 bg-[#111111] p-8">
                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="name"
                                            className="text-sm font-medium text-gray-300 flex items-center gap-2"
                                        >
                                            <User className="h-4 w-4 text-gray-500" />
                                            Full Name
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="email"
                                            className="text-sm font-medium text-gray-300 flex items-center gap-2"
                                        >
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            Work Email
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@company.com"
                                            className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                        />
                                    </div>

                                    {/* Company Field */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="company"
                                            className="text-sm font-medium text-gray-300 flex items-center gap-2"
                                        >
                                            <Building2 className="h-4 w-4 text-gray-500" />
                                            Company Name
                                        </label>
                                        <Input
                                            id="company"
                                            name="company"
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={handleChange}
                                            placeholder="Acme Inc."
                                            className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="message"
                                            className="text-sm font-medium text-gray-300"
                                        >
                                            How can we help?
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us about your ad operations needs and how you'd like to integrate our dashboard..."
                                            rows={4}
                                            className="bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 resize-none"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                            <p className="text-red-400 text-sm">{error}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 text-base h-auto group rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-gray-400">
                                        We&apos;ll get back to you within 24 hours.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Info Cards */}
                    <div className="space-y-6">
                        {/* Response Time Card */}
                        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Quick Response Time
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        We&apos;ll get back to you within{" "}
                                        <span className="text-emerald-400 font-semibold">
                                            24 hours
                                        </span>{" "}
                                        with a personalized response and next steps for
                                        integrating our dashboard into your workflow.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* What to Expect Card */}
                        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                What to Expect
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Personalized demo of the platform",
                                    "Custom integration roadmap",
                                    "Dedicated onboarding support",
                                    "Flexible pricing options",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3 text-gray-400"
                                    >
                                        <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="h-3 w-3 text-emerald-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Direct Contact Card */}
                        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Prefer Email?
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Reach out directly at:
                            </p>
                            <a
                                href="mailto:shardul855@gmail.com"
                                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                            >
                                <Mail className="h-4 w-4" />
                                shardul855@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
