// Fake GAM (Google Ad Manager) Data Provider
// Generates realistic mock data for ad operations analytics

// Types
export interface Creative {
    id: string;
    name: string;
    type: "image" | "html5" | "third_party_tag" | "video";
    status: "active" | "paused" | "error" | "pending_review";
    lastFailureReason: string | null;
    loadTime: number; // in milliseconds
    size: string;
    advertiser: string;
    createdAt: string;
    impressions: number;
    clicks: number;
}

export interface TelemetryEvent {
    creativeId: string;
    slotId: string;
    status: "served" | "failed" | "timeout" | "blocked";
    reason: string | null;
    timestamp: string;
    geo: {
        country: string;
        region: string;
        city: string;
    };
    device: {
        type: "desktop" | "mobile" | "tablet" | "ctv";
        os: string;
        browser: string;
    };
    latency: number;
}

export interface GeoStats {
    country: string;
    countryCode: string;
    impressions: number;
    failures: number;
    fillRate: number;
    avgLatency: number;
    revenue: number;
}

export interface PacingData {
    campaignId: string;
    campaignName: string;
    deliveryPercent: number;
    expectedPercent: number;
    variance: number;
    status: "on_track" | "under_delivery" | "over_delivery";
    dailyBudget: number;
    spent: number;
    remainingDays: number;
}

// Helper functions
function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

function getRandomTimestamp(hoursAgo: number = 24): string {
    const now = new Date();
    const past = new Date(now.getTime() - Math.random() * hoursAgo * 60 * 60 * 1000);
    return past.toISOString();
}

// Data constants
const CREATIVE_TYPES: Creative["type"][] = ["image", "html5", "third_party_tag", "video"];
const CREATIVE_STATUSES: Creative["status"][] = ["active", "paused", "error", "pending_review"];
const SIZES = ["300x250", "728x90", "160x600", "320x50", "300x600", "970x250", "320x480"];
const ADVERTISERS = [
    "TechCorp Inc.",
    "Fashion Forward",
    "AutoDrive Motors",
    "FoodieDelight",
    "TravelEase",
    "FinanceFirst",
    "HealthPlus",
    "GameZone Studios",
    "EcoGreen Products",
    "LuxuryBrands Co.",
];
const CREATIVE_NAMES = [
    "Summer Sale Banner",
    "Holiday Promo",
    "Brand Awareness",
    "Product Launch",
    "Retargeting Campaign",
    "Mobile App Install",
    "Video Pre-roll",
    "Native Content",
    "Rich Media Interactive",
    "Dynamic Creative",
];
const FAILURE_REASONS = [
    "Creative timeout exceeded",
    "Invalid creative format",
    "Third-party script blocked",
    "SSL certificate error",
    "Creative size mismatch",
    "Network request failed",
    "CORS policy violation",
    "Malware detected",
    "Policy violation",
    null,
    null,
    null, // null means no failure
];

const TELEMETRY_STATUSES: TelemetryEvent["status"][] = ["served", "failed", "timeout", "blocked"];
const TELEMETRY_REASONS = {
    served: null,
    failed: [
        "Creative load error",
        "Network timeout",
        "Invalid response",
        "Script error",
    ],
    timeout: ["Request timeout after 3000ms", "Bid response timeout", "Render timeout"],
    blocked: [
        "Ad blocker detected",
        "Brand safety violation",
        "Geo restriction",
        "Device restriction",
    ],
};

const COUNTRIES = [
    { country: "United States", code: "US", weight: 35 },
    { country: "United Kingdom", code: "UK", weight: 15 },
    { country: "Germany", code: "DE", weight: 12 },
    { country: "France", code: "FR", weight: 8 },
    { country: "Canada", code: "CA", weight: 7 },
    { country: "Australia", code: "AU", weight: 6 },
    { country: "India", code: "IN", weight: 5 },
    { country: "Japan", code: "JP", weight: 4 },
    { country: "Brazil", code: "BR", weight: 4 },
    { country: "Netherlands", code: "NL", weight: 4 },
];

const REGIONS = ["California", "New York", "Texas", "London", "Bavaria", "Ontario", "Maharashtra"];
const CITIES = ["New York", "Los Angeles", "London", "Berlin", "Paris", "Toronto", "Mumbai", "Tokyo"];
const DEVICE_TYPES: TelemetryEvent["device"]["type"][] = ["desktop", "mobile", "tablet", "ctv"];
const OPERATING_SYSTEMS = ["Windows 11", "macOS 14", "iOS 17", "Android 14", "Chrome OS", "tvOS"];
const BROWSERS = ["Chrome 120", "Safari 17", "Firefox 121", "Edge 120", "Samsung Browser"];

