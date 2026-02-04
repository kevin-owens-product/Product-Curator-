const beforeSteps = [
  "Developer builds something",
  "Asks manager over Slack",
  "Manager pings architect",
  "Architect checks Slack history for context",
  "Nobody remembers previous decisions",
  "Ships anyway without full review",
  "Breaks something in production",
  '3-hour incident. "Who owns this?"',
];

const afterSteps = [
  "Creator registers in Curator",
  "Discovers 2 similar creations",
  "Collaborates with original creator",
  "Submits for curation",
  "Blast radius: Tier 1 (automated)",
  "Five Questions: PASS",
  "Graduates to production",
  "Ownership assigned, incidents auto-route",
];

const flywheelSteps = [
  {
    number: "1",
    label: "Create",
    description: "Register creations, submit for curation",
  },
  {
    number: "2",
    label: "Earn",
    description: "Points, badges, level ups",
  },
  {
    number: "3",
    label: "Compete",
    description: "Challenges, hackathons, leaderboards",
  },
  {
    number: "4",
    label: "Ship",
    description: "Graduate to production, own outcomes",
  },
];

export default function WaysOfWorking() {
  return (
    <section id="workflow" className="bg-surface-50 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-accent-600 font-semibold tracking-widest text-sm uppercase mb-4">
            IMPROVED WORKFLOWS
          </p>
          <h2 className="text-4xl font-bold text-surface-900">
            From Chaos to Structured Speed
          </h2>
        </div>

        {/* Before / After Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Before Card */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-red-800 mb-6">
              Before Curator: The Wild West
            </h3>

            <div className="flex flex-col">
              {beforeSteps.map((step, index) => (
                <div key={index}>
                  <div className="rounded-lg bg-white p-3 border border-red-100 text-surface-700 text-sm">
                    {step}
                  </div>
                  {index < beforeSteps.length - 1 && (
                    <p className="text-center text-red-300 text-lg my-1">
                      &darr;
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-red-100 rounded-lg p-3 mt-4 text-red-700 font-medium text-sm">
              Result: Weeks of delay, duplicated effort, orphaned code
            </div>
          </div>

          {/* After Card */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-green-800 mb-6">
              After Curator: Structured Speed
            </h3>

            <div className="flex flex-col">
              {afterSteps.map((step, index) => (
                <div key={index}>
                  <div className="rounded-lg bg-white p-3 border border-green-100 text-surface-700 text-sm">
                    {step}
                  </div>
                  {index < afterSteps.length - 1 && (
                    <p className="text-center text-green-300 text-lg my-1">
                      &darr;
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-green-100 rounded-lg p-3 mt-4 text-green-700 font-medium text-sm">
              Result: Days to production, zero orphaned code, 15-min MTTR
            </div>
          </div>
        </div>

        {/* Engagement Flywheel */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-surface-900 mb-8">
            The Engagement Flywheel
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {flywheelSteps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="bg-white rounded-xl p-6 border-2 border-accent-200 shadow-sm text-center w-48">
                  <div className="bg-accent-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-accent-700 font-bold text-xl">
                      {step.number}
                    </span>
                  </div>
                  <p className="font-bold text-surface-900 mb-1">
                    {step.label}
                  </p>
                  <p className="text-sm text-surface-500">
                    {step.description}
                  </p>
                </div>

                {index < flywheelSteps.length - 1 && (
                  <span className="hidden md:block text-accent-400 text-2xl mx-2">
                    &rarr;
                  </span>
                )}

                {index === flywheelSteps.length - 1 && (
                  <span className="hidden md:block text-accent-500 font-medium text-2xl mx-2">
                    &#8635;
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-surface-500 italic">
            Gamification isn&apos;t a gimmick &mdash; it makes the desired
            behavior the rewarded behavior.
          </p>
        </div>
      </div>
    </section>
  );
}
