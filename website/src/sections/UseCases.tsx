import { useState } from "react";

interface UseCase {
  tab: string;
  persona: string;
  personaBg: string;
  personaText: string;
  title: string;
  story: string;
  without: string;
  withCurator: string;
  benefits: string[];
}

const useCases: UseCase[] = [
  {
    tab: "Prototype to Production",
    persona: "Creator",
    personaBg: "bg-green-100",
    personaText: "text-green-700",
    title: "Prototype to Production",
    story:
      "Sarah, a PM, uses AI to build a customer dashboard prototype in an afternoon. She registers it in Curator, discovers two similar creations already exist, collaborates with the original creator, and submits a combined version for curation. The blast radius engine confirms Tier 1 (low impact), and it graduates to production in 48 hours.",
    without:
      "Sarah\u2019s prototype sits in a branch. Nobody knows it exists. A month later, another team builds the same thing. Neither ships.",
    withCurator:
      "Every creation is visible from day one. Duplicate detection prevents wasted effort. A clear path from idea to production means value ships in days.",
    benefits: [
      "100% creation visibility \u2014 nothing gets lost",
      "Duplicate detection before wasted effort",
      "Clear path from idea to production",
      "Sub-48-hour curation cycle time",
    ],
  },
  {
    tab: "Structured Curation",
    persona: "Production Curator",
    personaBg: "bg-accent-100",
    personaText: "text-accent-700",
    title: "Structured Curation",
    story:
      "Marcus manages a curation queue. Each submission comes pre-analyzed with blast radius data, coherence scoring, and ownership mapping. He applies the Five Questions framework and records a decision with rationale. The creator gets structured feedback \u2014 not a vague \u2018not now.\u2019",
    without:
      "Marcus gets pinged on Slack, reviews code in a PR with no context about system impact, and gives verbal feedback that\u2019s never recorded.",
    withCurator:
      "A managed queue with full context. Consistent evaluation framework. Decisions recorded with rationale, creating institutional memory.",
    benefits: [
      "Structured evaluation replaces gut-feel reviews",
      "Five Questions framework creates consistency",
      "Blast radius analysis is automated, not tribal",
      "Decision history creates institutional memory",
    ],
  },
  {
    tab: "Clear Ownership",
    persona: "Accountable Owner",
    personaBg: "bg-primary-100",
    personaText: "text-primary-700",
    title: "Clear Ownership",
    story:
      "When an incident fires for the payments service, Curator automatically attributes it to the owner, shows the asset\u2019s full history \u2014 who built it, when it graduated, what changed recently \u2014 and tracks acknowledgment and resolution. When the owner changes teams, ownership transfers with a full audit trail.",
    without:
      "An alert fires. Three people argue about who owns it. The person who wrote it left six months ago. Nobody knows the full context.",
    withCurator:
      "Every production asset has an owner. Incidents auto-route. Ownership transfers carry full context and audit trail.",
    benefits: [
      "Zero orphaned production code",
      "Automatic incident attribution",
      "Clean ownership transfers with context",
      "Health scoring per asset",
    ],
  },
  {
    tab: "Focused Innovation",
    persona: "Engineering Leadership",
    personaBg: "bg-amber-100",
    personaText: "text-amber-700",
    title: "Focused Innovation",
    story:
      "The VP of Engineering creates a challenge: \u2018Reduce checkout abandonment by 15%.\u2019 Twenty-three creators participate over two weeks. Submissions are scored by judges on impact, feasibility, and coherence. The winner\u2019s solution is fast-tracked through curation. A quarterly hackathon generates 40 prototypes in 48 hours \u2014 8 graduate to production.",
    without:
      "Leadership sends an email asking for ideas. Three people respond. Nothing is tracked.",
    withCurator:
      "Challenges direct creativity toward strategic problems. Hackathons produce real output. Gamification sustains engagement beyond launch week.",
    benefits: [
      ">20% participation rate per challenge",
      "Hackathons that actually ship to production",
      "Gamification sustains long-term engagement",
      "Innovation aligned with strategic priorities",
    ],
  },
  {
    tab: "Coherence Visibility",
    persona: "Squad Lead",
    personaBg: "bg-teal-100",
    personaText: "text-teal-700",
    title: "Coherence Visibility",
    story:
      "The coherence dashboard shows a score of 72/100 for the workspace. Three pattern violations flagged this month: inconsistent button styles, duplicate API endpoints, and architectural drift in the data layer. The squad lead can see which creations introduced the violations and address them before they compound.",
    without:
      "Six months later, the design team complains the product \u2018feels disjointed.\u2019 Nobody can pinpoint when or why it happened.",
    withCurator:
      "A single coherence score gives instant product health visibility. Pattern violations are caught and attributed before they compound.",
    benefits: [
      "Single metric for product health",
      "Pattern violations caught early",
      "Attribution links issues to specific changes",
      "Trend lines show improvement or degradation",
    ],
  },
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState(0);
  const current = useCases[activeTab];

  return (
    <section id="usecases" className="bg-white px-6 py-24">
      {/* Header */}
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">
          Use Cases
        </p>
        <h2 className="mt-3 text-4xl font-bold text-surface-900">
          See Curator in Action
        </h2>
        <p className="mt-4 text-lg text-surface-500">
          Real workflows. Real impact. Real before-and-after.
        </p>
      </div>

      {/* Tabs + Content */}
      <div className="mx-auto mt-14 max-w-5xl">
        {/* Tab bar */}
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {useCases.map((uc, idx) => (
            <button
              key={uc.tab}
              onClick={() => setActiveTab(idx)}
              className={`shrink-0 cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
                idx === activeTab
                  ? "bg-primary-600 text-white"
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200"
              }`}
            >
              {uc.tab}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        <div className="mt-8">
          {/* Persona badge + title */}
          <div className="mb-6">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${current.personaBg} ${current.personaText}`}
            >
              {current.persona}
            </span>
            <h3 className="mt-3 text-2xl font-bold text-surface-900">
              {current.title}
            </h3>
          </div>

          {/* Story */}
          <p className="mb-8 leading-relaxed text-surface-600">
            {current.story}
          </p>

          {/* Before / After comparison */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            {/* Without Curator */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h4 className="mb-3 text-lg font-semibold text-red-700">
                Without Curator
              </h4>
              <p className="leading-relaxed text-surface-600">
                {current.without}
              </p>
            </div>

            {/* With Curator */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <h4 className="mb-3 text-lg font-semibold text-green-700">
                With Curator
              </h4>
              <p className="leading-relaxed text-surface-600">
                {current.withCurator}
              </p>
            </div>
          </div>

          {/* Key Benefits */}
          <div>
            <h4 className="mb-3 text-lg font-semibold text-surface-900">
              Key Benefits
            </h4>
            <ul className="space-y-2">
              {current.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <span className="mt-0.5 text-lg font-bold text-primary-600">
                    &#10003;
                  </span>
                  <span className="text-surface-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
