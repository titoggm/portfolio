"use client";

import Grainient from "@/components/grainient";

interface GrainBackgroundProps {
  color?: string;
  grainAmount?: number;
  grainScale?: number;
  grainAnimated?: boolean;
  className?: string;
}

/**
 * Flat-color background with a subtle grain texture. Feeding Grainient the
 * same color for all three gradient stops collapses its warp/blend math to a
 * no-op, so only the grain noise is visible on top of a solid fill.
 */
export default function GrainBackground({
  color = "#0a0a0a",
  grainAmount = 0.02,
  grainScale = 2,
  grainAnimated = false,
  className = "",
}: Readonly<GrainBackgroundProps>) {
  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none ${className}`.trim()}>
      <Grainient
        color1={color}
        color2={color}
        color3={color}
        contrast={1}
        gamma={1}
        saturation={1}
        grainAmount={grainAmount}
        grainScale={grainScale}
        grainAnimated={grainAnimated}
      />
    </div>
  );
}
