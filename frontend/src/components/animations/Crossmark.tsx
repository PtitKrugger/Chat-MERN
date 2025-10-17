import React, { useEffect } from "react"
import { animate, motion, useMotionValue, useTransform } from "framer-motion"

export default function Crossmark() {
    const progress = useMotionValue(0)
    const circleLength = useTransform(progress, [0, 100], [0, 1])
    const circleColor = useTransform(
        progress,
        [0, 95, 100],
        ["#FF4D4D", "#FF4D4D", "#FF4D4D"]
    )

    const crossProgress = useMotionValue(0)
    const crossPathLength = useTransform(crossProgress, [0, 1], [0, 1])

    const crossSize = 120
    const center = 130

    useEffect(() => {
        const circleControls = animate(progress, 100, { duration: 0.5 })
        const crossControls = animate(crossProgress, 1, { duration: 1.0, delay: 0.5 })

        return () => {
            circleControls.stop()
            crossControls.stop()
        }
    }, [progress, crossProgress])

    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 258 258"
        >
            {/* Cross*/}
            <motion.path
                d={`M ${center - crossSize / 2} ${center - crossSize / 2} L ${center + crossSize / 2} ${center + crossSize / 2}`}
                fill="transparent"
                stroke="#FF4D4D"
                strokeWidth={8}
                style={{ pathLength: crossPathLength }}
            />
            <motion.path
                d={`M ${center + crossSize / 2} ${center - crossSize / 2} L ${center - crossSize / 2} ${center + crossSize / 2}`}
                fill="transparent"
                stroke="#FF4D4D"
                strokeWidth={8}
                style={{ pathLength: crossPathLength }}
            />

            {/* Circle */}
            <motion.path
                d="M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z"
                fill="transparent"
                strokeWidth="8"
                stroke={circleColor}
                style={{ pathLength: circleLength }}
            />
        </motion.svg>
    )
}