const CAMPAIGN_NAMES = [
    "Q4 Brand Campaign",
    "Holiday Season Push",
    "New Product Launch",
    "Retention Campaign",
    "Awareness Drive",
    "Performance Max",
    "Mobile First Initiative",
    "Video Engagement",
    "Cross-Platform Reach",
    "Lookalike Audience",
];

/**
 * Get all creatives with realistic fake data
 */
export function getCreatives(count: number = 20): Creative[] {
    const creatives: Creative[] = [];

    for (let i = 0; i < count; i++) {
        const status = randomFromArray(CREATIVE_STATUSES);
        const hasFailure = status === "error" || Math.random() < 0.15;

        creatives.push({
            id: generateId("CR"),
            name: `${randomFromArray(CREATIVE_NAMES)} ${randomInt(1, 99)}`,
            type: randomFromArray(CREATIVE_TYPES),
            status,
            lastFailureReason: hasFailure
                ? randomFromArray(FAILURE_REASONS.filter((r) => r !== null))
                : null,
            loadTime: randomInt(50, 2500),
            size: randomFromArray(SIZES),
            advertiser: randomFromArray(ADVERTISERS),
            createdAt: getRandomTimestamp(720), // Last 30 days
            impressions: randomInt(10000, 500000),
            clicks: randomInt(100, 15000),
        });
    }

    return creatives.sort((a, b) => b.impressions - a.impressions);
}

/**
 * Get telemetry events with realistic fake data
 */
export function getTelemetry(count: number = 100): TelemetryEvent[] {
    const events: TelemetryEvent[] = [];
    const creativeIds = Array.from({ length: 15 }, () => generateId("CR"));
    const slotIds = Array.from({ length: 8 }, () => generateId("SLOT"));

    for (let i = 0; i < count; i++) {
        // Weight towards "served" status (70% served, 30% other)
        const status: TelemetryEvent["status"] =
            Math.random() < 0.7
                ? "served"
                : randomFromArray(["failed", "timeout", "blocked"]);

        let reason: string | null = null;
        if (status !== "served") {
            const reasons = TELEMETRY_REASONS[status];
            reason = reasons ? randomFromArray(reasons) : null;
        }

        const country = randomFromArray(COUNTRIES);

        events.push({
            creativeId: randomFromArray(creativeIds),
            slotId: randomFromArray(slotIds),
            status,
            reason,
            timestamp: getRandomTimestamp(24),
            geo: {
                country: country.country,
                region: randomFromArray(REGIONS),
                city: randomFromArray(CITIES),
            },
            device: {
                type: randomFromArray(DEVICE_TYPES),
                os: randomFromArray(OPERATING_SYSTEMS),
                browser: randomFromArray(BROWSERS),
            },
            latency: randomInt(20, 800),
        });
    }

    return events.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

/**
 * Get geo statistics with impressions and failures per country
 */
export function getGeoStats(): GeoStats[] {
    return COUNTRIES.map((country) => {
        const impressions = randomInt(50000, 500000) * (country.weight / 10);
        const failures = Math.floor(impressions * randomFloat(0.02, 0.12));
        const fillRate = ((impressions - failures) / impressions) * 100;

        return {
            country: country.country,
            countryCode: country.code,
            impressions: Math.floor(impressions),
            failures,
            fillRate: parseFloat(fillRate.toFixed(2)),
            avgLatency: randomInt(80, 350),
            revenue: randomFloat(1000, 25000),
        };
    }).sort((a, b) => b.impressions - a.impressions);
}

/**
 * Get pacing data for campaigns
 */
export function getPacing(count: number = 10): PacingData[] {
    const pacing: PacingData[] = [];

    for (let i = 0; i < count; i++) {
        const expectedPercent = randomFloat(30, 85);
        const variance = randomFloat(-15, 15);
        const deliveryPercent = Math.max(0, Math.min(100, expectedPercent + variance));

        let status: PacingData["status"];
        if (variance > 5) {
            status = "over_delivery";
        } else if (variance < -5) {
            status = "under_delivery";
        } else {
            status = "on_track";
        }

        const dailyBudget = randomInt(500, 10000);
        const spentRatio = deliveryPercent / 100;

        pacing.push({
            campaignId: generateId("CMP"),
            campaignName: `${randomFromArray(CAMPAIGN_NAMES)} ${randomInt(1, 50)}`,
            deliveryPercent: parseFloat(deliveryPercent.toFixed(1)),
            expectedPercent: parseFloat(expectedPercent.toFixed(1)),
            variance: parseFloat(variance.toFixed(1)),
            status,
            dailyBudget,
            spent: parseFloat((dailyBudget * spentRatio).toFixed(2)),
            remainingDays: randomInt(1, 30),
        });
    }

    return pacing.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
}

// Export all data at once for convenience
export function getAllData() {
    return {
        creatives: getCreatives(),
        telemetry: getTelemetry(),
        geoStats: getGeoStats(),
        pacing: getPacing(),
    };
}
