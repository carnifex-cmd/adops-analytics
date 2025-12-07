import { NextResponse } from "next/server";
import { getCreatives } from "@/data_providers/fake_gam_provider";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "20", 10);

    const creatives = getCreatives(count);

    return NextResponse.json({
        success: true,
        data: creatives,
        meta: {
            total: creatives.length,
            timestamp: new Date().toISOString(),
        },
    });
}
