"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseAutoRefreshOptions<T> {
    /** Fetch function that returns data */
    fetchFn: () => Promise<T>;
    /** Interval in milliseconds (default: 5000) */
    intervalMs?: number;
    /** Whether to start fetching immediately (default: true) */
    immediate?: boolean;
    /** Callback when data is updated */
    onUpdate?: (data: T) => void;
    /** Callback on error */
    onError?: (error: Error) => void;
}

interface UseAutoRefreshReturn<T> {
    /** The fetched data */
    data: T | null;
    /** Whether currently loading */
    loading: boolean;
    /** Last sync timestamp */
    lastSyncTime: Date | null;
    /** Seconds since last sync */
    secondsAgo: number;
    /** Any error that occurred */
    error: Error | null;
    /** Manually trigger a refresh */
    refresh: () => Promise<void>;
    /** Pause auto-refresh */
    pause: () => void;
    /** Resume auto-refresh */
    resume: () => void;
    /** Whether auto-refresh is paused */
    isPaused: boolean;
}

/**
 * Custom hook for auto-refreshing data at a specified interval.
 * Updates the "Synced X seconds ago" display in real-time.
 */
export function useAutoRefresh<T>({
    fetchFn,
    intervalMs = 5000,
    immediate = true,
    onUpdate,
    onError,
}: UseAutoRefreshOptions<T>): UseAutoRefreshReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [secondsAgo, setSecondsAgo] = useState(0);
    const [error, setError] = useState<Error | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const secondsIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    // Use refs to avoid recreating refresh function
    const fetchFnRef = useRef(fetchFn);
    const onUpdateRef = useRef(onUpdate);
    const onErrorRef = useRef(onError);

    // Keep refs updated
    useEffect(() => {
        fetchFnRef.current = fetchFn;
        onUpdateRef.current = onUpdate;
        onErrorRef.current = onError;
    }, [fetchFn, onUpdate, onError]);

    const refresh = useCallback(async () => {
        if (!isMountedRef.current) return;

        try {
            setLoading(true);
            setError(null);
            const result = await fetchFnRef.current();

            if (!isMountedRef.current) return;

            setData(result);
            setLastSyncTime(new Date());
            setSecondsAgo(0);
            onUpdateRef.current?.(result);
        } catch (err) {
            if (!isMountedRef.current) return;

            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            onErrorRef.current?.(error);
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, []); // No dependencies - uses refs

    const pause = useCallback(() => {
        setIsPaused(true);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const resume = useCallback(() => {
        setIsPaused(false);
    }, []);

    // Update seconds ago counter every second
    useEffect(() => {
        secondsIntervalRef.current = setInterval(() => {
            if (lastSyncTime && isMountedRef.current) {
                const diff = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
                setSecondsAgo(diff);
            }
        }, 1000);

        return () => {
            if (secondsIntervalRef.current) {
                clearInterval(secondsIntervalRef.current);
            }
        };
    }, [lastSyncTime]);

    // Initial fetch
    useEffect(() => {
        isMountedRef.current = true;

        if (immediate) {
            refresh();
        }

        return () => {
            isMountedRef.current = false;
        };
    }, [immediate, refresh]);

    // Set up auto-refresh interval (separate effect)
    useEffect(() => {
        // Clear existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Set up new interval if not paused
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                refresh();
            }, intervalMs);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [intervalMs, isPaused, refresh]);

    return {
        data,
        loading,
        lastSyncTime,
        secondsAgo,
        error,
        refresh,
        pause,
        resume,
        isPaused,
    };
}

/**
 * Simplified version specifically for telemetry data
 */
export function useTelemetryRefresh(intervalMs = 5000) {
    // Use useCallback to prevent recreating fetch function
    const fetchFn = useCallback(async () => {
        const res = await fetch("/api/telemetry?count=50");
        if (!res.ok) throw new Error("Failed to fetch telemetry");
        const data = await res.json();
        return data;
    }, []);

    return useAutoRefresh({
        fetchFn,
        intervalMs,
    });
}
