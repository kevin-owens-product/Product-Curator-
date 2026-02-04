const rows = [
  {
    dimension: "Core Question",
    jira: "What are we building?",
    curator: "Should this exist?",
    jiraGap: false,
  },
  {
    dimension: "Focus",
    jira: "Task tracking & sprint management",
    curator: "Production curation & judgment",
    jiraGap: false,
  },
  {
    dimension: "Creation Visibility",
    jira: "Tracks planned work only",
    curator: "Tracks everything — planned, experimental, prototypes",
    jiraGap: false,
  },
  {
    dimension: "Quality Gate",
    jira: "PR review (code quality)",
    curator: "Curation review (product judgment + system impact)",
    jiraGap: false,
  },
  {
    dimension: "Blast Radius",
    jira: "Not addressed",
    curator: "Automated dependency analysis with tier recommendations",
    jiraGap: true,
  },
  {
    dimension: "Coherence",
    jira: "Not addressed",
    curator: "Active scoring, pattern compliance, flag system",
    jiraGap: true,
  },
  {
    dimension: "Ownership",
    jira: "Informal (assigned in tickets)",
    curator:
      "First-class registry with transfer history & health scoring",
    jiraGap: false,
  },
  {
    dimension: "Innovation",
    jira: "Hackathon doc in Google Drive",
    curator: "Built-in challenges, hackathons with gamification",
    jiraGap: false,
  },
  {
    dimension: "Incentives",
    jira: "None",
    curator: "Points, badges, levels, leaderboards, rewards",
    jiraGap: false,
  },
  {
    dimension: "Decision History",
    jira: "Comment threads in tickets",
    curator: "Five Questions framework with full audit trail",
    jiraGap: false,
  },
];

const clarifications = [
  {
    title: "vs. Feature Flags",
    body: "Feature flags control rollout. Curator controls what should exist in the first place.",
  },
  {
    title: "vs. Code Review",
    body: "Code review asks 'is this correct?' Curation asks 'should this exist, and what are the consequences?'",
  },
  {
    title: "vs. Spreadsheets",
    body: "Many teams track ownership in spreadsheets that are stale within a week. Curator makes it live and auditable.",
  },
];

export default function Comparison() {
  return (
    <section id="comparison" className="bg-surface-900 py-24 px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-accent-400 font-semibold tracking-widest text-sm uppercase mb-4">
          COMPARISON
        </p>
        <h2 className="text-4xl font-bold text-white mb-4">
          Curator vs. The Status Quo
        </h2>
        <p className="text-lg text-surface-400 max-w-3xl mx-auto">
          Curator doesn&apos;t replace your project management tool. It adds the
          judgment layer that&apos;s missing.
        </p>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block max-w-5xl mx-auto rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-800">
              <th className="px-6 py-4 text-sm font-semibold text-surface-300 uppercase tracking-wider">
                Dimension
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-surface-300 uppercase tracking-wider">
                JIRA / Linear
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-surface-300 uppercase tracking-wider">
                Curator
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.dimension}
                className={
                  i % 2 === 0 ? "bg-surface-800/50" : "bg-surface-800/30"
                }
              >
                <td className="px-6 py-4 font-medium text-surface-300">
                  {row.dimension}
                </td>
                <td className="px-6 py-4 text-surface-400">
                  {row.jiraGap ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-red-400">&#10007;</span>
                      {row.jira}
                    </span>
                  ) : (
                    row.jira
                  )}
                </td>
                <td className="px-6 py-4 text-primary-300">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-green-400">&#10003;</span>
                    {row.curator}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile stacked cards ── */}
      <div className="md:hidden max-w-5xl mx-auto space-y-4">
        {rows.map((row, i) => (
          <div
            key={row.dimension}
            className={`rounded-xl p-5 ${
              i % 2 === 0 ? "bg-surface-800/50" : "bg-surface-800/30"
            }`}
          >
            <p className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
              {row.dimension}
            </p>

            <div className="space-y-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  JIRA / Linear
                </span>
                <p className="text-surface-400 mt-0.5">
                  {row.jiraGap ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-red-400">&#10007;</span>
                      {row.jira}
                    </span>
                  ) : (
                    row.jira
                  )}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                  Curator
                </span>
                <p className="text-primary-300 mt-0.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-green-400">&#10003;</span>
                    {row.curator}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Clarification cards ── */}
      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {clarifications.map((card) => (
          <div
            key={card.title}
            className="bg-surface-800 rounded-xl p-6"
          >
            <h3 className="text-white font-semibold text-lg mb-2">
              {card.title}
            </h3>
            <p className="text-surface-300 leading-relaxed">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
