import { NextResponse } from "next/server";
import { getGeoStats } from "@/data_providers/fake_gam_provider";

export async function GET() {
    const geoStats = getGeoStats();

    // Calculate totals
    const totals = geoStats.reduce(
        (acc, geo) => {
            acc.impressions += geo.impressions;
            acc.failures += geo.failures;
            acc.revenue += geo.revenue;
            return acc;
        },
        { impressions: 0, failures: 0, revenue: 0 }
    );

    return NextResponse.json({
        success: true,
        data: geoStats,
        meta: {
            total: geoStats.length,
            timestamp: new Date().toISOString(),
            totals: {
                ...totals,
                overallFillRate: (((totals.impressions - totals.failures) / totals.impressions) * 100).toFixed(2) + "%",
            },
        },
    });
}
