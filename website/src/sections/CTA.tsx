export default function CTA() {
  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to curate what ships?
        </h2>
        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
          Stop drowning in software that shouldn't exist. Start shipping with
          confidence, coherence, and accountability.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="bg-white text-primary-700 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors shadow-lg"
          >
            Start Free
          </a>
          <a
            href="#"
            className="border-2 border-white/40 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:border-white hover:bg-white/10 transition-colors"
          >
            Book a Demo
          </a>
        </div>
        <p className="text-primary-200 text-sm mt-8">
          Free plan available — no credit card required. Upgrade anytime.
        </p>
      </div>
    </section>
  );
}
