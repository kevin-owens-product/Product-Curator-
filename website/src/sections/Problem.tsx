const problems = [
  {
    number: "01",
    title: "Judgment Gap",
    subtitle: "You can build anything. Should you?",
    body: "AI lets everyone generate working code. Without structured evaluation, organizations drown in software that shouldn\u2019t exist. The scarce resource is no longer engineering \u2014 it\u2019s taste.",
  },
  {
    number: "02",
    title: "Invisible Blast Radius",
    subtitle: "What breaks when this ships?",
    body: "Creators don\u2019t understand downstream consequences. Blast radius is tribal knowledge locked in senior engineers\u2019 heads \u2014 unavailable at the moment of decision.",
  },
  {
    number: "03",
    title: "Coherence Decay",
    subtitle: "Your product is becoming Frankenstein.",
    body: "Every uncoordinated feature degrades the whole. Without active curation, products become patchwork quilts of disconnected functionality. Nobody guards the system-level experience.",
  },
  {
    number: "04",
    title: "Accountability Vacuum",
    subtitle: "Everyone can ship. Nobody owns the aftermath.",
    body: "Distributed creation without distributed ownership creates orphaned code and finger-pointing. When an incident fires at 2am, three people argue about who\u2019s responsible.",
  },
];

export default function Problem() {
  return (
    <section id="features" className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent-600 font-semibold tracking-widest text-sm uppercase mb-4">
            THE PROBLEM
          </p>
          <h2 className="text-4xl font-bold text-surface-900 mb-4">
            The AI Productivity Paradox
          </h2>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">
            When building is cheap, four new bottlenecks emerge
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem) => (
            <div
              key={problem.number}
              className="bg-surface-50 rounded-2xl p-8 border border-surface-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <p className="text-accent-500 font-mono font-bold text-3xl mb-4">
                {problem.number}
              </p>
              <h3 className="font-bold text-xl text-surface-900 mb-2">
                {problem.title}
              </h3>
              <p className="text-primary-600 font-medium italic mb-3">
                {problem.subtitle}
              </p>
              <p className="text-surface-600 leading-relaxed">
                {problem.body}
              </p>
            </div>
          ))}
        </div>

        {/* Pullquote */}
        <div className="bg-surface-900 rounded-2xl p-8 mt-12 max-w-4xl mx-auto text-center">
          <div className="w-12 h-1 bg-accent-500 mx-auto mb-6" />
          <blockquote className="text-white text-2xl font-semibold">
            JIRA tracks what you&apos;re building. Curator decides whether it
            should exist.
          </blockquote>
        </div>
      </div>
    </section>
  );
}
