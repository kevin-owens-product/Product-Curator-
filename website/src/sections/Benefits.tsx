const personas = [
  {
    letter: "C",
    title: "For Creators",
    borderColor: "border-t-green-500",
    circleBg: "bg-green-100",
    circleText: "text-green-600",
    checkColor: "text-green-500",
    items: [
      "Clear path to production. No more guessing what 'ready' means.",
      "Recognition for contributions via points, badges, and leaderboards.",
      "Find what already exists. Duplicate detection saves wasted effort.",
      "Structured feedback. Know exactly why something was iterated or killed.",
    ],
  },
  {
    letter: "Q",
    title: "For Curators",
    borderColor: "border-t-accent-500",
    circleBg: "bg-accent-100",
    circleText: "text-accent-600",
    checkColor: "text-accent-500",
    items: [
      "Managed queue. No more Slack-driven interrupts.",
      "Automated context. Blast radius, coherence, and ownership before you review.",
      "Consistent framework. Five Questions create a shared standard.",
      "Decision record. Your judgment creates institutional memory.",
    ],
  },
  {
    letter: "O",
    title: "For Owners",
    borderColor: "border-t-primary-500",
    circleBg: "bg-primary-100",
    circleText: "text-primary-600",
    checkColor: "text-primary-500",
    items: [
      "Single view of everything you own with health scores and history.",
      "Automatic incident routing. No more 'who owns this?' during outages.",
      "Clean handoffs. Transfer ownership with full context and audit trail.",
      "Health scoring tracks incident frequency, staleness, and dependencies.",
    ],
  },
  {
    letter: "L",
    title: "For Leadership",
    borderColor: "border-t-amber-500",
    circleBg: "bg-amber-100",
    circleText: "text-amber-600",
    checkColor: "text-amber-500",
    items: [
      "Coherence visibility. One number for product health.",
      "Innovation mechanisms that actually drive participation.",
      "Accountability at scale. Every production asset has a name next to it.",
      "Executive dashboard with curation velocity, graduation rates, incident trends.",
    ],
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="bg-white py-24 px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-accent-600 font-semibold tracking-widest text-sm uppercase mb-4">
          BENEFITS
        </p>
        <h2 className="text-4xl font-bold text-surface-900">
          What Changes When You Adopt Curator
        </h2>
      </div>

      {/* Persona cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {personas.map((persona) => (
          <div
            key={persona.title}
            className={`bg-surface-50 rounded-2xl p-8 border border-surface-200 border-t-4 ${persona.borderColor}`}
          >
            {/* Icon circle */}
            <div
              className={`${persona.circleBg} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
            >
              <span className={`${persona.circleText} font-bold text-lg`}>
                {persona.letter}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-surface-900 mb-5">
              {persona.title}
            </h3>

            {/* Bullet list */}
            <ul className="space-y-3">
              {persona.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className={`${persona.checkColor} mt-0.5 shrink-0 font-bold`}
                  >
                    &#10003;
                  </span>
                  <span className="text-surface-600 leading-relaxed text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
