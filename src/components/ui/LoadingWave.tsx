"use client";

import { motion } from "framer-motion";

interface LoadingWaveProps {
  size?: "sm" | "md" | "lg";
}

export function LoadingWave({ size = "md" }: LoadingWaveProps) {
  const sizes = {
    sm: "w-16",
    md: "w-24",
    lg: "w-32",
  };

  // Enhanced wave animation with more natural motion
  const waveVariants = {
    animate: {
      d: [
        "M0 37.5C20 25 40 37.5 60 50C80 62.5 100 25 120 37.5C140 50 160 37.5 180 25",
        "M0 25C20 37.5 40 50 60 37.5C80 25 100 37.5 120 50C140 37.5 160 25 180 37.5",
        "M0 37.5C20 50 40 37.5 60 25C80 37.5 100 50 120 37.5C140 25 160 37.5 180 50",
        "M0 50C20 37.5 40 25 60 37.5C80 50 100 37.5 120 25C140 37.5 160 50 180 37.5",
      ],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const,
        times: [0, 0.33, 0.66, 1],
      },
    },
  };

  // Text animation for each letter
  const letters = "Loading...".split("");

  const letterVariants = {
    animate: (i: number) => ({
      color: ["#0891B2", "#E4D5C3", "#0891B2"],
      y: [0, -4, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizes[size]} aspect-[5/2] relative`}>
        {/* Background wave for depth effect */}
        <motion.svg
          viewBox="0 0 180 75"
          fill="none"
          className="absolute inset-0 opacity-30"
        >
          <motion.path
            variants={waveVariants}
            animate="animate"
            stroke="url(#wave-gradient-bg)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient
              id="wave-gradient-bg"
              x1="0"
              y1="0"
              x2="180"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#22D3EE" />
              <stop offset="1" stopColor="#0891B2" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Foreground wave */}
        <motion.svg viewBox="0 0 180 75" fill="none" className="relative z-10">
          <motion.path
            variants={waveVariants}
            animate="animate"
            stroke="url(#wave-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient
              id="wave-gradient"
              x1="0"
              y1="0"
              x2="180"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0891B2" />
              <stop offset="1" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Animated text */}
      <div className="flex items-center justify-center">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={letterVariants}
            animate="animate"
            className="text-lg font-medium"
            style={{
              display: "inline-block",
              whiteSpace: "pre",
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
