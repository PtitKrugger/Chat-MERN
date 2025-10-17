import { useState, useEffect, useRef } from "react";

export function useTimer() {
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isTimerRunning) {
            intervalRef.current = setInterval(() => {
                setRemainingSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        setIsTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isTimerRunning]);

    const startTimer = (sec: number) => {
        setRemainingSeconds(sec);
        setIsTimerRunning(true);
    };

    const pauseTimer = () => setIsTimerRunning(false);

    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsTimerRunning(false);
        setRemainingSeconds(0);
    };

    return { remainingSeconds, isTimerRunning, startTimer, pauseTimer, resetTimer };
}
