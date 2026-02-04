const layers = [
  {
    number: "1",
    title: "Creation Layer",
    tagline: "Wide open. Anyone. No gates. Speed matters.",
    description:
      "Prototypes, experiments, explorations, internal tools. The more ideas tried, the faster the org learns. Curator tracks every creation so nothing gets lost.",
    bg: "bg-green-50",
    border: "border-green-200",
    circle: "bg-green-500",
    titleColor: "text-green-800",
    taglineColor: "text-green-600",
  },
  {
    number: "2",
    title: "Curation Layer",
    tagline: "Selective. Judgment applied. Coherence enforced.",
    description:
      "The Five Questions framework: Should this exist? What breaks if it\u2019s wrong? Does it fit the platform? Who will own it? What\u2019s the ongoing burden?",
    bg: "bg-accent-50",
    border: "border-accent-200",
    circle: "bg-accent-500",
    titleColor: "text-accent-800",
    taglineColor: "text-accent-600",
  },
  {
    number: "3",
    title: "Production Layer",
    tagline: "Accountable. Observable. Maintainable. Supported.",
    description:
      "Live systems serving customers with real SLAs. Every asset has an owner, every change has a blast radius assessment, every pattern maintains coherence.",
    bg: "bg-primary-50",
    border: "border-primary-200",
    circle: "bg-primary-500",
    titleColor: "text-primary-800",
    taglineColor: "text-primary-600",
  },
];

const gates = [
  { label: "Curation Gate" },
  { label: "Graduation" },
];

export default function Solution() {
  return (
    <section id="solution" className="bg-surface-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-accent-600 font-semibold tracking-widest text-sm uppercase mb-4">
            THE SOLUTION
          </p>
          <h2 className="text-4xl font-bold text-surface-900 mb-4">
            Three Layers of Work
          </h2>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">
            All work flows through three distinct layers. Curator ensures the
            right things graduate.
          </p>
        </div>

        {/* Layer Cards */}
        <div className="max-w-4xl mx-auto">
          {layers.map((layer, index) => (
            <div key={layer.number}>
              {/* Layer Card */}
              <div
                className={`${layer.bg} border-2 ${layer.border} rounded-2xl p-8 flex items-start gap-6`}
              >
                {/* Number Circle */}
                <div
                  className={`${layer.circle} text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shrink-0`}
                >
                  {layer.number}
                </div>

                {/* Content */}
                <div>
                  <h3 className={`${layer.titleColor} font-bold text-2xl mb-1`}>
                    {layer.title}
                  </h3>
                  <p className={`${layer.taglineColor} font-medium mb-3`}>
                    {layer.tagline}
                  </p>
                  <p className="text-surface-700 leading-relaxed">
                    {layer.description}
                  </p>
                </div>
              </div>

              {/* Arrow between layers */}
              {index < layers.length - 1 && (
                <div className="text-center my-4">
                  <p className="text-accent-500 text-3xl leading-none">
                    &#9660;
                  </p>
                  <p className="text-accent-600 font-semibold text-sm mt-1">
                    {gates[index].label}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Callout */}
        <p className="text-surface-600 italic max-w-2xl mx-auto text-center mt-8">
          Curator doesn&apos;t slow you down. It separates creating (which
          should be fast) from shipping (which should be intentional).
        </p>
      </div>
    </section>
  );
}
