/**
 * WaveBackground
 * Fixed, full-viewport animated background.
 * - 135° linear gradient: #0A1F44 → #1A1A3A → #2E1A47
 * - 3 layered SVG sine waves flowing horizontally (CSS-only animation)
 * - Subtle particle glow + light refraction blobs at intersections
 * - pointer-events-none so it never blocks UI
 */
export function WaveBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0A1F44 0%, #1A1A3A 55%, #2E1A47 100%)",
      }}
    >
      {/* Soft radial vignette to keep text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(0,0,0,0.35) 80%)",
        }}
      />

      {/* Refraction blobs at wave intersections */}
      <div className="wave-refract wave-refract-a" />
      <div className="wave-refract wave-refract-b" />

      {/* Particle glow at peaks */}
      <div className="wave-particles" />

      {/* Layered waves */}
      <svg
        className="wave-layer wave-1"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#ffffff"
          fillOpacity="0.10"
          d="M0,160 C240,80 480,240 720,160 C960,80 1200,240 1440,160 L1440,320 L0,320 Z"
        />
      </svg>
      <svg
        className="wave-layer wave-2"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#3A7BFF"
          fillOpacity="0.08"
          d="M0,200 C240,120 480,280 720,200 C960,120 1200,280 1440,200 L1440,320 L0,320 Z"
        />
      </svg>
      <svg
        className="wave-layer wave-3"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#9F6BFF"
          fillOpacity="0.05"
          d="M0,240 C240,160 480,320 720,240 C960,160 1200,320 1440,240 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  );
}
