import { motion, Transition } from "framer-motion";

export default function TypingAnimation({
    dotSize = 8,
    gap = 8,
    colorClass = "bg-slate-50 dark:bg-white",
    jump = 8,
    duration = 0.45
}) {
    const dotStyle = {
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        marginLeft: `${gap / 2}px`,
        marginRight: `${gap / 2}px`,
    };

    const bounceTransition = (delay = 0, startOffset = 0) => {
        const transition: Transition = {
            duration: duration * 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
            delay
        };

        return {
            y: [startOffset, -jump + startOffset, startOffset],
            transition,
        };
    };


    return (
        <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center"
        >
            <motion.span
                aria-hidden
                className={`rounded-full ${colorClass}`}
                style={dotStyle}
                animate={bounceTransition(0, 4)}
            />


            <motion.span
                aria-hidden
                className={`rounded-full ${colorClass}`}
                style={dotStyle}
                animate={bounceTransition(duration * 0.5, 3.5)}
            />


            <motion.span
                aria-hidden
                className={`rounded-full ${colorClass}`}
                style={dotStyle}
                animate={bounceTransition(duration, 3.5)}
            />
        </div>
    );
}