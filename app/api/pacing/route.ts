import { NextResponse } from "next/server";
import { getPacing } from "@/data_providers/fake_gam_provider";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "10", 10);

    const pacing = getPacing(count);

    // Calculate summary
    const statusCounts = pacing.reduce(
        (acc, campaign) => {
            acc[campaign.status] = (acc[campaign.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const totalBudget = pacing.reduce((sum, c) => sum + c.dailyBudget, 0);
    const totalSpent = pacing.reduce((sum, c) => sum + c.spent, 0);

    return NextResponse.json({
        success: true,
        data: pacing,
        meta: {
            total: pacing.length,
            timestamp: new Date().toISOString(),
            summary: {
                statusCounts,
                totalBudget,
                totalSpent,
                avgVariance: (pacing.reduce((sum, c) => sum + c.variance, 0) / pacing.length).toFixed(2),
            },
        },
    });
}
