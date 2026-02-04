export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-surface-900 to-surface-950 px-6 text-center"
    >
      {/* Overline */}
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent-400">
        The Production Curation Platform
      </p>

      {/* Headline */}
      <h1 className="max-w-4xl text-5xl font-bold leading-tight text-white md:text-6xl">
        When anyone can build,
        <br className="hidden sm:block" /> who decides what ships?
      </h1>

      {/* Subheadline */}
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-surface-300 md:text-xl">
        Curator is the operating system for AI-native development. Structured
        curation, clear ownership, and engaged teams&nbsp;&mdash; so your product
        stays coherent while your org moves fast.
      </p>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <a
          href="#start"
          className="rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Start Free
        </a>
        <a
          href="#demo"
          className="rounded-xl border border-surface-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:border-primary-400"
        >
          Book a Demo
        </a>
      </div>

      {/* Trust line */}
      <p className="mt-10 text-sm italic text-surface-400">
        Trusted by engineering teams shipping 10x faster without 10x the chaos
      </p>

      {/* Scroll-down chevron */}
      <a
        href="#features"
        aria-label="Scroll to features"
        className="absolute bottom-10 animate-bounce text-surface-500 transition-colors hover:text-primary-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
          />
        </svg>
      </a>
    </section>
  );
}
