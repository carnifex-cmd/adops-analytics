import { NextResponse } from "next/server";
import { getTelemetry } from "@/data_providers/fake_gam_provider";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "100", 10);

    const telemetry = getTelemetry(count);

    // Calculate summary stats
    const statusCounts = telemetry.reduce(
        (acc, event) => {
            acc[event.status] = (acc[event.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    return NextResponse.json({
        success: true,
        data: telemetry,
        meta: {
            total: telemetry.length,
            timestamp: new Date().toISOString(),
            summary: {
                statusCounts,
                successRate: ((statusCounts.served || 0) / telemetry.length * 100).toFixed(2) + "%",
            },
        },
    });
}
