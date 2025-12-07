"use client";

import { useState, memo } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from "react-simple-maps";

interface GeoData {
    country: string;
    countryCode: string;
    impressions: number;
    failures: number;
    fillRate: number;
    avgLatency: number;
    revenue: number;
}

interface GeoMapProps {
    data: GeoData[];
    loading?: boolean;
}

// Map country codes to ISO Alpha-3 codes used in TopoJSON
const COUNTRY_CODE_MAP: Record<string, string> = {
    US: "USA",
    UK: "GBR",
    GB: "GBR",
    DE: "DEU",
    FR: "FRA",
    CA: "CAN",
    AU: "AUS",
    IN: "IND",
    JP: "JPN",
    BR: "BRA",
    NL: "NLD",
    ES: "ESP",
    IT: "ITA",
    MX: "MEX",
    KR: "KOR",
    CN: "CHN",
    RU: "RUS",
};

// TopoJSON URL for world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Color scale based on failure rate
function getCountryColor(failureRate: number | undefined): string {
    if (failureRate === undefined) return "#1f2937"; // Default gray for no data

    if (failureRate <= 3) return "#10b981"; // Green - low failure
    if (failureRate <= 5) return "#22c55e"; // Light green
    if (failureRate <= 7) return "#eab308"; // Yellow - medium
    if (failureRate <= 10) return "#f97316"; // Orange - high
    return "#ef4444"; // Red - very high failure
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
}

function GeoMapComponent({ data, loading = false }: GeoMapProps) {
    const [tooltipContent, setTooltipContent] = useState<{
        x: number;
        y: number;
        data: GeoData | null;
        countryName: string;
    } | null>(null);

    // Create a map for quick lookup
    const dataMap = new Map<string, GeoData>();
    data.forEach((d) => {
        const iso3 = COUNTRY_CODE_MAP[d.countryCode];
        if (iso3) {
            dataMap.set(iso3, d);
        }
    });

    const handleMouseEnter = (
        geo: { properties: { name: string; ISO_A3?: string } },
        event: React.MouseEvent
    ) => {
        const isoCode = geo.properties.ISO_A3 || geo.properties.name;
        const geoData = dataMap.get(isoCode);

        setTooltipContent({
            x: event.clientX,
            y: event.clientY,
            data: geoData || null,
            countryName: geo.properties.name,
        });
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        if (tooltipContent) {
            setTooltipContent({
                ...tooltipContent,
                x: event.clientX,
                y: event.clientY,
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltipContent(null);
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-pulse text-gray-500">Loading map...</div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 120,
                    center: [0, 30],
                }}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <ZoomableGroup>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const isoCode = geo.properties.ISO_A3;
                                const geoData = dataMap.get(isoCode);
                                const failureRate = geoData
                                    ? ((geoData.failures / geoData.impressions) * 100)
                                    : undefined;

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={(event) => handleMouseEnter(geo, event)}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        style={{
                                            default: {
                                                fill: getCountryColor(failureRate),
                                                stroke: "#0a0a0a",
                                                strokeWidth: 0.5,
                                                outline: "none",
                                            },
                                            hover: {
                                                fill: geoData ? "#60a5fa" : "#374151",
                                                stroke: "#0a0a0a",
                                                strokeWidth: 0.5,
                                                outline: "none",
                                                cursor: geoData ? "pointer" : "default",
                                            },
                                            pressed: {
                                                fill: "#3b82f6",
                                                stroke: "#0a0a0a",
                                                strokeWidth: 0.5,
                                                outline: "none",
                                            },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip */}
            {tooltipContent && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: tooltipContent.x + 10,
                        top: tooltipContent.y - 10,
                    }}
                >
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 shadow-xl min-w-[180px]">
                        <p className="text-white font-semibold mb-2">
                            {tooltipContent.countryName}
                        </p>
                        {tooltipContent.data ? (
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Impressions:</span>
                                    <span className="text-white font-medium">
                                        {formatNumber(tooltipContent.data.impressions)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Failures:</span>
                                    <span className="text-red-400 font-medium">
                                        {formatNumber(tooltipContent.data.failures)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Failure Rate:</span>
                                    <span
                                        className={`font-medium ${(tooltipContent.data.failures / tooltipContent.data.impressions) * 100 > 7
                                                ? "text-red-400"
                                                : (tooltipContent.data.failures / tooltipContent.data.impressions) * 100 > 5
                                                    ? "text-yellow-400"
                                                    : "text-emerald-400"
                                            }`}
                                    >
                                        {((tooltipContent.data.failures / tooltipContent.data.impressions) * 100).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No data available</p>
                        )}
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-[#111111]/90 border border-white/10 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500 mb-2">Failure Rate</p>
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 rounded-sm bg-emerald-500" />
                        <span className="text-xs text-gray-400">&lt;3%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 rounded-sm bg-yellow-500" />
                        <span className="text-xs text-gray-400">5-7%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 rounded-sm bg-orange-500" />
                        <span className="text-xs text-gray-400">7-10%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-4 h-3 rounded-sm bg-red-500" />
                        <span className="text-xs text-gray-400">&gt;10%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const GeoMap = memo(GeoMapComponent);
